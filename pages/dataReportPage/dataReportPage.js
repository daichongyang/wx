// pages/dataReportPage/dataReportPage.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowWidth: 0,
    windowHeight: 0,
    titleArray:["总账单","房源数据","租约数据","日报月报"],
    id:0,
    current:0,
    index:0,
  },

  // 总账单  房源数据 租约数据  日报月报 选择
  chooseTypeClick:function(e){
    console.log(e.currentTarget.dataset.id);
    this.setData({
      id: e.currentTarget.dataset.id,
      current: e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo();
  },

// 日报月报里面 流水统计
  lstjClick:function(){
   this.setData({
     index:0,
    })
  },
  //  日报月报里面 账单统计
  zdtjClick: function () {
    this.setData({
      index: 1,
    })
  },

  //获取屏幕尺寸
  getSystemInfo:function(){
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight - 45;
        this.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
        })
        this.loadDataSourcezzd();
      },
    })
  },

  //左右滑动
  bindchange:function(e){
    console.log(e.detail.current);
    this.setData({
      id: e.detail.current,
    })
  },

  //总账单
  loadDataSourcezzd: function () {
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      method: "POST",
      url: utils.adminIndexbilltotalUrl,
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

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var context = wx.createCanvasContext('Canvas', this);
    var array = [87, 13];
    var colors = ["#228B22", "pink"];
    var total = 0;
    for (var val = 0; val < array.length; val++) {
      total += array[val];
    }
    var point = { x: 100, y: 100 };
    var radius = 80;
    for (var i = 0; i < array.length; i++) {
      context.beginPath();
      var start = 0;
      if (i > 0) {
        for (var j = 0; j < i; j++) {
          start += array[j] / total * 2 * Math.PI;
        }
      }
      var end = start + array[i] / total * 2 * Math.PI;
      context.arc(point.x, point.y, radius, start, end);
      context.setLineWidth(2)
      context.lineTo(point.x, point.y);
      context.setStrokeStyle('#F5F5F5');
      context.setFillStyle(colors[i]);
      context.fill();
      context.closePath();
      context.stroke();
    }
    context.draw();
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