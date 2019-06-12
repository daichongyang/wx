// pages/myBackCard1/myBackCard.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    email: "未绑定"
  },


  //退出登录
  exitLoginClick: function () {




  },

  //绑定银行卡下一步
  bindingCarNext: function () {
    wx.navigateTo({
      url: '/pages/myBackCard1/myBackCard1'
    })
  },
  //绑定邮箱
  choisePayWay: function () {
    wx.navigateTo({
      url: '/pages/choisePay/choisePay',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    console.log("=====+++++++++====")
    if (app.globalData.userInfo.email) {
      this.setData({
        phone: app.globalData.userInfo.phone,
        email: app.globalData.userInfo.email,
      })
    } else {
      this.setData({
        phone: app.globalData.userInfo.phone,
      })
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