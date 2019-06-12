// pages/waterMeterHistoricalRecord/waterMeterHistoricalRecord.js
const app = getApp();
var utils = require('../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource:{},
    dataList:[],
  },

  //加载数据电表
  loadDataSource: function () {
    wx.request({
      url: utils.hydroelectricGetDevInfoUrl + this.data.dataSource.devType + "/" + this.data.dataSource.houseId,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method: "POST",
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          if (!res.data.data) {
            return;
          } else {
            this.setData({
              dataList: res.data.data,
            })
          }
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.parse(options.dataSource));
    this.setData({
      dataSource: JSON.parse(options.dataSource),
    })
    this.loadDataSource();
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