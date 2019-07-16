// pages/mjPassPage/mjPassPage.js
const app = getApp();
var utils = require('../../utils/url.js');
var drawQrcode = require('../../utils/weapp.qrcode.js');
import { getShowPassWord} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    windowHeight:0,
    windowWidth:0,
    index:0,
    houseList:[],
    multiArray:[[]],
    multiIndex:[0],
    title:"",
    doorList:[],
    qrCodeString:"",
    qrCodeIndex:0,
    password:'',
    houseId:'',
    cantrolPass:false,//控制查看密码
  },
  //入户密码修改
  goSetUserPassward: function () {
    wx.navigateTo({
      url: '/pages/setUserPassward/setUserPassward'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: res => {
        console.log(res);
        var windowWidth = res.windowWidth;
        var windowHeight = res.windowHeight - 95;
        this.setData({
          windowWidth: windowWidth,
          windowHeight: windowHeight,
        })
      },
    })
  },
  // 改变密码显示
  cantrolPasss(){
    this.setData({
      cantrolPass: !this.data.cantrolPass
    })
  },
// 获取密码
  getShowPassWordd(){
    let houseId = this.data.houseId
    getShowPassWord(houseId).then(res => {
      console.log(res)
      if(res.data.code ==200){
        this.setData({
          password:res.data.data.split('')
        })
      }else{
        this.setData({
          password:''
        })
      }
    })
  },
  //房间列表
  loadDataSource:function(){
    wx.request({
      method: "POST",
      url: utils.hydroelectricGetControlDevUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          if (!res.data.data.length) {
            return;
          }
        
          for(let i=0;i<res.data.data.length;i++){
            var title = res.data.data[i].gyName + res.data.data[i].houseName;
            this.data.multiArray[0].push(title);
          }
          this.setData({
            houseList: res.data.data,
            doorList: res.data.data[0].doorEntities,
            houseId: res.data.data[0].houseId,
            title: res.data.data[0].gyName + res.data.data[0].houseName,
            multiArray:this.data.multiArray,
          })

          //获取初始化二维码
          this.loadQrcodeStringSource(res.data.data[0].houseId);
          // 锁密码
          this.getShowPassWordd()
        }
      }
    })
  },

  //获取二维码数据
  loadQrcodeStringSource: function (houseId){
    wx.request({
      method: "POST",
      url: utils.hydroelectricGetQrCodeDataUrl + houseId,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200){
         this.setData({
           qrCodeString:res.data.data,
         })
        drawQrcode({
          width: 200, //二维码宽高,宽高要与canvas标签宽高一致
          height: 200,
          canvasId: 'myQrcode',
          text: this.data.qrCodeString //二维码内容
        })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
          this.setData({
            qrCodeString:'',
          })
        }
      }
    })
  },

  //刷新二维码通行证
  refreshQrcodeClick:function(){
    this.loadQrcodeStringSource(this.data.houseList[this.data.qrCodeIndex].houseId);
  },

  //选择房间
  selcetdHouseClick:function(e){
   console.log(e);
  },
  //选择房间完成
  bindchange:function(e){
    console.log(e)
    console.log(this.data.multiArray)
    var id = e.detail.value[0];
    console.log(id);
    this.setData({
      title:this.data.multiArray[0][id],
      houseId: this.data.houseList[id].houseId,
      doorList: this.data.houseList[id].doorEntities,
      qrCodeIndex:id,
    })
    this.loadQrcodeStringSource(this.data.houseList[id].houseId);
    this.getShowPassWordd()
  },

  //远程开门
  openDoorClick:function(e){
    var id = e.currentTarget.dataset.id;
    wx.request({
     method: "POST",
      url: utils.hydroelectricOpenDoorUrl,
     header: {
       "Authorization": app.globalData.userInfo.token,
     },
     data:{
       doorkeySign:this.data.doorList[id].doorkeySign,
       gyId: this.data.doorList[id].gyId,
       name: this.data.doorList[id].name,
       type: this.data.doorList[id].type,
     },
     success:res =>{
       console.log(res);
       if (res.data.code == 200){
         wx.showToast({
           title: this.data.doorList[id].name + res.data.msg,
           icon: 'none',
           duration: 1500
         })
       }else{
         wx.showToast({
           title: this.data.doorList[id].name + res.data.msg,
           icon: 'none',
           duration: 1500
         })
       }
     }
    })
  },
  
  //左按钮
  leftClick:function(){
    this.setData({
      index:0,
    })
  },
  //右按钮
  rightClick: function () {
    this.setData({
      index: 1,
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
    //请求原始数据
    this.loadDataSource();
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