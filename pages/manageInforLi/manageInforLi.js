// pages/manageInforLi/manageInforLi.js
var util = require('../../utils/util.js');
import { messageList, markMessage, deleteMessage } from "../../utils/url.js"
import { getDateArray } from "../../utils/myDate.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    title: "",
    msgType:"",
    current:1,
    size:10,
    inforArr:[]
  },
  getmessageList(){
    let pramas = {
      msgType: this.data.msgType,
      current: this.data.current,
      size: this.data.size,
    }
    messageList(pramas).then(res => {
      console.log(res)
      if(res.data.code == 200){
        let obj = res.data.data.records.filter(function (item) {
          item.gmtCreate = getDateArray(item.gmtCreate)[17]
          return item
        })
        this.setData({
          inforArr: this.data.inforArr.concat(obj)
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:"none"
        })
      }
    })
  },
  // 消息通知中心-置未读为已读
  readNoticee(event) {
    console.log(event)
    let obj = event.currentTarget.dataset
    markMessage(obj.item.messageId).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        let newObj = this.data.inforArr.filter(item => {
          if (obj.item.messageId == item.messageId) {
            item.isRead = 1
          }
          return item
        })
        this.setData({
          inforArr: newObj,
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
      title: options.msgTitle,
    })
    this.setData({
      title: options.msgTitle,
      msgType: options.msgType,
    })
    this.getmessageList()
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