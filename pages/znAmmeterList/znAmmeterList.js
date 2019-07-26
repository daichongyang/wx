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
    inforArr:[],//列表数组
    sn: '',//水电表标识
    isinfor:false,//判断是否还有数据加载
    showTCC:false
  },
  showTTC(){
    this.setData({
      showTCC: !this.data.showTCC
    })
  },
  // 切换冷水表热水表
  changeBiao(e){
    console.log(e)
    let obj = e.currentTarget.dataset
    this.setData({
      devType: e.currentTarget.dataset.devtype,
      inforArr:[],
      showTCC:false
    })
    this.getEleDevInfoss()
  },
  // 获取输入框的值
  getInputValue(e){
    this.setData({
      sn: e.detail.value
    })
  },
  // 查询公寓水电信息
  getEleDevInfoss(){
    let params={
      current: this.data.current,
      devType: this.data.devType,
      size: this.data.size,
      gyId: this.data.gyId,
      devType: this.data.devType,
      sn:this.data.sn
    }
    console.log(params)
    getEleDevInfos(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        let obj = res.data.data.list.filter(item => {
          if (item.onlineStatus === 0) {
            item.devTypeName = '不在线'
          } else if (item.onlineStatus === 1) {
            item.devTypeName = '在线'
          }
          this.data.inforArr.push(item)
          return item
        })
        // 判断是否可以下拉加载
        if (obj.length == 0){
          this.setData({
            isinfor:false
          })
          return
        }else{
          this.setData({
            isinfor: true
          })
        }
        this.setData({
          inforList: this.data.inforArr
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
    console.log(this.data.inforList)
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
    if (this.data.isinfor){
      this.setData({
        current:this.data.current + 1
      })
      this.getEleDevInfoss()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})