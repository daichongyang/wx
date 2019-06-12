// pages/houseDetails/houseDetails.js
var utils = require('../../utils/url.js');
const app = getApp()
var type = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    houseInfoData: {},//房源详情
    sameTypeHousList: [],//同类型房源
    currentImg:1
  },
 
  //滑动轮播图
  swiperbindtransition: function (e) {
    console.log(e);
    var currentImg = e.detail.current + 1;
    this.setData({
      currentImg: currentImg
    })
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadApartmentInfoData(options.apartmentId);
  },

  //加载数据
  loadApartmentInfoData: function (apartmentId){
    wx.request({
      url: utils.apartmentInfoUrl + apartmentId,
      success:res => {
        console.log(res);
        this.setData({
          houseInfoData : res.data.data,
        })
        this.requestloadTheSameTypeHousData(type);
      }
    })
  },

  //同类型房源
  requestloadTheSameTypeHousData: function (type) {
    wx.request({
      url: utils.apartmentInfoListUrl + this.data.houseInfoData.apartmentId + '/' + type,
      success: res => {
        console.log(res);
        var moreHouseListAction = true;
        if (res.data.data.count > 5 && type == 0) {
          moreHouseListAction = false;
        } else {
          moreHouseListAction = true;
        }
        this.setData({
          sameTypeHousList: res.data.data,
          moreHouseListAction: moreHouseListAction,
        })
      }
    })
  },
  //点击查看全部剩下的房源
  lookAllHouseListClick: function () {
    type = 1;
    //同类型房源
    this.requestloadTheSameTypeHousData(type);
  },

  //houseInfoClick点击在租房源
  houseInfoClick:function(e){
    console.log(e.currentTarget.dataset.id);
    console.log(this.data.sameTypeHousList.houses[e.currentTarget.dataset.id].houseId)
    wx.navigateTo({
      url: '/pages/houseLastDetails/houseLastDetails?houseId=' + this.data.sameTypeHousList.houses[e.currentTarget.dataset.id].houseId,
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