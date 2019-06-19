// pages/myBackCard1/myBackCard.js
const app = getApp()
import { userCarbindUserCard } from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
<<<<<<< HEAD
    accName: "涝瀑邢",//用户名
    accNo: "6212884000000120143",//卡号/账号
    deadLine: "20190615",//个人认证有效日期时间yyyyMMdd
    idCode: "422698196711123011",//身份号
    idType: '0',//0-身份证，1-护照，2-军官证，3-士兵证，4-港澳台居民往来通行证，5-临时身份证，6-户口本 7-其他，9-警官证，12-外国人永久居留证
    mobilePhone: "15907678449",//预留手机号码
=======
    accName: "忆将驱",//用户名
    accNo: "6222084000008950134",//卡号/账号
    // deadLine: "20200615",//个人认证有效日期时间yyyyMMdd
    idCode: "457077199211273004",//身份号
    idType: '0',//0-身份证，1-护照，2-军官证，3-士兵证，4-港澳台居民往来通行证，5-临时身份证，6-户口本 7-其他，9-警官证，12-外国人永久居留证
    mobilePhone: "18710579162",//预留手机号码
>>>>>>> allwork
    email: "",
    smssendNo:'10023870'
  },
  getaccName: function (e) {
    console.log(e);
    this.setData({
      accName: e.detail.value,
    })
  },
  getaccNo: function (e) {
    console.log(e);
    this.setData({
      accNo: e.detail.value,
    })
  },
  getidCode: function (e) {
    console.log(e);
    this.setData({
      idCode: e.detail.value,
    })
  },
  getidmobilePhone: function (e) {
    console.log(e);
    this.setData({
      mobilePhone: e.detail.value,
    })
  },
// 绑定银行卡提交信息
  userCarbindUserCardd(){
    let params = {
      accName: this.data.accName,
      accNo: this.data.accNo,
      deadLine: this.data.deadLine,
      idType: this.data.idType,
      mobilePhone: this.data.mobilePhone,
      idCode: this.data.idCode
    }
    userCarbindUserCard(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.data.smssendNo = res.data.data.smssendNo
        wx.showToast({
          title: '操作成功',
          icon: 'none',
          duration: 1000
        })
        let _this = this
        setTimeout(function(){
<<<<<<< HEAD
          _this.choisePayWay()
=======
          _this.sureBingdinCarr()
>>>>>>> allwork
        },1000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '网络请求失败',
        icon: 'none',
        duration: 1000
      })
    })
  },
  //退出登录
  exitLoginClick: function () {

  },
  // 确定绑定
  sureBingdinCarr(){
    wx.navigateTo({
      url: '/pages/sureBingdinCar/sureBingdinCar?smssendNo=' + this.data.smssendNo
    })
  },
  //选择卡
  bindingCarNext: function () {
    wx.navigateTo({
      url: '/pages/myBackCard1/myBackCard1'
    })
  },
  //绑定邮箱
  choisePayWay: function () {
    wx.navigateTo({
      url: '/pages/choisePay/choisePay',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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