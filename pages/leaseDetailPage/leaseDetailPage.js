// pages/adminLeaseListPage/leaseDetailPage/leaseDetailPage.js
import {
  adminLeaseDetail,
  adminLeaseBills,
  adminLeaseContract,
  getPayType,
  platformBills,
  getDistributionByHouseId,
  updateOfflineTradeResult,
  wNativePay
} from "../../utils/url.js"
var dateTool = require('../../utils/date.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    qingfen: {//清分参数
      agent: 0,//手续费
      houseId: '',
      orderId: '',
      payType: '',//1公寓支付2租客支付
      psw: '123456',
      type: 1,
    },
    queryDetail:'',//获取的二维码字符串
    showagent:0,//用于展示的手续费
    selectIndex: 0,
    leaseId: 0,
    houseId: '',
    tenantList: [], // 入住人信息
    signList: {}, // 承租人信息
    leaseDetail: null, // 租约详情
    leaseBill: [], // 账单
    isAll: false, // 全选
    selectBillNum: 0, // 已选择的账单
    moneyTotal: 0, // 总金额
    contractImg: null,
    showPayWay: 2,//当前是哪种支付方式
    bills: [],//获取订单
    checkedInfor:[],//选中的账单
  },
  // 收款码
  logoQRCodee(obj){
    wx.navigateTo({
      url: "/pages/logoQRCode/logoQRCode?payType=" + this.data.qingfen.payType + "&houseId=" + this.data.houseId + "&showagent=" + this.data.showagent + "&moneyTotal=" + this.data.moneyTotal + "&params=" + JSON.stringify(obj) ,
    })
  },

  // 批量处理用于扫码支付
  platformBillss(){
    if (this.data.showPayWay != 2) {
      wx.showToast({
        title: "当前支付方式暂不支持扫码支付",
        icon: 'none',
        duration: 1500
      })
      return
    }
    this.data.bills = []
    for (let i = 0; i < this.data.checkedInfor.length; i++) {//过滤选中的账单
      if (this.data.checkedInfor[i].payStatus == 1) {
        wx.showToast({
          title: "您选择的账单中存在已付款账单",
          icon: 'none',
          duration: 1500
        })
        return
      }
      let obj = {
        billsCost: this.data.checkedInfor[i].accountReceivable,
        billsId: this.data.checkedInfor[i].billsId,
        pkId: this.data.checkedInfor[i].pkId
      }
      this.data.bills.push(obj)
    }
    if (this.data.bills.length == 0) {
      wx.showToast({
        title: "您还未选择未支付订单",
        icon: 'none',
        duration: 1500
      })
      return
    }
    let params = this.data.bills
    console.log(params)
    // 账单支付
    platformBills(params).then(res=>{
      console.log(res)
      if(res.data.code == 200){
        let pparams={
          houseId:this.data.houseId
        }
        getDistributionByHouseId(pparams).then(rres => {// 清分方式
          console.log(rres)
          if (rres.data.code == 200){
            let obj = ''
            if (rres.data.data.length == 0) {
              wx.showToast({
                title: "请先配置支付",
                icon: 'none',
                duration: 1500
              })
              return
            } else {
              if (this.data.qingfen.type == 1) {
                obj = rres.data.data.find(item => {
                  return item.type == 2
                })
              } else {
                obj = rres.data.data.find(item => {
                  return item.type == 4
                })
              }
            }
            this.data.qingfen.payType = obj.payType,
            this.data.qingfen.agent = ((Number(this.data.moneyTotal) * Number(obj.disRatio) / (1 - obj.disRatio)) * 100).toFixed(0)
            this.data.showagent = ((Number(this.data.moneyTotal) * Number(obj.disRatio) / (1 - obj.disRatio))).toFixed(2)
            let paramss = {
              agent: this.data.qingfen.agent,
              houseId: this.data.houseId,
              orderId: res.data.data,
              payType: this.data.qingfen.payType,
              psw: this.data.qingfen.psw,
              type: this.data.qingfen.type,
            }
            console.log(paramss)
            this.logoQRCodee(paramss)

          } else {
            wx.showToast({
              title: rres.data.msg,
              icon: 'none',
              duration: 1500
            })
          }
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  // 查看当前是哪种支付方式
  getPayTypee() {
    getPayType().then(res => {
      console.log(res)
      if (res.data.code == 200) {
        this.setData({
          showPayWay: res.data.data.type
        })
      }else{
        console.log(res.data.msg)
      }
    })
  },
  // 底部点击事件
  leaseBottomClick: function (e) {
    this.setData({
      selectIndex: e.currentTarget.dataset.item
    })
    this.getLeaseWithIndex(this.data.selectIndex);
  },

  // 顶部foot点击
  footClick: function (e) {
    switch (e.currentTarget.dataset.item) {
      case "history" : 
        {
          wx.navigateTo({
            url: '/pages/lookingLeaseBillsPage/lookingLeaseBillsPage?leaseId=' + this.data.leaseId,
          })
        }
        break;
      case "addBill" : 
        {
          wx.navigateTo({
            url: '/pages/leaseAddBillPage/leaseAddBillPage?leaseId=' + this.data.leaseId,
          })
        }
        break;
      default : 
        {
          wx.navigateTo({
            url: '/pages/leaseCheckOutPage/leaseCheckOutPage?leaseId=' + this.data.leaseId,
          })
        }
        break;
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.qingfen.houseId = options.houseId
    this.setData({
      selectIndex: options.selectIndex,
      leaseId: options.leaseId,
      houseId: options.houseId,
      qingfen: this.data.qingfen
    })
    this.getLeaseWithIndex(0);
    if (options.selectIndex != 0) {
      this.getLeaseWithIndex(this.data.selectIndex);
    }
  },

  // 请求数据
  getLeaseWithIndex: function (index) {
    switch (parseInt(index)) {
      case 0:
        {
          if (!this.data.leaseDetail) {
            this.getLeaseDetail();
          }
        }
        break;
      case 1:
        {
          if (!this.data.contractImg) {
            this.getLeaseContract();
          }
        }
        break;
      case 2:
        {
          if (this.data.leaseBill.length == 0) {
            this.getLeaseBills();
          }
        }
        break;
      default:
        {
          
        }
        break;
    }
  },

  // 租约合同
  getLeaseContract: function () {
    let params = {
      leaseId: this.data.leaseId
    }
    adminLeaseContract(params).then(res => {
      if (res.data.code == 200) {
        this.setData({
          contractImg: res.data.data.pictureList[0].picture
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },
  
  // 查看大图
  contractImgClick: function() {
    wx.previewImage({
      urls: [this.data.contractImg],
    })
  },

  // 租约账单
  getLeaseBills: function () {
    let params = {
      leaseId: this.data.leaseId
    }
    adminLeaseBills(params).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        this.setData({
          isAll: false, 
          selectBillNum: 0, 
          moneyTotal: 0, 
          leaseBill: res.data.data.map(iitem => {
            iitem.startDateStr = dateTool.formatTimeStamp(iitem.startDate / 1000, "yyyy.MM.dd");
            iitem.endDateStr = dateTool.formatTimeStamp(iitem.endDate / 1000, "yyyy.MM.dd");
            iitem.bills.map(item => {
              item.isSelct = false;
              item.billsId = iitem.billsId
              item.receivableDateStr = dateTool.formatTimeStamp(item.receivableDate / 1000, "yyyy.MM.dd");
              item.receiptDateStr = dateTool.formatTimeStamp(item.receiptDate / 1000, "yyyy.MM.dd");
              item.payStatusStr = item.validStatus == 0 ? (item.payStatus == 0 ? '未支付' : '已支付') : '坏账';
            })
            return iitem;
          })
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  // 全选
  selectAllClick: function () {
    this.data.isAll = !this.data.isAll;
    var num = 0;
    var total = 0;
    this.data.leaseBill.map(item => {
      item.bills.map(item => {
        item.isSelct = this.data.isAll;
        return item;
      })
      if (this.data.isAll) {
        num += item.bills.length;
        total += item.totalMoney;
      }
      return item;
    })
    this.setData({
      moneyTotal: Number(total).toFixed(2),
      selectBillNum: num,
      isAll: this.data.isAll,
      leaseBill: this.data.leaseBill
    })
  },

  // 账单选择
  billSelectClick: function (e) {
    let itemId = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.id;
    var leaseBillItem = this.data.leaseBill[itemId];
    var billItem = leaseBillItem.bills[index];
    billItem.isSelct = !billItem.isSelct;

    var num = 0;
    var total = 0;
    var numTotal = 0;
    this.data.checkedInfor=[]
    let _this = this
    this.data.leaseBill.map(item => {
      item.bills.map(item => {
        if (item.isSelct) {
          num += 1;
          total += item.accountReceivable;
          _this.data.checkedInfor.push(item)
        }
        numTotal += 1;
        return item;
      })
      return item;
    })
    this.data.isAll = num == numTotal;
    console.log(this.data.checkedInfor)
    this.setData({
      moneyTotal: Number(total).toFixed(2),
      selectBillNum: num,
      isAll: this.data.isAll,
      leaseBill: this.data.leaseBill
    })
  },

  // 查看账单详情
  billItemSelectClick: function (e) {
    var leaseBillItem = this.data.leaseBill[e.currentTarget.dataset.item];
    var billItem = leaseBillItem.bills[e.currentTarget.dataset.id];
    wx.navigateTo({
      url: '/pages/leaseBillDetail/leaseBillDetail?billItem=' + JSON.stringify(billItem),
    })
  },

  // 租约详情
  getLeaseDetail: function () {
    let params = {
      leaseId: this.data.leaseId
    }
    adminLeaseDetail(params).then(res => {
      if (res.data.code == 200) {

        var signList = res.data.data.signList;
        signList.signTimeStr = dateTool.formatTimeStamp(signList.signTime / 1000);
        if (signList.contractType == 0) {
          signList.contractTypeStr = "纸字合同";
        } else if (signList.contractType == 1) {
          signList.contractTypeStr = "电子合同";
        }

        var leaseDetail = res.data.data;
        leaseDetail.startTimeStr = dateTool.formatTimeStamp(leaseDetail.startTime / 1000, "yyyy.MM.dd");
        leaseDetail.endTimeStr = dateTool.formatTimeStamp(leaseDetail.endTime / 1000, "yyyy.MM.dd");
        if (leaseDetail.status == 0) {
          leaseDetail.statusStr = "待确认";
        } else if (leaseDetail.status == 1) {
          leaseDetail.statusStr = "签约成功";
        } else if (leaseDetail.status == 2) {
          leaseDetail.statusStr = "已退房";
        } 
        if (leaseDetail.idNumberType == 0) {
          leaseDetail.idNumberTypeStr = "身份证";
        }
        
        this.setData({
          signList: signList,
          tenantList: res.data.data.tenantList.map(item => {
            if (item.isLease) {
              item.leaseType = "在住";
            } else {
              item.leaseType = "已退房";
            }
            return item;
          }),
          leaseDetail: leaseDetail
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {  
    this.getLeaseBills();
    this.getLeaseDetail();
    this.getPayTypee()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})