// pages/adminSDBonePage/adminSDBonePage.js
var util = require('../../utils/util.js');
import { handwrittenList, handwrittenGenerate} from "../../utils/url.js"
const app = getApp();
const date = new Date()
const years = []
const months = []
const days = []

for (let i = (date.getFullYear()-5); i <= (date.getFullYear()+2); i++) {
  years.push(i)
}

for (let i = 1; i <= 12; i++) {
  months.push(i)
}

for (let i = 1; i <= 31; i++) {
  days.push(i)
}
Page({
  formSubmit: function (e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
  },
  onSubmit: function (e) {
    console.log('onSubmit', e.detail.formId)
  },
  formReset: function () {
    console.log('form发生了reset事件')
  },
  /**
   * 页面的初始数据
   */
  data: {
    dataSource:[],
    billArr:[],//生成订单
    createTypeArr: [{ createType: 0, name: '跟随账期' }, { createType: 1, name: '指定支付日期' }],//账单生成方式
    text:"",
    nodata:'',
    current:1,
    createType: '',//账单生成方式:0跟随账期,1指定支付日期
    payTime: '',//账单支付时间
    chageall:false,
    devType:1,//1表示冷水表，2表示电表，4表示热水表
    years: years,
    year: date.getFullYear(),
    months: months,
    month: 1,
    days: days,
    day: 1,
    value: [9999, 1, 1],
    apartmentId:'',
    showTime:false//控制时间选择器的显示与隐藏
  },
  // 时间选择器
  bindChange: function (e) {
    const val = e.detail.value
    this.setData({
      year: this.data.years[val[0]],
      month: this.data.months[val[1]] < 10 ? "0" + this.data.months[val[1]] :this.data.months[val[1]],
      day: this.data.days[val[2]] < 10 ? "0" + this.data.days[val[2]] : this.data.days[val[2]]
    })
  },
  // 确定选择账单时间
  sureBillTime(){
    let time = this.data.year + "-" + this.data.month + "-" + this.data.day
    this.setData({
      payTime: new Date(time).getTime(),
      showTime: false
    })
    this.handwrittenGeneratee()
  },
  // 选择账单生成方式
  changecreateType(event){
    console.log(event.detail)
    if (event.detail.value == 0){
      this.setData({
        createType: this.data.createTypeArr[event.detail.value].createType,
        payTime:''
      })
      this.handwrittenGeneratee()
    }else{
      this.setData({
        createType: this.data.createTypeArr[event.detail.value].createType,
        showTime:true
      })
    }

  },
  // 获取本次度数
  getnowNum(e){
    console.log(e.detail.value)
    this.data.dataSource[e.currentTarget.dataset.index].nowNum = e.detail.value
    console.log(this.data.dataSource[e.currentTarget.dataset.index])
  },
  // 改变选择状态
  changetype(e){
    console.log(e)
    let index = e.currentTarget.dataset.index
    let type = e.currentTarget.dataset.type
    this.data.dataSource[index].type = !type
    this.setData({
      dataSource: this.data.dataSource
    })
    for (let i = 0; i < this.data.dataSource.length ; i++){
      if (this.data.dataSource[i].type){
        this.setData({
          chageall: true
        })
      }else{
        this.setData({
          chageall: false
        })
        return
      }
    }
  },
  // 全选和全不选
  changeAll(){
    if (this.data.chageall){
      this.data.dataSource = this.data.dataSource.filter(item => {
        item.type = false
      return item
      })
      this.setData({
        dataSource: this.data.dataSource,
        chageall:false
      })
    }else{
      this.data.dataSource = this.data.dataSource.filter(item => {
        item.type = true
        return item
      })
      this.setData({
        dataSource: this.data.dataSource,
        chageall: true
      })
    }
  },
  // 生成订单
  handwrittenGeneratee(){
    this.setData({
      dataSource: this.data.dataSource
    })
    let _this =this
    let obj = this.data.dataSource.filter(item => {
      if(item.type){
        let obj = {
          createType: _this.data.createType,
          payTime: _this.data.payTime,
          devType: item.devType,
          endNum: item.nowNum,
          startNum: item.lastNum,
          startTime: item.lastTime,
          houseId: item.houseId,
          leaseId: item.leaseId,
        }
        this.data.billArr.push(obj)
        return item
      }
    })
    if (this.data.billArr.length==0){
      wx.showToast({
        title: "请勾选需要提交的房间",
        icon: "none"
      })
      return
    }
    console.log(this.data.billArr)
    handwrittenGenerate(this.data.billArr).then( res => {
      console.log(res)
      if(res.data.code == 200){
        wx.showToast({
          title: '提交成功',
        })
        this.setData({
          dataSource: []
        })
        this.setData({
          billArr: []
        })
        this.handwrittenListt();
      }else{
        wx.showToast({
          title: res.data.msg,
          icon:"none"
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.name,
    }) 
    this.setData({
      apartmentId: options.apartmentId,
    })
    this.handwrittenListt();
  },
  // 水电煤手抄表列表
  handwrittenListt() {
    wx.showLoading({
      title: '正在加载...',
    })
    let params={
      apartmentId: this.data.apartmentId,
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
              item.handwritten[i].name = item.name
              item.handwritten[i].leaseId = item.leaseId
              item.handwritten[i].type = false
              item.handwritten[i].lastNum = item.handwritten[i].lastNum||""
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