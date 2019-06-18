// pages/reservationlist/reservationlist.js
const app = getApp();
var utils = require('../../utils/url.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservationlist: [],
    refreshFlag: true,
    current: 1,
    black:false,
    index:0,
    picture:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },
  //点击查看详情
  reservationDetailsClick: function (e) {
    this.setData({
      index: e.currentTarget.dataset.id,
    })
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    obj.picture = decodeURIComponent(obj.picture);
    obj.picture = encodeURIComponent(obj.picture);
    console.log(obj.picture)
    var reservation = JSON.stringify(obj);
    wx.navigateTo({
      url: '/pages/yddetailsPage/yddetailsPage?reservation=' + reservation + '&houseId=' + obj.houseId
    })
  },
  //点击查看合同
  lookContractClick:function(e){
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    console.log(obj);
  },
  //点击查看租约详情
  leaseClick: function (e) {
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    console.log(obj);
  },
  //点击去支付
  payClick: function (e) {
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    console.log(obj);
    wx.request({
      method: "POST",
      url: utils.icbcComPay + obj.orderId + '/' + obj.houseId,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 201) {
          wx.showToast({
            title: '该订单已支付',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: res => {
              wx.showToast({
                title: '支付成功',
                icon: 'none',
                duration: 1000
              })
              this.data.reservationlist[e.currentTarget.dataset.id].payStatus = 1;
              this.setData({
                reservationlist:this.data.reservationlist,
              })
            },
            fail: res => {
              wx.showToast({
                title: '支付失败',
                icon: 'none',
                duration: 1000
              })
            },

          })
        }
      }
    })
  },
  // 支付页面
  gochoisePay(e){
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    if (obj.rentCost < 0 || obj.rentCost == 0){
      wx.showToast({
        title: '支付金额必须大于0',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.navigateTo({
      url: '/pages/choisePay/choisePay?orderId=' + obj.orderId + '&houseId=' + obj.houseId + '&payMoney=' + obj.rentCost
    })
  },
  //点击加载更多
  refreshClick: function () {
    var current = this.data.current;
    current += 1;
    this.setData({
      current: current,
    })
    this.loadDataSource();
  },
  //加载数据
  loadDataSource: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.advanceorderListUrl,
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
        for (let i = 0; i < res.data.data.records.length; i++) {
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
    this.setData({
      reservationlist:[]
    })
    if(this.data.black == true){
      this.data.reservationlist[this.data.index].payStatus = 1;
      console.log(this.data.reservationlist[this.data.index].picture);
      this.data.reservationlist[this.data.index].picture = this.data.picture;
        this.setData({
          reservationlist: this.data.reservationlist,
          black:false,
        })
    }
    this.loadDataSource();
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
      reservationlist: [],
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