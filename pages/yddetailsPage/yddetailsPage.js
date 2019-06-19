//加载外部实例
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservation: {},
    reservationDetails: {},
    houseId:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var jsonData = JSON.parse(options.reservation);
    
    var picture = decodeURIComponent(jsonData.picture);
    jsonData.picture = picture;

    
    this.setData({
      reservation: jsonData,
    })
    console.log(this.data.reservation);
    this.loadreservationDetails(jsonData.advanceId);
  },

  //加载详情
  loadreservationDetails: function (advanceId) {
    wx.request({
      url: utils.advanceorderDetailsUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        advanceId: advanceId,
      },
      success:res => {
        console.log(res);
        var endTime = util.formatTimeTwo(res.data.data.endTime / 1000, 'Y/M/D');
        var gmtCreate = util.formatTimeTwo(res.data.data.gmtCreate / 1000, 'Y/M/D');
        var latestTime = util.formatTimeTwo(res.data.data.latestTime / 1000, 'Y/M/D');
        var startTime = util.formatTimeTwo(res.data.data.startTime / 1000, 'Y/M/D');
        var dada = res.data.data;
        dada.endTime = endTime;
        dada.gmtCreate = gmtCreate;
        dada.latestTime = latestTime;
        dada.startTime = startTime;
        this.setData({
          reservationDetails: dada,
        })
      }
    })
  },
  // 支付页面
  gochoisePay() {
    let payMoney = Number(this.data.reservationDetails.advanceCost)
    wx.navigateTo({
      url: '/pages/choisePay/choisePay?orderId=' + this.data.reservation.orderId + '&houseId=' + this.data.reservation.houseId + '&payMoney=' + payMoney
    })
  },
  //payClick支付定金
  payClick:function(){
    wx.request({
      method: "POST",
      url: utils.wechatPaycreateUrl + this.data.reservation.orderId + '/' + this.data.reservation.houseId,
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
              var picture = this.data.reservation.picture;
              this.data.reservation.payStatus = 1;
              this.setData({
                reservation: this.data.reservation,
              })
              let pages = getCurrentPages();
              let prevPage = pages[pages.length - 2];
              console.log(picture);
              if (prevPage.route == "pages/advancePage/advancePage") {
                prevPage.setData({
                  black: true,
                  picture: picture,
                })
              }
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

  //打电话
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.reservationDetails.leaderPhone,
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