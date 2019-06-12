// pages/selectCity/selectCity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityList:[],
  },
  // 选择城市
  selectCity:function(e){
    var that = this;
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      city: that.data.cityList[e.target.id].name + " ▾",
      index: that.data.cityList[e.target.id].locationId,
      isBack:true,
    })
    wx.navigateBack({
      delta:1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      cityList: JSON.parse(options.cityModel).data
    })
    console.log(this.data.cityList)
    
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