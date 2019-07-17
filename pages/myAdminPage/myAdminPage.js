// pages/myAdminPage/myAdminPage.js
var utils = require('../../utils/url.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    adminTodo:{}
  },
 
  //管理员点击业务明细
  adminClick:function(e){
    var title = e.currentTarget.dataset.data;
    console.log(title);
    if (title == '数据报表'){
      wx.navigateTo({
        url: '/pages/dataReportPage/dataReportPage',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (title == '房态图'){
      wx.navigateTo({
        url: '/pages/roomStatePage/roomStatePage',
        success: function(res) {},
        fail: function(res) {},
        complete: function(res) {},
      })
    } else if (title == '预约预定') {
      wx.navigateTo({
        url: '/pages/myAdminYyYdPage/myAdminYyYdPage',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (title == '租约') {
      wx.navigateTo({
        url: '/pages/adminLeaseListPage/adminLeaseListPage?a=1&b=2&c=3&d=4&e=5',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (title == '报修保养') {
      wx.navigateTo({
        url: '/pages/adminBxByPage/adminBxByPage',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (title == '水电表抄表') {
      wx.navigateTo({
        url: '/pages/adminSDBPage/adminSDBPage',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (title == '智能系统') {
      wx.navigateTo({
        url: '/pages/adminIntelligentSystemPage/adminIntelligentSystemPage',
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    } else if (title == '账单/流水') {
      wx.navigateTo({
        url: '/pages/myBillOrWater/myBillOrWater'
      })
    }
  },

  //请求待办事项数据
  loadDataSource: function () {
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      method: "POST",
      url: utils.adminTodoUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {},
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.hideLoading();
          this.setData({
            adminTodo: res.data.data
          })
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

  bindscrolltoupper:function(){
    // wx.startPullDownRefresh({
      
    // })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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