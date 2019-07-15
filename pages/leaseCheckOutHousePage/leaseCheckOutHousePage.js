// pages/leaseCheckOutHousePage/leaseCheckOutHousePage.js
import {
  adminCheckOutHouseClose,
  adminCheckOutHouseData
} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentArray: ["线上", "现金", "支付宝转账", "微信转账", "对公银行转账", "对私银行转账", "其他"],
    paymentStr: "银行卡/支付宝/微信转账",
    leaseId: 0,
    refundArray: [], // 退款数据
    refundStr: "请选择",
    arrearsArray: [], // 欠款数据
    deductionArray: [], // 扣款数据
    deductionStr: "请选择",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      leaseId: options.leaseId
    })
    this.getCheckOutHouseData();
  },

  getCheckOutHouseData: function () {
    let params = {
      leaseId: this.data.leaseId
    }
    adminCheckOutHouseData(params).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  paymentChange: function (e) {
    this.setData({
      paymentStr: this.data.paymentArray[e.detail.value]
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