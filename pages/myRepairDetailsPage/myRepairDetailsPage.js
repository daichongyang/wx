// pages/myRepairDetailsPage/myRepairDetailsPage.js
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    repairGetDetail:{},
    imageList:[],
    pay_status:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.repairId);
    //加载维修单详情
    this.loadrepairGetDetailDataSource(options.repairId);
  },

  //获取维修单详情
  loadrepairGetDetailDataSource: function (repairId){
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      method: "POST",
      url: utils.repairGetDetailUrl + repairId,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        if (res.data.code == 200) {
          if (!res.data.data) {
            return;
          } else {
            var appointmentTimeDate = util.formatTimeTwo(res.data.data.appointmentTime / 1000, 'Y-M-D h:m:s');
            res.data.data.appointmentTime = appointmentTimeDate;
            var createTime = util.formatTimeTwo(res.data.data.createTime / 1000, 'Y-M-D h:m:s');
            res.data.data.createTime = createTime;
            if (!res.data.data.receivingName){
              res.data.data.receivingName = '';
            }
            if (res.data.data.pay_status == 0){
              this.data.pay_status = '未支付';
              res.data.data.cost = res.data.data.cost;
            }else{
              this.data.pay_status = '已支付';
              res.data.data.cost = res.data.data.cost;
            }
            if (res.data.data.status == 0){
              res.data.data.cost = '待定';
            }
            var picture = res.data.data.picture;
            var imageList = [];
            if(picture.length > 0){
              imageList = picture.split(',');
              console.log(imageList);
            }
            this.setData({
              repairGetDetail: res.data.data,
              imageList:imageList,
              pay_status:this.data.pay_status
            })
          }
        }
      }
    })

  },


  //打电话
  callPhoneClick:function(){
    if (!this.data.repairGetDetail.callMaster){
      wx.showToast({
        title: "号码为空",
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.makePhoneCall({
      phoneNumber: this.data.repairGetDetail.callMaster,
    })
  },

  //点击预览大图片
  previewlmg: function (e) {
    console.log(e.currentTarget.dataset.id);
    var imgIdx = e.currentTarget.dataset.id;
    var imgs = this.data.imageList;
    wx.previewImage({
      current: imgs[imgIdx],
      urls: imgs,
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