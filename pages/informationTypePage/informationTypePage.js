// pages/informationTypePage/informationTypePage.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gmtCreate1 :"",
    gmtCreate2: "",
    gmtCreate3: "",
    gmtCreate4: "",
    gmtCreate5: "",
    gmtCreate6: "",

    title1: "",
    title2: "",
    title3: "",
    title4: "",
    title5: "",
    title6: "",

    listMsg:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("onLoad")
    
  },

  //加载数据
  loadDataMsgSource:function(){
    if (app.globalData.userInfo.token) {
      wx.request({
        method: "POST",
        url: utils.noticeCenterUrl,
        header: {
          "Authorization": app.globalData.userInfo.token,
        },
        success: res => {
          console.log(res);
          if(res.data.code == 200){
            var gmtCreate1 = '';
            var gmtCreate2 = '';
            var gmtCreate3 = '';
            var gmtCreate4 = '';
            var gmtCreate5 = '';
            var gmtCreate6 = '';

            var title1 = '无';
            var title2 = '无';
            var title3 = '无';
            var title4 = '无';
            var title5 = '无';
            var title6 = '无';
            if (res.data.data.billMsg.msg.length > 0){
               gmtCreate2 = util.formatTimeTwo(res.data.data.billMsg.msg[0].gmtCreate / 1000, 'Y/M/D h:m:s');
               title2 = res.data.data.billMsg.msg[0].message;
            }

            if (res.data.data.bulletinMsg.msg.length > 0){
              gmtCreate5 = util.formatTimeTwo(res.data.data.bulletinMsg.msg[0].gmtCreate / 1000, 'Y/M/D h:m:s');
              title5 = res.data.data.bulletinMsg.msg[0].message;
            }

            if (res.data.data.communityMsg.msg.length > 0){
               gmtCreate6 = util.formatTimeTwo(res.data.data.communityMsg.msg[0].gmtCreate / 1000, 'Y/M/D h:m:s');
               title6 = res.data.data.communityMsg.msg[0].message;
            }

            if (res.data.data.leaseMsg.msg.length > 0){
              gmtCreate3 = util.formatTimeTwo(res.data.data.leaseMsg.msg[0].gmtCreate / 1000, 'Y/M/D h:m:s');
              title3 = res.data.data.leaseMsg.msg[0].message;
            }

            if (res.data.data.platformMsg.msg.length > 0){
               gmtCreate1 = util.formatTimeTwo(res.data.data.platformMsg.msg[0].gmtCreate / 1000, 'Y/M/D h:m:s');
               title1 = res.data.data.platformMsg.msg[0].message;
            }

            if (res.data.data.serviceMsg.msg.length > 0){
               gmtCreate4 = util.formatTimeTwo(res.data.data.serviceMsg.msg[0].gmtCreate / 1000, 'Y/M/D h:m:s');
               title4 = res.data.data.serviceMsg.msg[0].message;
            }
              
            this.setData({
              listMsg: res.data.data,
              gmtCreate1:gmtCreate1,
              gmtCreate2:gmtCreate2,
              gmtCreate3: gmtCreate3,
              gmtCreate4: gmtCreate4,
              gmtCreate5: gmtCreate5,
              gmtCreate6: gmtCreate6,

              title1 : title1,
              title2:title2,
              title3: title3,
              title4:title4,
              title5: title5,
              title6:title6,
            })
          }
     
        }
      })
    }    


  },

  //msgListClick详情消息列表
  msgListClick:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var msgTitle;
    var time;
    console.log(this.data.listMsg);
    var arr = [];
    if(id == 1){
      msgTitle = "平台消息";
      time = this.data.gmtCreate1;
      arr = this.data.listMsg.platformMsg.msg;
    } else if (id == 2){
      msgTitle = "账单消息";
      time = this.data.gmtCreate2;
      arr = this.data.listMsg.billMsg.msg;
    } else if (id == 3) {
      msgTitle = "租约消息";
      time = this.data.gmtCreate3;
      arr = this.data.listMsg.leaseMsg.msg;
    } else if (id == 4) {
      msgTitle = "服务消息";
      time = this.data.gmtCreate4;
      arr = this.data.listMsg.serviceMsg.msg;
    } else if (id == 5) {
      msgTitle = "公告通知";
      time = this.data.gmtCreate5;
      arr = this.data.listMsg.bulletinMsg.msg;
    } else if (id == 6) {
      msgTitle = "社区通知";
      time = this.data.gmtCreate6;
      arr = this.data.listMsg.communityMsg.msg;
    }
    wx.navigateTo({
      url: '/pages/informationTypeListPage/informationTypeListPage?time=' + time + '&msgTitle=' + msgTitle + '&arr=' + JSON.stringify(arr),
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    console.log("onReady")
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    console.log("onShow")
    this.loadDataMsgSource();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    console.log("onHide")
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    console.log("onUnload")
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    console.log("onReady")
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