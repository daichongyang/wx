// pages/informationTypeListPage/informationTypeListPage.js
var util = require('../../utils/util.js');
import {readNotice} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    arr:[],
  },
  // 消息通知中心-置未读为已读
  readNoticee(event){
    console.log(event)
    let obj = event.currentTarget.dataset
    readNotice(obj.item.msgId).then(res => {
      console.log(res)
      if(res.data.code == 200){
        let newObj = this.data.arr.filter(item => {
          if (obj.item.msgId == item.msgId){
            item.unread = 0
          }
          return item
        })
        this.setData({
          arr: newObj,
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.setData({
      title:options.msgTitle,
      time:options.time,
      arr:JSON.parse(options.arr),
    })
    for(let i = 0;i < this.data.arr.length; i++){
      this.data.arr[i].gmtCreate = util.formatTimeTwo(this.data.arr[i].gmtCreate / 1000, 'Y/M/D h:m:s');
    }
    this.setData({
      title: options.msgTitle,
      arr: this.data.arr,
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