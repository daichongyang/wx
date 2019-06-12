// pages/setUserPassward/setUserPassward.js
import { getVerifyCode, verifyCode}  from "../../utils/url.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 数据提交
    putInfor: {},
    // 验证码读秒
    count:'获取验证码',
    // 获取的手机号
    phoneNum:'',
    // 验证码
    code:'',
    // 防止重复获取验证码
    checkstyle:false,
    // 传参数到修改密码页面,
    paramss:{}
  },
  // 获取绑定的手机号
  getPhoneNum(e){
    this.setData({
      phoneNum: e.detail.value
    })
  },
  // 获取验证码
  getCode(e){
    this.setData({
      code: e.detail.value
    })
  },
  // 获取手机验证码
  getVerifyCodee() {
    let params = {
      phoneNum: this.data.phoneNum
    }
    console.log(params)
    getVerifyCode(params).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        let num = 30
        let _this = this
        this.setData({
          checkstyle: true
        })
        let changeCout = setInterval(function(){
          _this.setData({
            count: num-- +"s"
          })
          if (num < 0){
            clearInterval(changeCout)
            _this.setData({
              count: "获取验证码",
              checkstyle: false
            })
          }
        },1000)
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:'none',
          duration: 1500
        })
      }
    }).catch(err => {
      wx.showToast({
        title: "请求失败",
        icon: 'none',
        duration: 1500
      })
    })
  },
  // 验证
  verifyCodee(){
    let params = {
      code : this.data.code,
      phoneNum :this.data.phoneNum
    }
    console.log(params)
    verifyCode(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          paramss: res.data.data
        })
        this.goPaySuccese()
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 2000,
        })
      }
    }).catch(err =>{
      wx.showToast({
        title: "请求失败",
        icon: 'none',
        duration: 2000,
      })
    })
  },
  goPaySuccese: function () {
    wx.navigateTo({
      url: '/pages/setUserPassward2/setUserPassward2?paramss=' + JSON.stringify(this.data.paramss) 
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