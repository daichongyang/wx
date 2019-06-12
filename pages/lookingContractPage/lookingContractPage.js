// pages/lookingContractPage/lookingContractPage.js
const app = getApp();
var utils = require('../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url:"",
  },
  //加载数据
  loadDataSource: function (leaseId) {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.leaseContractUrl + leaseId,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method:"POST",
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          this.setData({
            url: res.data.data,
          })
        }
        wx.hideLoading();
      }
    })
  },

  //点击查看大图片
  lookBigClick:function(){
    wx.previewImage({
      urls: [this.data.url],
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataSource(options.leaseId);
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