// pages/adminLeaseListPage/leaseDetailPage/leaseDetailPage.js
import {
  adminLeaseDetail
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
    leaseDetail: {} // 租约详情
  },

  // 底部点击事件
  leaseBottomClick: function (e) {
    this.setData({
      selectIndex: e.currentTarget.dataset.item
    })
    this.getLeaseWithIndex(this.data.selectIndex);
  },

  // 历史账单
  footClick: function () {
    wx.navigateTo({
      url: '/pages/leaseDetailBillHistory/leaseDetailBillHistory',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      selectIndex: options.selectIndex,
      leaseId: options.leaseId
    })
    this.getLeaseWithIndex(this.data.selectIndex);
  },

  // 请求数据
  getLeaseWithIndex: function (index) {
    switch (parseInt(index)) {
      case 0:
        {
          this.getLeaseDetail();
        }
        break;
      case 1:
        {
          
        }
        break;
      case 2:
        {
          
        }
        break;
      default:
        {
          
        }
        break;
    }
  },

  // 租约详情
  getLeaseDetail: function () {
    let params = {
      leaseId: this.data.leaseId
    }
    adminLeaseDetail(params).then(res => {
      console.log(res);
      if (res.data.code == 200) {

        var signList = res.data.data.signList;
        signList.signTimeStr = dateTool.formatTimeStamp(signList.signTime / 1000);
        if (signList.contractType == 0) {
          signList.contractTypeStr = "纸字合同";
        } else if (signList.contractType == 1) {
          signList.contractTypeStr = "电子合同";
        }

        var leaseDetail = res.data.data;
        leaseDetail.startTimeStr = dateTool.formatTimeStamp(leaseDetail.startTime / 1000, "yyyy-MM-dd");
        leaseDetail.endTimeStr = dateTool.formatTimeStamp(leaseDetail.endTime / 1000, "yyyy-MM-dd");
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