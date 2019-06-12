// pages/reservationlist/reservationlist.js
const app = getApp();
var utils = require('../../utils/url.js');

Page({
  
  /**
   * 页面的初始数据
   */
  data: {
    reservationlist:[],
    refreshFlag:true,
    current:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataSource();
  },
  //点击查看详情
  reservationDetailsClick:function(e){
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    obj.picture = decodeURIComponent(obj.picture);
    obj.picture = encodeURIComponent(obj.picture);
    console.log(obj.picture)
    var reservation = JSON.stringify(obj);
    wx.navigateTo({
      url: '/pages/reservationDetails/reservationDetails?reservation=' + reservation,
    })
  },
  //点击加载更多
  refreshClick:function(){
    var current = this.data.current;
    current += 1;
    this.setData({
      current:current,
    })
    this.loadDataSource();
  },
  //加载数据
  loadDataSource:function(){
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.reservationlistUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        current: this.data.current,
        size: 10
      },
      success: res => {
        console.log(res);
        wx.stopPullDownRefresh();
        wx.hideLoading();
        if (!res.data.data){
          return;
        }
        var array = this.data.reservationlist;
        for (let i = 0;i<res.data.data.records.length;i++){
          array.push(res.data.data.records[i]);
        }
        if (array.length == res.data.data.total) {
          this.setData({
            reservationlist: array,
            refreshFlag: true,
          })
        } else {
          this.setData({
            reservationlist: array,
            refreshFlag: false,
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
    this.setData({
      reservationlist:[],
    })
    this.data.current = 1;
    this.loadDataSource();
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