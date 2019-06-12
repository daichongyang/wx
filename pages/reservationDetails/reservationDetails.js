// pages/reservationDetails/reservationDetails.js
//加载外部实例
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservation:{},
    reservationDetails:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jsonData = JSON.parse(options.reservation);
    var picture = decodeURIComponent(jsonData.picture);
    jsonData.picture = picture;
    console.log(picture);
    this.setData({
      reservation: jsonData
    })
    this.loadreservationDetails(jsonData.reservationId);
  },

  //加载详情
  loadreservationDetails: function (reservationId){
    wx.request({
      url: utils.reservationDetailsUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        reservationId: reservationId,
      },
      success: res => {
        console.log(res);
        var appointmentTime = util.formatTimeTwo(res.data.data.appointmentTime / 1000, 'Y/M/D h:m');
        var gmtCreate = util.formatTimeTwo(res.data.data.gmtCreate / 1000, 'Y/M/D h:m');
        var dada = res.data.data;
        dada.appointmentTime = appointmentTime;
        dada.gmtCreate = gmtCreate;
        if (res.data.data.appointmentType == 0){
          dada.appointmentType = "现场看房"
          this.setData({
            reservationDetails:dada,
          })
        } else if (res.data.data.appointmentType == 1){
          dada.appointmentType = "音视频看房"
          this.setData({
            reservationDetails: dada,
          })
        }
      }
    })
  },

  //打电话
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.reservationDetails.leaderPhone,
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