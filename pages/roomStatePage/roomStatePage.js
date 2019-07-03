// pages/roomStatePage/roomStatePage.js
var utils = require('../../utils/url.js');
import { selectApartment } from "../../utils/url.js"
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xqflag:true,
    dataList:[],
    infor:{},
    flag:true,
    id:100,
    sxArray: ["空房", "租客待登记", "欠款", "收款", "租约已到期", "租约快到期", "租客待确认", "是否有备注", "签约成功", "已预定", "是否账务未清", "装修中"],
    houseInfor:{},
    indexH:'',//选择的房间编号
    floorr:'',//选择的楼层
    apartmentIdd:'',//选择的公寓id
    houseLength:'',//一层楼的长度
    setWidth:'',
    houseItemH:'',//房间的高度
    apartmentArr:[],//公寓列表
  },
  // 公寓下拉列表
  selectApartmentt(){
    selectApartment().then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          apartmentArr:res.data.data
        })
      }
    })
  },
  // 修改公寓
  bindchangeApartment(e){
    console.log(e)
    this.data.infor.apartmentId = this.data.apartmentArr[e.detail.value].apartmentId
    this.setData({
      infor: this.data.infor,
      apartmentIdd: this.data.apartmentArr[e.detail.value].apartmentId,
    })
    this.loadDataSource()
  },
  // 修改业务状态
  bindchangesxArray(e){
    console.log(e)
    this.data.infor = {}
    if (e.detail.value == 0){
      this.data.infor.isVacant = 1
    } else if (e.detail.value == 1) {
      this.data.infor.isRegister = 1
    } else if (e.detail.value == 2) {
      this.data.infor.isArrears = 1
    } else if (e.detail.value == 3) {
      this.data.infor.isReceipt = 1
    } else if (e.detail.value == 4) {
      this.data.infor.isExpired = 1
    } else if (e.detail.value == 5) {
      this.data.infor.isMaturity = 1
    } else if (e.detail.value == 6) {
      this.data.infor.isConfirm = 1
    } else if (e.detail.value == 7) {
      this.data.infor.isRemark = 1
    } else if (e.detail.value == 8) {
      this.data.infor.isSuccess = 1
    } else if (e.detail.value == 9) {
      this.data.infor.isReserve = 1
    } else if (e.detail.value == 10) {
      this.data.infor.isUnclear = 1
    } else {
      this.data.infor.isDecoration = 1
    }
    this.data.infor.apartmentId = this.data.apartmentIdd
    this.setData({
      infor: this.data.infor,
    })
    this.loadDataSource()
  },
  // 点击房源显示对应数据
  getHouseInfor(obj){
    console.log(obj)
    if (this.data.houseInfor.houseId == obj.currentTarget.dataset.house.houseId){
      obj.currentTarget.dataset.house.houseId = -1
      this.setData({
        houseInfor: obj.currentTarget.dataset.house,
      })
      return
    }
    this.setData({
      houseInfor: obj.currentTarget.dataset.house,
      floorr: obj.currentTarget.dataset.floor,
      apartmentIdd: obj.currentTarget.dataset.apartmentid,
      houseLength: obj.currentTarget.dataset.houselength,
      indexH: obj.currentTarget.dataset.indexhouse,
    })
  },
  // 阻止事件穿透
  stopClick:function(){

  },

  //请求数据
  loadDataSource:function(){
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      method: "POST",
      url: utils.adminHouseListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: this.data.infor,
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
         wx.hideLoading();
         this.setData({
           dataList:res.data.data,
         })
         if(res.data.data.length!=0){
           let _this = this
           wx.createSelectorQuery().select('.infor_item').boundingClientRect(function (rect) {
             _this.setData({
               setWidth: rect.width
             })
           }).exec()
           wx.createSelectorQuery().select('.house_bb').boundingClientRect(function (rect) {
             _this.setData({
               houseItemW: rect.width
             })
           }).exec()
         }
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })

        }
      }
    })
  },

  

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataSource();
    this.selectApartmentt()
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