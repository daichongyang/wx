// pages/myLeasePage/myLeasePage.js
const app = getApp();
var utils = require('../../utils/url.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    reservationlist: [],
    refresh:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataSource();
  },

  
  //加载数据
  loadDataSource: function () {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.leaseListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        wx.hideLoading();
        if (res.data.code == 200){
          if(!res.data.data){
            return;
          }
          this.setData({
            reservationlist:res.data.data,
            refresh:false,
          })
        }
      }
    })
  },

  //确认租约
  okMyLease:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(this.data.reservationlist[id]);
    wx.request({
      url: utils.leaseConfirmUrl + this.data.reservationlist[id].leaseId,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method:"POST",
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          this.data.reservationlist[id].status = 1;
          this.setData({
            reservationlist:this.data.reservationlist,
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
      }
    })

  },
  //点击查看详情
  reservationDetailsClick: function (e) {
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    obj.picture = decodeURIComponent(obj.picture);
    obj.picture = encodeURIComponent(obj.picture);
    console.log(obj.picture)
    var reservation = JSON.stringify(obj);
    wx.navigateTo({
      url: '/pages/myLeaseDetails/myLeaseDetails?reservation=' + reservation,
    })
  },
  //查看合同
  lookContractClick:function(e){
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    wx.navigateTo({
      url: '/pages/lookingContractPage/lookingContractPage?leaseId=' + obj.leaseId,
    })
  },
  //支付并确认
  payOkClick:function(e){
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    wx.navigateTo({
      url: '/pages/firstLeaseBillsPage/firstLeaseBillsPage?leaseId=' + obj.leaseId + '&firstPay=' + 1 + '&layout=' + obj.layout + '&rentCost=' + obj.rentCost + '&houseId=' + obj.houseId,
    })
  },

  //查看账单
  lookBillClick:function(e){
    var obj = this.data.reservationlist[e.currentTarget.dataset.id];
    wx.navigateTo({
      url: '/pages/firstLeaseBillsPage/firstLeaseBillsPage?leaseId=' + obj.leaseId + '&firstPay=' + 0 + '&layout=' + obj.layout + '&rentCost=' + obj.rentCost + '&houseId=' + obj.houseId + '&payStatus=' + obj.payStatus, 
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
    if(this.data.refresh == true){
      this.loadDataSource();
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