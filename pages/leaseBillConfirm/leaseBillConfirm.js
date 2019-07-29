// pages/leaseBillConfirm/leaseBillConfirm.js
var dateTool = require('../../utils/date.js');
import {
  adminConfirmIncome
} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentArray: ["线上", "现金", "支付宝转账", "微信转账", "银行转账", "POS刷卡", "其他", "对私银行转账"],
    paymentStr: "请选择",
    pathway: -1, // 付款方式
    imgList: [], //图片数组
    startTime: "2000-01-01", 
    receiptRemark: "",
    receiptNumber: "",
    billItem: null,
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
      billItem: JSON.parse(options.billItem),
      endTime: dateTool.formatTimeStamp(new Date() / 1000, "yyyy-MM-dd")
    })
  },

  // 日期选择
  bindDateChange: function (e) {
    this.setData({
      endTime: e.detail.value
    })
  },

  paymentChange: function (e) {
    this.setData({
      paymentStr: this.data.paymentArray[e.detail.value],
      pathway: e.detail.value
    })
  },

  bindinputName: function (e) {
    this.setData({
      receiptNumber: e.detail.value
    })
  },

  bindinputTextareaClick: function (e) {
    this.setData({
      receiptRemark: e.detail.value
    })
  },

  overClick: function () {
    if (this.data.pathway == -1) {
      wx.showToast({
        title: '请选择收款方式',
        icon: 'none',
        duration: 1500
      })
    } else {
      let params = {
        amountReceived: this.data.billItem.accountReceivable,
        billsId: this.data.billItem.billsId,
        paymentType: this.data.pathway,
        pkId: this.data.billItem.pkId,
        receiptDate: new Date(this.data.endTime).getTime(),
        receiptNumber: this.data.receiptNumber,
        receiptRemark: this.data.receiptRemark,
        stage: this.data.billItem.stage
      }
      adminConfirmIncome(params).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: "收款成功",
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateBack({
              delta: 3
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
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