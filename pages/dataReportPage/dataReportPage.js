// pages/dataReportPage/dataReportPage.js
//获取应用实例
const app = getApp()
var util = require('../../utils/util.js');
var dateTool = require('../../utils/date.js');
import {
  adminIndexbilltotal,
  adminIndexbillfuture,
  adminIndexWillExpired,
  adminIndexBeExpired,
  getDataTableWithWater,
  getDataTableWithBill,
  adminIndexHouseData
} from "../../utils/url.js"

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
    dayIndex: 0,
    billTotal: 0,
    billFuture: 0,
    willExpired: 0,
    beExpired: 0,
    billData: [],
    waterData: [],
    houseData: {},
    startTime: "2000-01-01", 
    endTime: null
  },

  // 总账单  房源数据 租约数据  日报月报 选择
  chooseTypeClick:function(e){
    this.getExpiredWithIndex(e.currentTarget.dataset.id);
    this.setData({
      id: e.currentTarget.dataset.id,
      current: e.currentTarget.dataset.id,
    })
  },

  /**
   * 生命周期函数--监听页面加载 
   */
  onLoad: function (options) {
    this.setData({
      endTime: dateTool.formatTimeStamp(new Date() / 1000, "yyyy-MM-dd")
    })
    this.getSystemInfo();
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
    this.getExpiredWithIndex(e.detail.current);
    this.setData({
      id: e.detail.current,
    })
  },

  //总账单
  loadDataSourcezzd: function () {
    //总账单
    adminIndexbilltotal().then(res => {
      console.log(res);
      this.setData({
        billTotal: res.data.data
      })
    })
    let params = {
      endTime: 1562917984099,
      startTime: 1561621984099
    }
    // 未来预计收入
    adminIndexbillfuture(params).then(res => {
      console.log(res);
      this.setData({
        billFuture: res.data.data
      })
    })
  },

  bindDateChange: function (e) {
    console.log(e.detail.value);
  },

  // 房源数据
  getHouseData: function () {
    adminIndexHouseData().then(res => {
      console.log(res);
      this.setData({
        houseData: res.data.data
      })
      var context = wx.createCanvasContext('Canvas', this);
      var array = [this.data.houseData.vacantNum, this.data.houseData.rentNum];
      var colors = ["#cdfdf2", "#00ceb2"];
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
      context.fillStyle = "black";
      context.fillText("空置房", 60, 120);
      context.fillText("已租房", 80, 50);
      context.draw();
    })
  },

  getExpiredWithIndex: function(index) {
   switch (index) {
     case 0:
       {
         this.loadDataSourcezzd();
       }
       break;
     case 1:
       {
         this.getHouseData();
       }
       break;
     case 2:
       {
         this.loadDataExpired();
       }
       break;
     default:
       {
         this.lstjClick();
       }
       break;
   }
  },

  //租约数据
  loadDataExpired: function () {
    // 快到期合同
    let params = {
      day: 60
    }
    adminIndexWillExpired(params).then(res => {
      console.log(res);
      this.setData({
        willExpired: res.data.data
      })
    })
    // 已到期合同
    adminIndexBeExpired().then(res => {
      console.log(res);
      this.setData({
        beExpired: res.data.data
      })
    })
  },

  // 流水统计
  lstjClick: function () {
    this.setData({
      index: 0,
    })
    let params = {
      apartmentId: 1,
      flowReportType: 1,
      size: 6,
      current: 1,
      paymentDate: this.data.dayIndex
    }
    getDataTableWithWater(params).then(res => {
      this.setData({
        waterData: res.data.data.records[0].statements
      })
    })
  },
  // 账单统计
  zdtjClick: function () {
    this.setData({
      index: 1,
    })
    let params = {
      apartmentId: 0,
      flowReportType: 1,
      size: 6,
      current: 1,
      paymentDate: this.data.dayIndex
    }
    getDataTableWithBill(params).then(res => {
      this.setData({
        billData: res.data.data.records[0].billReports
      })
    })
  },

  // 日报月报数据
  dayClick: function () {
    this.setData({
      dayIndex: 0,
    })
    if (this.data.index == 0) {
        this.lstjClick();
    } else {
        this.zdtjClick();
    }
  },

  monthClick: function () {
    this.setData({
      dayIndex: 1,
    })
    if (this.data.index == 0) {
      this.lstjClick();
    } else {
      this.zdtjClick();
    }
  },

  //租约数据
  loadDataExpired: function () {
    // 快到期合同
    let params = {
      day: 60
    }
    adminIndexWillExpired(params).then(res => {
      console.log(res);
      this.setData({
        willExpired: res.data.data
      })
    })
    // 已到期合同
    adminIndexBeExpired().then(res => {
      console.log(res);
      this.setData({
        beExpired: res.data.data
      })
    })
    if (this.data.index == 0) {
      this.lstjClick();
    } else {
      this.zdtjClick();
    }
  },

  //租约数据
  loadDataExpired: function () {
    // 快到期合同
    let params = {
      day: 60
    }
    adminIndexWillExpired(params).then(res => {
      console.log(res);
      this.setData({
        willExpired: res.data.data
      })
    })
    // 已到期合同
    adminIndexBeExpired().then(res => {
      console.log(res);
      this.setData({
        beExpired: res.data.data
      })
    })
    if (this.data.index == 0) {
      this.lstjClick();
    } else {
      this.zdtjClick();
    }
  },

//租约数据
loadDataExpired: function () {
  // 快到期合同
  let params = {
    day: 60
  }
  adminIndexWillExpired(params).then(res => {
    console.log(res);
    this.setData({
      willExpired: res.data.data
    })
  })
  // 已到期合同
  adminIndexBeExpired().then(res => {
    console.log(res);
    this.setData({
      beExpired: res.data.data
    })
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