// pages/myRepairListPage/myRepairListPage.js
const app = getApp();
var utils = require('../../utils/url.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    repairList:[],
    isBack:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataSource();
  },

  //加载数据
  loadDataSource:function(){
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      method: "POST",
      url: utils.repairGetRepairListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        wx.hideLoading();
        console.log(res);
        if (res.data.code == 200) {
          if (!res.data.data) {
            return;
          }else{
            this.data.repairList = [];
            for(let i=0;i<res.data.data.length;i++){
              if (res.data.data[i].status == '正在申请' || res.data.data[i].status == '已接单' || res.data.data[i].status == '已完成'){
                this.data.repairList.push(res.data.data[i]);
              }
            }
            this.setData({
              repairList: this.data.repairList
            })
          }
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


  //查看详情
  lookDetails:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/myRepairDetailsPage/myRepairDetailsPage?repairId=' + this.data.repairList[id].repairId,
    })
  },

  //申请
  repairClick:function(){
    wx.navigateTo({
      url: '/pages/myRepairPage/myRepairPage',
    })
  },

  //取消申请
  cancelRequest:function(e){
    var id = e.currentTarget.dataset.id;
    console.log(id);
    console.log(this.data.repairList[id].repairId);
    wx.showLoading({
      title: '正在操作...',
    })
    wx.request({
      method: "POST",
      url: utils.repairRecallUrl + this.data.repairList[id].repairId,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'none',
            duration: 1000
          })
          this.data.repairList.splice(id,1);
          this.setData({
            repairList:this.data.repairList
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
    if(this.data.isBack == true){
      this.setData({
        isBack: false,
      })
      this.loadDataSource();
      wx.stopPullDownRefresh();
     
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
    this.loadDataSource();
    wx.stopPullDownRefresh();
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