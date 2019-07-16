// pages/community/community.js

//获取应用实例
const app = getApp()
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTenant: '',
    city: "选择城市 ▾",
    index: 0,
    isBack: false,//返回时候判断是否选择过城市
    cityModel: {},
    houseIndexList: [],
    msgIndex: 0,
  },
  // 监听是否点击了当前这个tabBar
  onTabItemTap(item) {
    // 监听是否有租约来显示右下角图标
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          data: {
            code: res.code, 
          },
          url: utils.userAccessUrl,
          success: res => {
            console.log(res);
            app.globalData.userInfo = res.data.data;
            wx.setStorageSync("userInfo", app.globalData.userInfo);
            if (app.globalData.userInfo.token) {
              console.log("登录成功已经绑定手机号");
            }
          }
        })
      }
    })

  },
  //门禁通行证
  passClick: function () {
    wx.navigateTo({
      url: '/pages/mjPassPage/mjPassPage',
    })
  },
  //消息盒子
  msgClick: function () {
    wx.navigateTo({
      url: '/pages/informationTypePage/informationTypePage',
    })
  },
  //是否有消息判断
  loadDataMsgSource: function () {
    if (app.globalData.userInfo.token) {
      wx.request({
        method: "POST",
        url: utils.noticeListRemindUrl,
        header: {
          "Authorization": app.globalData.userInfo.token,
        },
        success: res => {
          console.log(res);
          this.setData({
            msgIndex: res.data.data,
          })
        }
      })
    }


  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (app.globalData.userInfo.token) {
      this.setData({
        isTenant: app.globalData.userInfo.isTenant,
      })
    } 
    var data = wx.getStorageSync("userInfo");
    console.log(data)
    console.log("*********")
    app.globalData.userInfo = data;
    this.loadDataMsgSource();
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