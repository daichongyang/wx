// pages/homePage/homePage.js
var utils = require('../../utils/url.js');
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    city:"选择城市 ▾",
    index:0,
    isBack:false,//返回时候判断是否选择过城市
    cityModel:{}, 
    houseList: [],
    houseIndexList:[],
    isTenant:"0",
    msgIndex:0,
  },
  // 查看二维码页面
  goLogoQrcode(){
    wx.navigateTo({
      url: '/pages/logoQRCode/logoQRCode'
    })
  },
// 这是一个管微信支付的测试方法
  testWXP(){
    console.log(1111111)
    wx.request({
      method: "POST",
      url: utils.icbcComPay + 279,
      // data:{
      //   amount: "0.01",
      //   buyerId: "oD1UN5LtyBP2a2-c2EBfaui6f2C4",
      //   desc: "string",
      //   payMethod: "1",
      //   subject: "string"
      // },
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res)
        if (res.data.code == 201) {
          wx.showToast({
            title: '操作失败',
            icon: 'none',
            duration: 1000
          })
        } else {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: res.data.data.signType,
            paySign: res.data.data.paySign,
            success: res => {
              wx.showToast({
                title: '支付成功',
                icon: 'none',
                duration: 1000
              })
              wx.navigateBack({
                detail: 1
              })
            },
            fail: function (res) {
              wx.navigateBack({
                detail: 1
              })
            }
          })
        }
      }
    })
  },

  //点击精选房源
  houseInfoClick:function(e){
    console.log(e.currentTarget.dataset.id);
    console.log(this.data.houseList[e.currentTarget.dataset.id].houseId)
    wx.navigateTo({
      url: '/pages/houseDetails/houseDetails?houseId=' + this.data.houseList[e.currentTarget.dataset.id].houseId,
    })
  },
  //找房
  lookingHouse:function(e){
    //携带参数跳转找房页面
    wx.navigateTo({
      url: '/pages/lookingHouse/lookingHouse?type=' + e.currentTarget.dataset.id +'&cityId='+this.data.index,
    })           
  },
  //搜索
  search:function(){
    // wx.navigateTo({
    //   url: '/pages/search/search',
    // })
    wx.navigateTo({
      url: '/pages/lookingHouse/lookingHouse?type=' + 3+ '&cityId=' + this.data.index,
    })
  },
  // 选择城市
  selectCity:function(){
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
    console.log("---------*********----------")
    console.log(data)
    app.globalData.userInfo = data;
    //第一步
    this.loadCityDataSource();
  },


  //加载code
  loadCode:function(){
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
          // console.log(utils.noticeListRemindUrl + '=============')
          console.log(res.data.data);
          app.globalData.msgIndex = res.data.data;
          this.setData({
            msgIndex:res.data.data,
          })
        }
      })
    }
  },

  //首先取得城市
  loadCityDataSource:function(){
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
          _this.requestLoadImageList()
        }
      }
    })
  },

  //然后再请求轮播图
  requestLoadImageList:function(){
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
        //房源
        _this.requestLoadlocationUrlOK();
      }
    })
  },

  //城市列表请求完毕后才能调用该接口精品房源
  requestLoadlocationUrlOK:function(){
    var _this = this;
    //精选房源
    wx.request({
      data: {         
        cityId: this.data.index,
        type: 0,
      },
      url: utils.houseListBoutiqueUrl,
      success: function (e) {
        _this.setData({
          houseList: e.data.data,
          isBack:false,
        })
        wx.stopPullDownRefresh()
        _this.loadDataMsgSource();
      }
    })
  },

  //消息盒子
  msgClick:function(){
    wx.navigateTo({
      url: '/pages/informationTypePage/informationTypePage',
    })
  },

  //门禁通行证
  passClick:function(){
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

    if (!app.globalData.userInfo) {
      this.loadCode();
      console.log("00000000000");
    }

    if(this.data.isBack == true){
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
    if (this.data.city == "选择城市 ▾"){
      this.loadCityDataSource();
    }else{
      this.requestLoadlocationUrlOK();
    }

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