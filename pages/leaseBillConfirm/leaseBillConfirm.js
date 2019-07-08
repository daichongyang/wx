// pages/leaseBillConfirm/leaseBillConfirm.js

var dateTool = require('../../utils/date.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList: [], //图片数组
    accountReceivable: 0, // 收款金额
    startTime: "2000-01-01", 
    endTime: null // 收款日期
  },

  //添加照片
  addImageClick: function () {
    if (this.data.imgList.length >= 5) {
      wx.showToast({
        title: '只能上传5张图片',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      var count = 5 - this.data.imgList.length;
    }
    wx.chooseImage({
      count: count,
      success: res => {
        console.log(res.tempFilePaths);
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          this.data.imgList.push(res.tempFilePaths[i]);
        }
        this.setData({
          imgList: this.data.imgList,
        })
        console.log(this.data.imgList);
      },
    })
  },
  
  //删除照片
  deltelImage: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.data.imgList.splice(id, 1);
    this.setData({
      imgList: this.data.imgList,
    })
  },

  //查看大图
  lookImageClick: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.previewImage({
      current: this.data.imgList[id], // 当前显示图片的http链接
      urls: this.data.imgList// 需要预览的图片http链接列表
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      accountReceivable: options.accountReceivable,
      endTime: dateTool.formatTimeStamp(new Date() / 1000, "yyyy-MM-dd")
    })
  },

  // 日期选择
  bindDateChange: function (e) {
    this.setData({
      endTime: e.detail.value
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