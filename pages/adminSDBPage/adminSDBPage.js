// pages/adminSDBPage/adminSDBPage.js
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseList:[],
  },


  // 点击每一行
  gyClick:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/adminSDBonePage/adminSDBonePage?id=' + this.data.houseList[id].apartmentId + '&name=' + this.data.houseList[id].name,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      this.loadDataSource();
  },

  //请求数据
  loadDataSource: function () {
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      method: "POST",
      url: utils.adminSelectUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200) {
          if (!res.data.data.length) {
            return;
          }
          this.setData({
            houseList: res.data.data,
          })
        }else{
          wx.showToast({  
            title: res.data.msg,
            icon: 'none',
            duration: 1000
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