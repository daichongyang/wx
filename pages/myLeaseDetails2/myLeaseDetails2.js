// pages/myLeaseDetails/myLeaseDetails.js
//加载外部实例
const app = getApp();
import { leaseDetaill, customerName} from "../../utils/url.js"
import { getDateArray } from "../../utils/myDate.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    houseId:'',
    leaseId:'',
    name:'',
    leaseDetail: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      houseId: options.houseId,
      leaseId: options.leaseId,
    })
    this.leaseDetailll(options.leaseId);
    this.getcustomerName(options.houseId);
  },
  getcustomerName(houseId){//获取房东名称
    // let houseId = houseId
    customerName(houseId).then(res=>{
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          name:res.data.data
        })
      }
    })
  },
  // 租约详情
  leaseDetailll(leaseId){
    // let leaseId = leaseId
    leaseDetaill(leaseId).then(res =>{
      console.log(res)
      if(res.data.code ==200){
        this.data.leaseDetail=res.data.data
        if(this.data.leaseDetail.status==0){
          this.data.leaseDetail.statusName='待确认'
        }else if(this.data.leaseDetail.status==1){
          this.data.leaseDetail.statusName='签约成功 '
        }else{
          this.data.leaseDetail.statusName='退房'
        }
        if (this.data.leaseDetail.pictures){
          this.data.leaseDetail.firstPictures = this.data.leaseDetail.pictures[0]
        }
        let _this= this
        this.data.leaseDetail.tenantList=this.data.leaseDetail.tenantList.filter(function(item){
          if (item.isLease == 1){
            if (item.sex === 0) {
              _this.data.leaseDetail.sexName = '男'
            } else {
              _this.data.leaseDetail.sexName = '女'
            }
          }
          return item
        })
        this.data.leaseDetail.startTime=getDateArray(this.data.leaseDetail.startTime)[14]
        this.data.leaseDetail.nextDate = getDateArray(this.data.leaseDetail.nextDate)[14]
        this.data.leaseDetail.endTime=getDateArray(this.data.leaseDetail.endTime)[14]
        this.data.leaseDetail.signList.signTime=getDateArray(this.data.leaseDetail.signList.signTime)[14]
        this.setData({
          leaseDetail: res.data.data
        })
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //打电话
  callPhone: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.leaseDetail.phone,
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