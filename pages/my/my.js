// pages/my/my.js
//获取应用实例
const app = getApp()
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
import { permission} from "../../utils/url.js"
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //头像
    headerImage:"",
    name:"未登录",
    myDetail:"查看或编辑个人资料",
    myyy:0,
    myyd:0,
    mygz:0,
    myfb:0,
    headerImage:"../../img/my/bb_wd_04@2x.png",
    isTenant:'',
    gmtCreate:"",
    title: "暂无通知!",
    listMsg:[],
    msgIndex: 0,
    isguanli:false
  },
  // 监听是否点击了当前这个tabBar
  onTabItemTap(item) {
    // 监听是否有租约来显示右下角图标
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.request({
          data: {
            code: res.code,
          },
          url: utils.userAccessUrl,
          success: res => {
            console.log(res);
            app.globalData.userInfo = res.data.data;
            wx.setStorageSync("userInfo", app.globalData.userInfo);
            if (app.globalData.userInfo.token) {
              console.log("登录成功已经绑定手机号");
            }
          }
        })
      }
    })

  },
  //通知
  noticeClick: function () {
    console.log();
    var isLogin = this.isLogin();
    if (isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/informationTypeListPage/informationTypeListPage?time=' + this.data.gmtCreate + '&msgTitle=' + "公告通知" + '&arr=' + JSON.stringify(this.data.listMsg),
      })
     
    }
  },
  //我的账单 我的租约 智能水电表 保修保养  我的预约 我的预定 我的关注 我的发布
  contentClick: function (e) {
    console.log(e)
    var isLogin = this.isLogin();
    if (isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else if (e.currentTarget.dataset.text == "我的预约") {
        wx.navigateTo({
          url: '/pages/reservationlist/reservationlist',
        })
    } else if (e.currentTarget.dataset.text == "我的关注") {
      wx.navigateTo({
        url: '/pages/myAttention/myAttention',
      })
    } else if (e.currentTarget.dataset.text == "我的预定"){
      wx.navigateTo({
        url: '/pages/advancePage/advancePage',
      })
    } else if (e.currentTarget.dataset.text == "我的租约") {
      wx.navigateTo({
        url: '/pages/myLeasePage/myLeasePage',
      })
    } else if (e.currentTarget.dataset.text == "我的账单") {
      wx.navigateTo({
        // url: '/pages/payHouseMoney/payHouseMoney',
        url: '/pages/myBills/myBills',
      })
    } else if (e.currentTarget.dataset.text == "智能水电表") {
      wx.navigateTo({
        url: '/pages/waterMeterList/waterMeterList',
      })
    } else if (e.currentTarget.dataset.text == "报修保养") {
      wx.navigateTo({
        url: '/pages/myRepairListPage/myRepairListPage',
      })
    } else if (e.currentTarget.dataset.text == "我的发布") {
      // wx.navigateTo({
      //   url: '/pages/myRepairListPage/myRepairListPage',
      // })
    }
      
  },

  //门禁通行证
  passClick: function () {
    wx.navigateTo({
      url: '/pages/mjPassPage/mjPassPage',
    })
  },
 
  //入住人信息 我的优惠卡包 我的积分 投诉与反馈 设置
  footClick: function (e) {
    var isLogin = this.isLogin();
    if (isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else if (e.currentTarget.dataset.text == "入住人信息") {
      wx.navigateTo({
        url: '/pages/leaseTenant/leaseTenant',
      })
    } else if (e.currentTarget.dataset.text == "设置") {
      wx.navigateTo({
        url: '/pages/setUpPage/setUpPage',
      })
    } else if (e.currentTarget.dataset.text == "我是管理员") {
      wx.navigateTo({
        url: '/pages/myAdminPage/myAdminPage',
      })
    }
  },
  // 登录绑定手机号
  headerClick:function(){
    var isLogin = this.isLogin();
    if(isLogin){
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else{
      wx.navigateTo({
        url: '/pages/myData/myData',
      })
    }
  },
//  是否有管理员模块权限
  isAdministrator(){
    permission().then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          isguanli: res.data.data
        })
      }
    })
  },
 //判断是否需要登录
 isLogin:function(){
   if (!app.globalData.userInfo.token){
        return true;
      }else{
        return false;
      }
 },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.isAdministrator()
    var data = wx.getStorageSync("userInfo");
    console.log("*********----------********")
    console.log(data)
    app.globalData.userInfo = data;
    this.loadCenterMsg();
    this.loadDataMsgSource();
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
    if (!app.globalData.userInfo) {
      this.loadCode();
      console.log("00000000000");
    }
    //红点
    this.setData({
      msgIndex: app.globalData.msgIndex
    })
    //判断是否登录登录则改变name
    if (app.globalData.userInfo.headImg == ""){
      if (app.globalData.userInfo.token) {
        this.setData({
          name: app.globalData.userInfo.nickName,
          isTenant: app.globalData.userInfo.isTenant,
        })
      }
    }else{
      if (app.globalData.userInfo.token) {
        this.setData({
          name: app.globalData.userInfo.nickName,
          isTenant: app.globalData.userInfo.isTenant,
          headerImage: app.globalData.userInfo.headImg,
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
          }
        })
      }
    })
  },

  //加载数据
  loadDataMsgSource: function () {
    if (app.globalData.userInfo.token) {
      wx.request({
        method: "POST",
        url: utils.noticeCenterUrl,
        header: {
          "Authorization": app.globalData.userInfo.token,
        },
        success: res => {
          console.log(res);
          if (res.data.code == 200) {
            var gmtCreate = "";
            var title = "暂无通知";
            if (res.data.data.platformMsg.msg.length > 0){
              gmtCreate = util.formatTimeTwo(res.data.data.platformMsg.msg[0].gmtCreate / 1000, 'Y/M/D h:m:s');
              title = res.data.data.platformMsg.msg[0].message;
            }
            this.setData({
              listMsg: res.data.data.platformMsg.msg,
              gmtCreate: gmtCreate,
              title: title,
            })
          }
        }
      })
    }


  },


  //消息盒子
  msgClick: function () {
    wx.navigateTo({
      url: '/pages/informationTypePage/informationTypePage',
    })
  },


  //个人中心消息个数
  loadCenterMsg:function(){
    if (app.globalData.userInfo.token){
      wx.request({
        method: "POST",
        url: utils.noticeCenterListUrl,
        header: {
          "Authorization": app.globalData.userInfo.token,
        },
        success:res =>{
          console.log(res);
          this.setData({
            myyy: res.data.data.advanceCount,
            myyd: res.data.data.leaseCount,
            mygz: res.data.data.collectionCount,
            myfb: res.data.data.releaseCount,
          })
        }
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
    this.loadCenterMsg();
    this.loadDataMsgSource();
    this.isAdministrator();
    wx.stopPullDownRefresh();
    if (!app.globalData.userInfo) {
      this.loadCode();
      console.log("00000000000");
    }
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