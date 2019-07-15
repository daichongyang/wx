// pages/businessCircle/businessCircle.js
var utils = require('../../utils/url.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city: "选择城市 ▾",
    index: 0,
    isBack: false,//返回时候判断是否选择过城市
    cityModel: {},
    houseIndexList: [],
    isTenant: "0",
    msgIndex: 0,
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
  //点击精选房源
  houseInfoClick: function (e) {
 
  },
  //小件速送  家政 外卖 快递
  lookingHouse: function (e) {

  },
  //搜索
  search: function () {
  },

  // 选择城市
  selectCity: function () {
    var _this = this;
    var queryBean = JSON.stringify(_this.data.cityModel)
    console.log(_this.data.cityModel);
    wx.navigateTo({
      url: '/pages/selectCity/selectCity?cityModel=' + queryBean,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var data = wx.getStorageSync("userInfo");
    console.log(data)
    console.log("*********")
    app.globalData.userInfo = data;
    this.loadCityDataSource();
    this.loadDataMsgSource();
  },

  //是否有消息判断
  loadDataMsgSource: function () {
    if (app.globalData.userInfo.token) {
      wx.request({
        method: "POST",
        url: utils.noticeListRemindUrl,
        header: {
          "Authorization": app.globalData.userInfo.token,
        },
        success: res => {
          console.log(res);
          this.setData({
            msgIndex: res.data.data,
          })
        }
      })
    }


  },


  loadCityDataSource: function () {
    var _this = this;
    //城市列表
    wx.request({
      url: utils.locationUrl,
      success: function (e) {
        if (e.data.data.length > 0) {
          _this.setData({
            city: e.data.data[0].name + " ▾",
            index: e.data.data[0].locationId,
            cityModel: e.data,
          })
          _this.requestLoadlocationUrlOK()
        }
      }
    })
  },

  //城市列表请求完毕后才能调用该接口
  requestLoadlocationUrlOK: function () {
    var _this = this;
    //轮播图
    wx.request({
      data: {
        cityId: this.data.index,
      },
      url: utils.houseIndexUrl,
      success: function (e) {
        _this.setData({
          houseIndexList: e.data.data,
          isBack: false,
        })
        wx.stopPullDownRefresh()
      }
    })

  },

  //消息盒子
  msgClick: function () {
    wx.navigateTo({
      url: '/pages/informationTypePage/informationTypePage',
    })
  },

  //门禁通行证
  passClick: function () {
    wx.navigateTo({
      url: '/pages/mjPassPage/mjPassPage',
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
    if (this.data.isBack == true) {
      console.log(this.data.index)
      this.requestLoadlocationUrlOK();
    }
    //判断是否有门禁权限
    if (app.globalData.userInfo.token) {
      this.setData({
        isTenant: app.globalData.userInfo.isTenant,
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
    if (this.data.city == "选择城市 ▾") {
      this.loadCityDataSource();
    } else {
      this.requestLoadlocationUrlOK();
    }
    this.loadDataMsgSource();
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