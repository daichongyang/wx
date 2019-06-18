// pages/myData/myData.js
const app = getApp()
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    headerImage: "../../img/my/bb_wd_04@2x.png",
    name:"",
    sex:0,
    birthday:"",
    idCard:"",
    range:['女','男'],
    maskFlag:true,
    selcetHeaderImage: "../../img/my/bb_wd_04@2x.png",
  },

  //修改生日
  bindDateChange:function(e){
    console.log(e);
    wx.request({
      method: "POST",
      url: utils.userUpdateUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        birthday: e.detail.value,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          app.globalData.userInfo.birthday = e.detail.value;
          this.setData({
            birthday: e.detail.value,
          })
          wx.showToast({
            title: "修改成功",
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },

  //修改头像
  lookImageClick:function(){
    console.log("==");
    this.setData({
      maskFlag:false,
    })
  },

  //修改名字
  setNameClick:function(){
    wx.navigateTo({
      url: '/pages/bindingPage/bindingPage?index=' + 3,
    })
  },
  //绑定银行卡
  gomyBackCard:function(){
    wx.navigateTo({
      url: '/pages/myBackCard/myBackCard',
    })
  },
  //设置支付密码
  gosetPayPassword:function(){
    wx.navigateTo({
      url: '/pages/setPayPassword/setPayPassword',
    })
  },
  //点击X关闭蒙版
  offMaskClick:function(){
    this.setData({
      maskFlag: true,
    })
  },
  //阻止事件穿透
  stopClick:function(){
    console.log("阻止事件穿透");
  },

  //选择头像
  selcetdHeaderImageClick:function(){
    wx.chooseImage({
      count:1,
      success: res =>{
        console.log(res);
        this.setData({
          selcetHeaderImage: res.tempFilePaths[0],
        })
      },
    })

  },

  //bigImageClick查看datup
  bigImageClick:function(){
    if (this.data.selcetHeaderImage != "../../img/my/bb_wd_04@2x.png"){
      wx.previewImage({
        urls: [this.data.selcetHeaderImage],
      })
    }
  },
  //修改头像后确定按钮
  loadHeaderImageClick:function(){
    if (this.data.selcetHeaderImage != this.data.headerImage) {
      wx.uploadFile({
        method: "POST",
        url: utils.uploadUploadfileUrl,
        header: {
          "Authorization": app.globalData.userInfo.token,
        },
        filePath: this.data.selcetHeaderImage,
        name: 'file',
        success: res => {
          console.log(JSON.parse(res.data));
          var data = JSON.parse(res.data);
          var image = data.data[0];
          this.okImage(image);
        }
      })
    }else{
      wx.showToast({
        title: "请选择需要修改的头像",
        icon: 'none',
        duration: 1000
      })
    }
  },

  okImage:function(image){
    wx.request({
      method: "POST",
      url: utils.userUpdateUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        headImg: image,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          app.globalData.userInfo.headImg = this.data.selcetHeaderImage;
          this.setData({
            headerImage: this.data.selcetHeaderImage,
            maskFlag:true,
          })
          wx.showToast({
            title: "修改成功",
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },

  //修改性别
  bindchange:function(e){
    console.log(e);
    wx.request({
      method: "POST",
      url: utils.userUpdateUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        sex: e.detail.value
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          app.globalData.userInfo.sex = e.detail.value;
          var sex;
          if (e.detail.value == 0){
            sex = "女";
          }else{
            sex = "男";
          }
          this.setData({
            sex: sex,
          })
          wx.showToast({
            title:"修改成功",
            icon: 'none',
            duration: 1500
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
    if (app.globalData.userInfo.headImg != ""){
      this.setData({
        headerImage: app.globalData.userInfo.headImg,
        selcetHeaderImage: app.globalData.userInfo.headImg
      })
    }
    var sex;
    var idCard;
    if (app.globalData.userInfo.sex == 0){
      sex = "女";
    }else{
      sex = "男";
    }
    if (app.globalData.userInfo.idCard == null){
      idCard = "";
    }else{
      idCard = app.globalData.userInfo.idCard;
    }
    var birthday;
    console.log(app.globalData.userInfo.birthday);
    if (app.globalData.userInfo.birthday.length == 10){
      birthday = app.globalData.userInfo.birthday 
    }else{
      birthday = util.formatTimeTwo(app.globalData.userInfo.birthday / 1000, 'Y/M/D');
    }
    this.setData({
      name: app.globalData.userInfo.nickName,
      sex: sex,
      birthday: birthday,
      idCard: idCard,
    })
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