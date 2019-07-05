// pages/myAdminYyYdPage/myAdminYyYdPage.js
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTitel:'',
    noShowTitel:'',
    yyShow:false,
    index:0,
    current:1,
    adminReservationList:[],
    windowWidth: 0,
    windowHeight: 0,
    firstLoadYd:true,
    ydShow: false,
    showTitelTwo: '',
    noShowTitelTwo: '',
    currentTwo: 1,
    adminAdvanceList: [],
  },

  //左右滑动
  bindchange: function (e) {
    console.log(e.detail.current);
    if (e.detail.current == 1 && this.data.firstLoadYd == true){
      this.ydLoadDataSourceReservationList(this.data.currentTwo);
    }
    this.setData({
      index: e.detail.current,
      firstLoadYd:false,
    })
  },

//预约
  yyClick:function(){
    this.setData({
      index:0,
    })
  },
  // 预定
  ydClick: function () {
    if (this.data.firstLoadYd == true){
      this.ydLoadDataSourceReservationList(this.data.currentTwo);
    }
    this.setData({
      index: 1,
      firstLoadYd:false,
    })
  },

  //预定加载更多
  ydloadMoreClick: function () {
    this.data.currentTwo += 1;
    this.setData({
      currentTwo: this.data.currentTwo,
    })
    this.ydLoadDataSourceReservationList(this.data.currentTwo);
  },


  //请求数据预定
  ydLoadDataSourceReservationList: function (current) {
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      method: "POST",
      url: utils.adminAdvanceListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        current: current,
        size: 10,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.hideLoading();
          for (let i = 0; i < res.data.data.records.length; i++) {
            var obj = res.data.data.records[i];
            var timestamp = obj.latestTime / 1000;
            var appointmentTimeDate = util.formatTimeTwo(timestamp, 'Y-M-D');
            obj.latestTime = appointmentTimeDate;
           if (obj.signStatus == 0){
              obj.signStatus = "未签";
           } else if (obj.signStatus == 1){
             obj.signStatus = "已签";
           } else if (obj.signStatus == 2) {
             obj.signStatus = "已作废/失效";
           } else if (obj.signStatus == 3) {
             obj.signStatus = "已撤销";
           }
            this.data.adminAdvanceList.push(obj);
          }
          if (res.data.data.total > this.data.adminAdvanceList.length) {
            this.setData({
              adminAdvanceList: this.data.adminAdvanceList,
              ydShow: true,
              current: current,
              showTitelTwo: "点击加载更多..."
            })
          } else {
            this.setData({
              adminAdvanceList: this.data.adminAdvanceList,
              ydShow: false,
              noShowTitelTwo: '数据已全部加载完毕'
            })
          }

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



  //获取屏幕尺寸
  getSystemInfo: function () {
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight - 45;
        this.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
        })
        this.loadDataSourceReservationList(this.data.current);
      },
    })
  },

  //预约加载更多
  loadMoreClick:function(){
    this.data.current += 1;
    this.setData({
      current:this.data.current,
    })
    this.loadDataSourceReservationList(this.data.current);
  },


 

  //请求数据预约数据
  loadDataSourceReservationList: function (current) {
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      method: "POST",
      url: utils.adminReservationListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        current: current,
        size: 10,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.hideLoading();
          for (let i = 0; i < res.data.data.records.length;i++){
            var obj = res.data.data.records[i];
            var timestamp = obj.appointmentTime / 1000;
            var appointmentTimeDate = util.formatTimeTwo(timestamp, 'Y-M-D');
            obj.appointmentTime = appointmentTimeDate;
            this.data.adminReservationList.push(obj);
          }
          if (res.data.data.total > this.data.adminReservationList.length){
            this.setData({
              adminReservationList: this.data.adminReservationList,
              yyShow:true,
              current:current,
              showTitel:"点击加载更多..."
            })
          }else{
            this.setData({
              adminReservationList: this.data.adminReservationList,
              yyShow: false,
              noShowTitel:'数据已全部加载完毕'
            }) 
          }
        
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


  //预约详情
  yyXqClick:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    console.log(this.data.adminReservationList[id]);
    var reservation = JSON.stringify(this.data.adminReservationList[id]);
    wx.navigateTo({
      url: "/pages/myAdminYyYdXqPage/myAdminYyYdXqPage?index=" + '1' + "&obj=" + reservation,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //预定详情
  ydXqClick: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    console.log(this.data.adminAdvanceList[id]);
    var reservation = JSON.stringify(this.data.adminAdvanceList[id]);
    wx.navigateTo({
      url: "/pages/myAdminYyYdXqPage/myAdminYyYdXqPage?index=" + '2' + "&obj=" + reservation,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getSystemInfo();
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