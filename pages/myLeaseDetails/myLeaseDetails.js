// pages/myLeaseDetails/myLeaseDetails.js
//加载外部实例
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
import { customerName } from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:'',
    reservation: {},
    reservationDetails: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jsonData = JSON.parse(options.reservation);
    var picture = decodeURIComponent(jsonData.picture);
    jsonData.picture = picture;
    this.setData({
      reservation: jsonData,
    })
    console.log(this.data.reservation);
    this.loadreservationDetails(jsonData.leaseId);
    this.getcustomerName(jsonData.houseId);
  },
  getcustomerName(houseId) {//获取房东名称
    console.log(houseId)
    customerName(houseId).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        this.setData({
          name: res.data.data
        })
      }
    })
  },
  //加载详情
  loadreservationDetails: function (leaseId) {
    wx.request({
      url: utils.leaseDetailUrl + leaseId,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        advanceId: leaseId,
      },
      method:"POST",
      success: res => {
        console.log(res);
        var endTime = util.formatTimeTwo(res.data.data.endTime / 1000, 'Y/M/D');
        var gmtCreate = util.formatTimeTwo(res.data.data.gmtCreate / 1000, 'Y/M/D');
        var latestTime = util.formatTimeTwo(res.data.data.latestTime / 1000, 'Y/M/D');
        var startTime = util.formatTimeTwo(res.data.data.startTime / 1000, 'Y/M/D');
        var nextTime = util.formatTimeTwo(res.data.data.nextTime / 1000, 'Y/M/D');
        var dada = res.data.data;
        dada.endTime = endTime;
        dada.gmtCreate = gmtCreate;
        dada.latestTime = latestTime;
        dada.startTime = startTime;
        dada.nextTime = nextTime;
        this.setData({
          reservationDetails: dada,
        })
      }
    })
  },

 //打电话
  callPhone:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.reservation.leaderPhone,
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