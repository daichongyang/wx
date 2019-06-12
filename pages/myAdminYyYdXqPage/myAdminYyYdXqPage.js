// pages/myAdminYyYdXqPage/myAdminYyYdXqPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index:100,
    dataSource:{},
  },

  //联系
  callClick:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.dataSource.phone,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.index == 1){
      wx.setNavigationBarTitle({
        title: '预约详情',
      })
    } else if(options.index == 2){
      wx.setNavigationBarTitle({
        title: '预定详情',
      })
    }
    console.log(JSON.parse(options.obj));
    this.setData({
      index:options.index,
      dataSource: JSON.parse(options.obj)
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