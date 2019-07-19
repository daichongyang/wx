// pages/myBills/myBills.js
// pages/adminLeaseListPage/leaseDetailPage/leaseDetailPage.js
import {
  adminLeaseDetail,
  adminLeaseBills,
  adminLeaseContract
} from "../../utils/url.js"
import {getDateArray,} from "../../utils/myDate.js"
var dateTool = require('../../utils/date.js');
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: 0,
    show: false,
    showTitel: '',
    noShowTitel: '',
    current: 1,
    reservationlist: [],//房间列表
    houseName:'',
    houseNumber:'',
    houseId:'',
    status: 0,
    leaseId: 0,
    tenantList: [], // 入住人信息
    signList: {}, // 承租人信息
    leaseDetail: null, // 租约详情
    leaseBill: [], // 账单
    isAll: false, // 全选
    selectBillNum: 0, // 已选择的账单
    moneyTotal: 0, // 总金额
    payQueryArr: [],//已勾选的账单
    contractImg: null,
    payStatus:'',//支付状态
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.setData({
    //   selectIndex: options.selectIndex,
    //   leaseId: options.leaseId
    // })
    // this.getLeaseWithIndex(0);
    // if (options.selectIndex != 0) {
    //   this.getLeaseWithIndex(this.data.selectIndex);
    // }
    this.loadDataSource()

  },
  //点击去支付
  payClick: function () {
    if (!this.data.payQueryArr.length) {
      wx.showToast({
        title: '请选择支付项',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    console.log(JSON.stringify(this.data.payQueryArr))
    wx.request({
      method: "POST",
      url: utils.leaseBillsPayUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: JSON.stringify(this.data.payQueryArr),

      success: res => {
        console.log(res);
        if(res.data.code == 200){
          this.gochoisePay(res.data.data, this.data.houseId)
        }
      }
    })
  },
  // 支付页面
  gochoisePay(orderId, houseId) {
    let payMoney = this.data.moneyTotal
    wx.navigateTo({
      url: '/pages/choisePay/choisePay?orderId=' + orderId + '&houseId=' + houseId + '&payMoney=' + payMoney
    })
  },

  // 历史账单
  footClick: function () {
    wx.navigateTo({
      url: '/pages/lookingLeaseBillsPage/lookingLeaseBillsPage?leaseId=' + this.data.leaseId,
    })
  },

  // 切换房间
  changeHouse(e){
    console.log(e)
    this.setData({
      houseName: this.data.reservationlist[e.detail.value].name,
      leaseId: this.data.reservationlist[e.detail.value].leaseId,
      houseId: this.data.reservationlist[e.detail.value].houseId,
      houseNumber: this.data.reservationlist[e.detail.value].houseNumber,
    })
    this.getLeaseBills()
  },

  //账单列表
  getLeaseBills: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.leaseBillsUrl + this.data.leaseId + '/0',
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method: "POST",
      success: res => {
        console.log(res); 
        if (res.data.code == 200) {
          let _this = this
          let total = 0
          let num = 0
          this.setData({
            leaseBill: res.data.data.map((iitem,index) => {
              iitem.startDateStr = dateTool.formatTimeStamp(iitem.startPayment / 1000, "yyyy.MM.dd");
              iitem.endDateStr = dateTool.formatTimeStamp(iitem.endPayment / 1000, "yyyy.MM.dd");
              iitem.receiptDateStr = getDateArray(iitem.startPayment)[18];
              iitem.detailVos.map(item => {
                if (item.validStatus == 0 && item.payStatus == 1){
                  console.log(index)
                  item.isSelct = false;
                  total += item.accountReceivable;
                  num += 1;
                }else{
                  item.isSelct = false;
                }
                item.billsId = iitem.billsId;
                item.startDateStr = iitem.startDateStr
                item.endDateStr = iitem.endDateStr
                item.receivableDateStr = dateTool.formatTimeStamp(item.receivableDate / 1000, "yyyy.MM.dd");
              })
              this.setData({
                moneyTotal: Number(total).toFixed(2),
                selectBillNum: num,
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
        wx.hideLoading();
      }
    })
  },
  //公寓房间
  loadDataSource: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.leaseListUrl+"/1",
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          if (!res.data.data) {
            return;
          }
          this.data.reservationlist = res.data.data.filter(item=>{
            item.houseName = item.name + item.houseNumber
            return item
          })
          this.setData({
            houseName: this.data.reservationlist[0].name,
            leaseId: this.data.reservationlist[0].leaseId,
            houseId: this.data.reservationlist[0].houseId,
            payStatus: this.data.reservationlist[0].payStatus,
            houseNumber: this.data.reservationlist[0].houseNumber,
            reservationlist: this.data.reservationlist
          })
          this.getLeaseBills()
        }
      }
    })
  },

  // 全选
  selectAllClick: function () {
    this.data.isAll = !this.data.isAll;
    var num = 0;
    var total = 0;
    let _this= this
    this.data.leaseBill.map((item,index) => {
      item.detailVos.map(item => {
        if (item.validStatus == 0&&item.payStatus == 1){
          item.isSelct = false
        }else{
          item.isSelct = this.data.isAll;
        }
        return item;
      })
      if (this.data.isAll) {
        num += item.detailVos.length;
        for (let i = 0; i < item.detailVos.length;i++){
          total += item.detailVos[i].accountReceivable;
        }
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

  // 选择单个账单
  billSelectClick: function (e) {
    console.log(e)
    let itemId = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.id;
    var leaseBillItem = this.data.leaseBill[itemId];
    var billItem = leaseBillItem.detailVos[index];
    if (billItem.validStatus == 0 && billItem.payStatus == 1){
      billItem.isSelct = false;
    }else{
      billItem.isSelct = !billItem.isSelct;
    }
    var num = 0;
    var total = 0;
    var numTotal = 0;
    this.data.payQueryArr=[]
    this.data.leaseBill.map((item) => {
      item.detailVos.map(item => {
        if (item.isSelct) {
          console.log(item)
          num += 1;
          total += item.accountReceivable;
          let obj = {
            billsCost: item.accountReceivable,
            billsId: item.billsId,
            pkId: item.pkId,
          }
          this.data.payQueryArr.push(obj)
        }
        numTotal += 1;
        return item;
      })
      return item;
    })
    this.data.isAll = num == numTotal;
    this.setData({
      moneyTotal: Number(total).toFixed(2),
      selectBillNum: num,
      isAll: this.data.isAll,
      leaseBill: this.data.leaseBill
    })
    console.log(this.data.payQueryArr)
  },

  // 查看账单详情
  billItemSelectClick: function (e) {
    var leaseBillItem = this.data.leaseBill[e.currentTarget.dataset.item];
    var billItem = leaseBillItem.detailVos[e.currentTarget.dataset.id];
    wx.navigateTo({
      url: '/pages/leaseBillDetail2/leaseBillDetail2?billItem=' + JSON.stringify(billItem),
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
  //请求数据预定房间信息
  loadDataSourceList: function () {
    // wx.showLoading({
    //   title: '正在加载...',
    // })
    wx.request({
      method: "POST",
      url: utils.adminLeaseListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        current: this.data.current,
        size: 10,
        leaseStatus: this.data.status,
        status: 0
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          // wx.hideLoading();
          for (let i = 0; i < res.data.data.records.length; i++) {
            var obj = res.data.data.records[i];
            var startTimeTemp = obj.startTime / 1000;
            var startTime = util.formatTimeTwo(startTimeTemp, 'Y-M-D');
            obj.startTime = startTime;

            var endTimeTemp = obj.endTime / 1000;
            var endTime = util.formatTimeTwo(endTimeTemp, 'Y-M-D');
            obj.endTime = endTime;
            if (obj.status == 0) {
              obj.status = "待确认";
            } else if (obj.status == 1) {
              obj.status = "签约成功";
            } else if (obj.status == 2) {
              obj.status = "已退房";
            }
            if (obj.contractType == 0) {
              obj.contractType = "纸字合同";
            } else if (obj.contractType == 1) {
              obj.contractType = "电子合同";
            }
            this.data.reservationlist.push(obj);
            this.setData({
              houseName: this.data.reservationlist[e.detail.value].name,
              leaseId: this.data.reservationlist[e.detail.value].leaseId,
              houseId: this.data.reservationlist[e.detail.value].houseId,
              houseNumber: this.data.reservationlist[e.detail.value].houseNumber,
              reservationlist: this.data.reservationlist
            })
          }

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })

        }
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