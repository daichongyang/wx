// pages/manageInforList/manageInforList.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
import { messageUnread } from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gmtCreate1: "",
    gmtCreate2: "",
    gmtCreate3: "",
    gmtCreate4: "",
    gmtCreate5: "", 
    gmtCreate6: "",

    title1: "",
    title2: "",
    title3: "",
    title4: "",
    title5: "",
    title6: "",

    listMsg: {},
    noRead:{}//未读信息标识
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    
  },
  //未读条数提醒
  messageUnreadd() {
    messageUnread().then(res => {
      console.log(res)
      if (res.data.code === 200) {
        this.setData({
          noRead: res.data.data
        })
      }
    })
  },

  //msgListClick详情消息列表
  msgListClick: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var msgTitle;
    if (id == 0) {
      msgTitle = "财务消息";
    } else if (id == 1) {
      msgTitle = "租约消息";
    } else if (id == 2) {
      msgTitle = "房源消息";
    } else if (id == 3) {
      msgTitle = "服务消息";
    } else if (id == 4) {
      msgTitle = "系统信息";
    }
    wx.navigateTo({
      url: '/pages/manageInforLi/manageInforLi?&msgTitle=' + msgTitle +'&msgType='+id,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
    this.messageUnreadd()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onReady")
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