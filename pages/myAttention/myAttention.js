// pages/myAttention/myAttention.js
const app = getApp()
var utils = require('../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myAttention:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options){
    this.loadDataSource();
  },
  //加载数据
  loadDataSource: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.houseCollectListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method:"POST",
      success: res => {
        console.log(res);
          this.setData({
            myAttention:res.data.data,
          })
          wx.hideLoading();
        }
    })
  },
  //取消收藏
  cancelClick:function(e){
    wx.showLoading({
      title: '正在删除...',
    })
    var id = e.currentTarget.dataset.id;
    console.log(id);
    wx.request({
      url: utils.houseCollectCancelUrl + this.data.myAttention[id].houseId,
      header: {
        "Authorization": app.globalData.userInfo.token, 
      },
      method: "POST",
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          this.data.myAttention.splice(id, 1);
          this.setData({
            myAttention: this.data.myAttention,
          })
          wx.hideLoading();
        }
      }
    })
  },

  //查看详情
  reservationDetailsClick:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/houseLastDetails/houseLastDetails?houseId=' + this.data.myAttention[id].houseId
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