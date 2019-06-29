// pages/znApartmentList/znApartmentList.js

import { selectApartment } from "../../utils/url.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    devtype:'',
    apartmentList:[]
  },
  // 获取公寓下拉列表
  selectApartmentt(){
    selectApartment().then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          apartmentList:res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    }).catch(err =>{
      wx.showToast({
        title: "网络请求失败",
        icon: 'none',
        duration: 1500
      })
    })
  },
  // 查看单个公寓电表列表
  goznAmmeterList(e){
    console.log(e)
    let obj = e.currentTarget.dataset
    wx.navigateTo({
      url: '/pages/znAmmeterList/znAmmeterList?name=' + obj.name + '&apartmentId=' + obj.id + '&devtype=' + this.data.devtype,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    wx.setNavigationBarTitle({
      title: options.name,
    })
    this.setData({
      devtype: options.devtype
    })
    this.selectApartmentt()
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