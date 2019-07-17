// pages/adminLeaseListPage/adminLeaseListPage.js
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    showTitel: '',
    noShowTitel: '',
    current:1,
    dataList: [],
    status:0,
    index: 0,
    leaseStatus: 0,
    statusArray: ["全部", "在租", "已退房"],
    contracArray: ["电子合同", "纸质合同"]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.loadDataSourceList(this.data.current, this.data.leaseStatus);
  },

  bindLeaseStatuschange: function (e) {
    this.data.dataList = [];
    this.data.leaseStatus = e.detail.value;
    this.loadDataSourceList(this.data.current, this.data.leaseStatus);
  },

  //请求数据预定
  loadDataSourceList: function (current,status) {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      method: "POST",
      url: utils.adminLeaseListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        current: current,
        size: 10,
        leaseStatus: status,
        status:0
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.hideLoading();
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
            } else if (obj.status == 2 && obj.settleAccounts == 1) {
              obj.status = "已退房";
            } else if (obj.status == 2 && obj.settleAccounts == 0)  {
              obj.status = "已退房(未结账)";
            }  
            if (obj.contractType == 0) {
              obj.contractType = "纸字合同";
            } else if (obj.contractType == 1) {
              obj.contractType = "电子合同";
            }
            this.data.dataList.push(obj);
          }
          if (res.data.data.total > this.data.dataList.length) {
            this.setData({
              dataList: this.data.dataList,
              showTitel: "点击加载更多...",
              show: true,
            })
          } else {
            this.setData({
              dataList: this.data.dataList,
              show: false,
              noShowTitel: '数据已全部加载完毕'
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

  //预约加载更多
  loadMoreClick: function () {
    this.data.current += 1;
    this.setData({
      current: this.data.current,
    })
    this.loadDataSourceList(this.data.current, this.data.leaseStatus);
  },

  // 租约详情
  ydXqClick: function (e) {
    var obj = this.data.dataList[e.currentTarget.dataset.id];
    wx.navigateTo({
      url: '/pages/leaseDetailPage/leaseDetailPage?selectIndex=' + e.currentTarget.dataset.index + '&leaseId=' + obj.leaseId + '&houseId=' + obj.houseId,
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
    this.data.dataList = [];
    this.loadDataSourceList(this.data.current, this.data.leaseStatus);
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