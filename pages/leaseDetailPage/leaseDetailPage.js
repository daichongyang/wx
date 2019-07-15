// pages/adminLeaseListPage/leaseDetailPage/leaseDetailPage.js
import {
  adminLeaseDetail,
  adminLeaseBills,
  adminLeaseContract
} from "../../utils/url.js"
var dateTool = require('../../utils/date.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    selectIndex: 0,
    leaseId: 0,
    tenantList: [], // 入住人信息
    signList: {}, // 承租人信息
    leaseDetail: null, // 租约详情
    leaseBill: [], // 账单
    isAll: false, // 全选
    selectBillNum: 0, // 已选择的账单
    moneyTotal: 0, // 总金额
    contractImg: null
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
      case "renewal" : 
        {

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

        }
        break;
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectIndex: options.selectIndex,
      leaseId: options.leaseId
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
      if (res.data.code == 200) {
        this.setData({
          leaseBill: res.data.data.map(item => {
            item.startDateStr = dateTool.formatTimeStamp(item.startDate / 1000, "yyyy.MM.dd");
            item.endDateStr = dateTool.formatTimeStamp(item.endDate / 1000, "yyyy.MM.dd");
            item.bills.map(item => {
              item.isSelct = false;
              item.receivableDateStr = dateTool.formatTimeStamp(item.receivableDate / 1000, "yyyy.MM.dd");
              item.receiptDateStr = dateTool.formatTimeStamp(item.receiptDate / 1000, "yyyy.MM.dd");
              item.payStatusStr = item.payStatus ? "已付款" : "未付款";
            })
            return item;
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
    this.data.leaseBill.map(item => {
      item.bills.map(item => {
        if (item.isSelct) {
          num += 1;
          total += item.accountReceivable;
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