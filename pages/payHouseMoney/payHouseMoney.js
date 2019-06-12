// pages/payHouseMoney/payHouseMoney.js
const app = getApp();
var utils = require('../../utils/url.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservationlist: [],
    refresh: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataSource();
  },


  //加载数据
  loadDataSource: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.leaseListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.hideLoading();
          if (!res.data.data){
            return;
          }
          for (let i = 0; i < res.data.data.length;i++){
            if (res.data.data[i].status == 1){
              this.data.reservationlist.push(res.data.data[i]);
            }

          }
          this.setData({
            reservationlist: this.data.reservationlist,
            refresh: false,
          })
        }
        wx.hideLoading();
      }
    })
  },

 
  //支付账单
  lookBillClick: function (e) {
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    wx.navigateTo({
      url: '/pages/firstLeaseBillsPage/firstLeaseBillsPage?leaseId=' + obj.leaseId + '&firstPay=' + 0 + '&layout=' + obj.layout + '&rentCost=' + obj.rentCost,
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
    if (this.data.refresh == true) {
      this.loadDataSource();
    }
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