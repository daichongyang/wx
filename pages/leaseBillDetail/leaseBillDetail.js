// pages/leaseBillDetail/leaseBillDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    billItem: null, // 账单详情
    isHidden: false
  },

  bottomClick: function (e) {
    switch (e.currentTarget.dataset.item) {
      case "confirm":
      {
          wx.navigateTo({
            url: '/pages/leaseBillConfirm/leaseBillConfirm?billItem=' + JSON.stringify(this.data.billItem)
          })
      }
        break;
      default:
        break;
    } 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var item = JSON.parse(options.billItem);
    console.log(item);
    var isHidden = item.validStatus == 0 ? (item.payStatus == 0 ? true : false) : false;
    this.setData({
      billItem: JSON.parse(options.billItem),
      isHidden: isHidden
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