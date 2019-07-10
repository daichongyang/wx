// pages/adminSDBonePage/adminSDBonePage.js
var util = require('../../utils/util.js');
import { handwrittenList, handwrittenGenerate} from "../../utils/url.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataSource:[],
    text:"   ",
    nodata:'',
    current:1,
    devType:1,//1表示冷水表，2表示电表，4表示热水表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    }) 
    this.handwrittenListt(options.apartmentId);
  },
  // 水电煤手抄表列表
  handwrittenListt(apartmentId) {
    wx.showLoading({
      title: '正在加载...',
    })
    let params={
      apartmentId:apartmentId,
      current: this.data.current,
      size:10
    }
    handwrittenList(params).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.hideLoading();
        if (!res.data.data.records.length) {
          this.setData({
            nodata: '暂无数据...',
          })
          return;
        }
        // 赛选需要的表类型
        let _this = this
        let arr = res.data.data.records.filter(item => {
          for (let i = 0; i < item.handwritten.length; i++){
            if (item.handwritten[i].devType == _this.data.devType){
              this.data.dataSource.push(item.handwritten[i])
            }
          }
        })
        
        this.setData({
          dataSource: this.data.dataSource,
        })
        console.log(this.data.dataSource)
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
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