// pages/choisePay/choisePay.js
const app = getApp();
var utils = require('../../utils/url.js');
import { bindUserCardReSure, getDistributionByHouseId, payByBankCar, getCardPayStatus}from "../../utils/url.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payMoney:0,//传过来的金额
    orderId:'300',
    houseId:'101',
    agent: '0',//应收的手续费费用
    payType: '1',//1公寓支付2租客支付
    psw: '123456',//密码
    type: '1',//支付类型1微信2支付宝
    choiseCar: "../../img/my/choise_car.png",
    choiseWx: "../../img/my/choisedCar.png",

  },
  
  // 选择银行卡支付
  getStatusCar(){
    this.setData({
      type:'',
      choiseCar:"../../img/my/choisedCar.png",
      choiseWx:"../../img/my/choise_car.png"
    })
  },
  // 微信支付
  getstatusWx(){
    this.setData({
      type:1,
      choiseWx: "../../img/my/choisedCar.png",
      choiseCar: "../../img/my/choise_car.png"
    })
  },
  
  // 清分方式
  getDistributionByHouseIdd(){
    let params = {
      houseId: this.data.houseId
    }
    getDistributionByHouseId(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          payType: res.data.data.payType,
          agent: Number(payMoney) * Number(res.data.data.disRatio)
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //支付
  payClick: function () {
    let params = {
      agent: this.data.agent,
      houseId: this.data.houseId,
      orderId: this.data.orderId,
      payType: this.data.payType,
      psw: this.data.psw,
      type: this.data.type,
    }
    console.log(this.data.type)
    if (this.data.type == 1){
      wx.request({
        method: "POST",
        url: utils.icbcComPay,
        data: params,
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
                wx.navigateBack({
                  delta:1
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
    }else{
      //银行卡支付
      payByBankCar(params).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          let paa = res.data.data
          getCardPayStatus(paa).then(res => {
            console.log(res)
            wx.showToast({
              title: res.data.data,
              icon: 'none',
              duration: 1000
            })
          })
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
  },
  bindingCarNext: function () {
    wx.navigateTo({ 
      url: '/pages/myBackCard1/myBackCard1'
    })
  },
  // 支付成功
  goPaySuccese: function () {
    wx.navigateTo({
      url: '/pages/choisePayS/choisePayS'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      // orderId: options.orderId,
      // houseId: options.houseId,
      // payMoney: options.payMoney
    })
    this.getDistributionByHouseIdd()
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