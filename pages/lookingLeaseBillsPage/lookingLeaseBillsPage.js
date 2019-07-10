// pages/lookingLeaseBillsPage/lookingLeaseBillsPage.js
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    lszdList:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataSource(options.leaseId)
  },
  // 查看账单详情
  billItemSelectClick: function (e) {
    var billItem = e.currentTarget.dataset.bill;
    billItem.receivableDateStr = billItem.receivableDate
    wx.navigateTo({
      url: '/pages/leaseBillDetail2/leaseBillDetail2?billItem=' + JSON.stringify(billItem),
    })
  },

  //加载数据
  loadDataSource: function (leaseId) {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.leaseBillsUrl + leaseId + '/1' ,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method:"POST",
      success: res => {
        if (res.data.code == 200) {
          console.log(res);
          var dada = res.data.data;
          wx.hideLoading();
          if(!dada){
            return;
          }
          for(let i = 0 ; i<dada.length;i++){
            var startPayment = util.formatTimeTwo(dada[i].startPayment / 1000, 'Y/M/D');
            var endPayment = util.formatTimeTwo(dada[i].endPayment / 1000, 'Y/M/D');
            var gmtCreate = util.formatTimeTwo(dada[i].gmtCreate / 1000, 'Y/M/D');
            dada[i].startPayment = startPayment;
            dada[i].endPayment = endPayment;
            dada[i].gmtCreate = gmtCreate;
            for (let j = 0; j < dada[i].detailVos.length;j++){
              var receiptDate = util.formatTimeTwo(dada[i].detailVos[j].receiptDate / 1000, 'Y/M/D h:m');
              dada[i].detailVos[j].receiptDate = receiptDate
            }
          }
          this.setData({
            lszdList:res.data.data
          })
        }else{
          wx.hideLoading();
          wx.showToast({
            title: '加载失败',
            icon: 'none',
            duration: 1000
          })

        }
      }
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