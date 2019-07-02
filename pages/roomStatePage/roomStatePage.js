// pages/roomStatePage/roomStatePage.js
var utils = require('../../utils/url.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xqflag:true,
    dataList:[],
    flag:true,
    id:100,
    sxArray: ["业务状态 ▾", "全部公寓 ▾","出租状态 ▾"],
    houseInfor:{},
    indexH:'',//选择的房间编号
    floorr:'',//选择的楼层
    apartmentIdd:'',//选择的公寓id
    houseLength:'',//一层楼的长度
  },
  // 点击房源显示对应数据
  getHouseInfor(obj){
    console.log(obj)
    this.setData({
      houseInfor: obj.currentTarget.dataset.house,
      floorr: obj.currentTarget.dataset.floor,
      apartmentIdd: obj.currentTarget.dataset.apartmentid,
      houseLength: obj.currentTarget.dataset.houselength,
      indexH: obj.currentTarget.dataset.indexhouse,
    })
  },


  //筛选
  sxClcik:function(e){
    console.log(e.currentTarget.dataset.id);
    if (e.currentTarget.dataset.id == this.data.id){
      this.setData({
        flag:true,
        id: 100,
        sxArray: ["业务状态 ▾", "全部公寓 ▾", "出租状态 ▾"],
      })
    }else{
      if (e.currentTarget.dataset.id == 0) {
        this.data.sxArray = ["业务状态 ▴", "全部公寓 ▾", "出租状态 ▾"];
      } else if (e.currentTarget.dataset.id == 1) {
        this.data.sxArray = ["业务状态 ▾", "全部公寓 ▴", "出租状态 ▾"];
      } else if (e.currentTarget.dataset.id == 2) {
        this.data.sxArray = ["业务状态 ▾", "全部公寓 ▾", "出租状态 ▴"];
      }
      this.setData({
        flag: false,
        id: e.currentTarget.dataset.id,
        sxArray: this.data.sxArray,
      })
    }

  },

  //关闭蒙版
  maskClick:function(){
    this.setData({
      flag:true,
      id:100,
      sxArray: ["业务状态 ▾", "全部公寓 ▾", "出租状态 ▾"],
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
      data:{},
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
         wx.hideLoading();
         this.setData({
           dataList:res.data.data,
         })
         console.log()
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