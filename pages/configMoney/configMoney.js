// pages/configMoney/configMoney.js

import { selectApartment, configMeterList, configMeterUpdate} from "../../utils/url.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    apartmentList:[],
    inforList:[],//配置回显
    apartmentName:'',
    apartmentId:''
  },
  // 监听输入
  bindinput(e){
    console.log(e)
    this.data.inforList[e.currentTarget.dataset.index].unitPrice = e.detail.value
  },
  // 保存修改
  saveChange(){
    let params = []
    let arr = this.data.inforList.filter(item=>{
      let obj = {
        apartmentMeterId: item.apartmentMeterId,
        unitPrice: item.unitPrice,
        useAble: 1,
      }
      params.push(obj)
    })
    configMeterUpdate(params).then(res=>{
      console.log(res)
      if(res.data.code == 200){
        this.changePz()
      }
    })
  },
  //查看房间的配置
  changePz(){
    let apartmentId = this.data.apartmentId
    configMeterList(apartmentId).then(res=>{
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          inforList: res.data.data
        })
      }
    })
  },
  // 改变房间
  configMeterListt(event){
    this.setData({
      apartmentId: this.data.apartmentList[event.detail.value].apartmentId,
      apartmentName: this.data.apartmentList[event.detail.value].name,
    })
    this.changePz()
  },
  // 获取公寓下拉列表
  selectApartmentt() {
    selectApartment().then(res => {
      console.log(res)
      if (res.data.code == 200) {
        if (res.data.data.length != 0){
          this.setData({
            apartmentList: res.data.data,
            apartmentName: res.data.data[0].name,
            apartmentId: res.data.data[0].apartmentId,
          })
          //查看房间的配置
          configMeterList(res.data.data[0].apartmentId).then(res => {
            console.log(res)
            if (res.data.code == 200) {
              this.setData({
                inforList: res.data.data
              })
            }
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    }).catch(err => {
      wx.showToast({
        title: "网络请求失败",
        icon: 'none',
        duration: 1500
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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