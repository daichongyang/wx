// pages/apartmentDetails/apartmentDetails.js

import { houseOperate} from "../../utils/url.js"
import { getDateArray } from "../../utils/myDate.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseInfor: {},//房间信息
    houseId:'',//房间id
  },
  houseOperatee(houseId){
    houseOperate(houseId).then(res =>{
      console.log(res)
      if(res.data.code == 200){
        res.data.data.billingInfo.paymentDay = getDateArray(res.data.data.billingInfo.paymentDay)[16]
        if (res.data.data.advanceInfo) {
          res.data.data.advanceInfo.latestTime = getDateArray(res.data.data.advanceInfo.latestTime)[16]
        }
        this.setData({
          houseInfor: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none'
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.houseId)
    this.houseOperatee(options.houseId)
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