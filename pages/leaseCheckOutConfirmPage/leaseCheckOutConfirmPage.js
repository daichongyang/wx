// pages/leaseCheckOutConfirmPage/leaseCheckOutConfirmPage.js

var dateTool = require('../../utils/date.js');
import {
  adminCheckOutHouseClose
} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSend: 1,
    checktItem: null // 退款数据
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      checktItem: JSON.parse(options.checktItem)
    })
  },

  sendMessageClick: function () {
    this.data.isSend = !this.data.isSend;
    this.setData({
      isSend: this.data.isSend
    })
  },

  // 退房不结算
  confirmClick: function () {
    var isSendNum = this.data.isSend ? 1 : 0;
    this.data.checktItem.isSend = isSendNum;
    this.data.checktItem.gmtCreate = new Date().getTime();
    this.data.checktItem.usableTime = new Date().getTime();
    console.log(this.data.checktItem);
    adminCheckOutHouseClose(this.data.checktItem).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        wx.showToast({
          title: "退房成功",
          icon: 'none',
          duration: 1500
        })
        setTimeout(function () {
          wx.navigateBack({
            delta: 3
          })
        }, 1500)
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