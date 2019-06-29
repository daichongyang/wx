// pages/znAmmeterList/znAmmeterList.js

import { getEleDevInfos } from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
 //提交数据
    current: 1,//当前页码
    devType: 2,//电表
    gyId: '',
    size: 10,//一个页面的条数
    inforList:[],//列表数组
  },
  // 查询公寓水电信息
  getEleDevInfoss(){
    getEleDevInfos().then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          inforList: res.data.data.list.filter(item => {
            if (item.onlineStatus === 0) {
              item.devTypeName = '不在线'
            } else if (item.onlineStatus === 1) {
              item.devTypeName = '在线'
            }
            return item
          })
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      gyId: options.apartmentId,
      devType: options.devtype
    })
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.getEleDevInfoss()
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