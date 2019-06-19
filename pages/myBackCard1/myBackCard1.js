// pages/myBackCard1/myBackCard1.js
const app = getApp()
import {
  getBindUserCardInfo,
  delBindUserCardInfo
} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: "",
    carList: [],
    email: "未绑定"
  },
  // 长按删除银行卡
  bindlongp(e) {
    let params = {
      id: e.currentTarget.dataset.id
    }
    let _this = this
    wx.showModal({ //使用模态框提示用户进行操作
      title: '警告',
      content: '确定要删除这张银行卡吗',
      success: function(res) {
        if (res.confirm) { //判断用户是否点击了确定
          delBindUserCardInfo(params).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              _this.getBindUserCardInfoo()
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
    })
  },
  // 获取银行看列表
  getBindUserCardInfoo() {
    getBindUserCardInfo().then(res => {
      console.log(res)
      if (res.data.code == 200) {
        this.setData({
          carList: res.data.data.filter(item => {
            item.accNo = item.accNo.substring(item.accNo.length - 4)
            return item
          })
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //退出登录
  exitLoginClick: function() {

  },

  //绑定银行卡
  bindingCarNext: function() {
    wx.navigateTo({
      url: '/pages/myBackCard/myBackCard'
    })
  },
  //绑定邮箱
  bindingEmailClick: function() {
    wx.navigateTo({
      url: '/pages/bindingPage/bindingPage?index=' + 2,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getBindUserCardInfoo()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    console.log("=====+++++++++====")
    if (app.globalData.userInfo.email) {
      this.setData({
        phone: app.globalData.userInfo.phone,
        email: app.globalData.userInfo.email,
      })
    } else {
      this.setData({
        phone: app.globalData.userInfo.phone,
      })
    }

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})