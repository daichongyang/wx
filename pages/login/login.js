// pages/login/login.js
//导入网址
var utils = require('../../utils/url.js');
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',//手机号
    code: '',//验证码
    codename: '获取验证码',
    disabled:false
  },
  //获取input输入框的值
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  getCodeValue: function (e) {
    this.setData({
      code: e.detail.value
    })
  },
  //被调用
  getCode: function () {
    var _this = this;
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500,
      })
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500
      })
    } else {
      var num = 61;
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          _this.setData({
            codename: '重新发送',
            disabled: false
          })
        } else {
          _this.setData({
            codename: num + "s"
          })
        }
      }, 1000)
      wx.request({
        data: {
          // phone: this.data.phone
        },
        url: utils.registerCodeUrl + '/' + this.data.phone,
        success(res) {
          _this.setData({
            disabled:true
          })
          wx.showToast({
            title: '获取验证码已发送，请查收',
            icon: 'none',
            duration: 1500
          })
         
        }
      })

    }
  },

  //获取验证码
  getVerificationCode() {
    this.getCode();
  },

  //提交表单信息(登录)
  submit: function () {
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.phone == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
    } else if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500
      })
    }
    if (this.data.code == "") {
      wx.showToast({
        title: '验证码不能为空',
        icon: 'none',
        duration: 1500
      })
    } else { //提交成功
      console.log(utils.registerUrl)
        wx.request({
          url: utils.registerUrl,
          method:"POST",
          data:{
            openId: app.globalData.userInfo.openId,
            verifyCode: this.data.code,
            phone: this.data.phone,
          },
          success:res => {
            console.log(res);
            if(res.data.code == 200){
              app.globalData.userInfo = res.data.data;
            // app.globalData.token = res.data.data.token;
            // app.globalData.nickName = res.data.data.nickName;
            // app.globalData.openId = res.data.data.openId;
            // app.globalData.phone = res.data.data.phone;
              wx.navigateBack({
                delta: 1
              })
            }else{
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1500
              })
             
            }
            
          }
        })
    }
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