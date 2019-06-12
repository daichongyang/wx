// pages/bindingPage/bindingPage.js
var utils = require('../../utils/url.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:0,
    bindinputValue:"",
    codeValue:"",
    codename:"获取验证码",
    disabled:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      index:options.index,
    })
    if(options.index == 1){
      wx.setNavigationBarTitle({
        title: '绑定手机',
      })
    } else if (options.index == 2){
      wx.setNavigationBarTitle({
        title: '绑定邮箱',
      })
    } else if (options.index == 3) {
      wx.setNavigationBarTitle({
        title: '修改昵称',
      })
    }
  },

  //输入事件
  bindinput:function(e){
    console.log(e);
    this.setData({
      bindinputValue: e.detail.value,
    })
  },
  //输入验证码
  bindCode:function(e){
    console.log(e);
    this.setData({
      codeValue: e.detail.value,
    })
  },


  //获取验证码
  getCodeClick:function(){
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.bindinputValue == "") {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
    } else if (!myreg.test(this.data.bindinputValue)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500
      })
    }else{
      var num = 61;
      var _this = this;
      var timer = setInterval(function () {
        num--;
        if (num <= 0) {
          clearInterval(timer);
          _this.setData({
            codename: '获取验证码',
            disabled: false
          })
        } else {
          _this.setData({
            codename: num + "s",
            disabled: true,
          })
        }
      }, 1000)
      wx.request({
        url: utils.registerCodeUrl + '/' + this.data.bindinputValue,
        success:res =>{
          console.log(res);
        }
      })
    }
  },

  //确定修改
  okClick:function(){
    console.log(this.data.codeValue);
    if(this.data.index == 1){
      var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
      if (this.data.bindinputValue == "") {
        wx.showToast({
          title: '手机号不能为空',
          icon: 'none',
          duration: 1500
        })
      } else if (!myreg.test(this.data.bindinputValue)) {
        wx.showToast({
          title: '请输入正确的手机号',
          icon: 'none',
          duration: 1500
        })
      } else if (this.data.codeValue == "") {
        wx.showToast({
          title: '请输入验证码',
          icon: 'none',
          duration: 1500
        })
      }else{
        wx.request({
          method: "POST",
          url: utils.userPhoneUpdateUrl,
          header: {
            "Authorization": app.globalData.userInfo.token,
          },
          data:{
            phone: this.data.bindinputValue,
            verifyCode:this.data.codeValue
          },
          success:res =>{
            console.log(res);
            if (res.data.code == 200) {

              this.loadCode();
              // app.globalData.userInfo.phone = this.data.bindinputValue;
              // wx.navigateBack({
              //   detail: 1,
              // })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1500
              })
            }
          }
        })
      }
    } else if (this.data.index == 2 ){
      if (this.data.bindinputValue == "") {
        wx.showToast({
          title: '内容不能为空',
          icon: 'none',
          duration: 1500
        })
      }else{
        wx.request({
          method: "POST",
          url: utils.userUpdateUrl,
          header: {
            "Authorization": app.globalData.userInfo.token,
          },
          data: {
            email: this.data.bindinputValue
          },
          success: res => {
            console.log(res);
            if(res.data.code == 200){
              app.globalData.userInfo.email = this.data.bindinputValue;
              wx.navigateBack({
                detail:1,
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
    } else if (this.data.index == 3){
      if (this.data.bindinputValue == "") {
        wx.showToast({
          title: '内容不能为空',
          icon: 'none',
          duration: 1500
        })
      } else {
        wx.request({
          method: "POST",
          url: utils.userUpdateUrl,
          header: {
            "Authorization": app.globalData.userInfo.token,
          },
          data: {
            nickName: this.data.bindinputValue
          },
          success: res => {
            console.log(res);
            if (res.data.code == 200) {
              app.globalData.userInfo.nickName = this.data.bindinputValue;
              wx.navigateBack({
                detail: 1,
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 1500
              })
            }
          }
        })
      }
    }


  },


  //加载code
  loadCode: function () {
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          data: {
            code: res.code,
          },
          url: utils.userAccessUrl,
          success: res => {
            app.globalData.userInfo = res.data.data;
            wx.setStorageSync("userInfo", app.globalData.userInfo);
            wx.showToast({
              title: '修改成功',
              icon: 'none',
              duration: 1500
            })
            wx.navigateBack({
              detail: 1,
            })
          }
        })
      }
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