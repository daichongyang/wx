// pages/seeLookHouse/seeLookHouse.js
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    arrHour:['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
    lookType:'现场看房',
    multiArray: [[], [], []],
    multiIndex: [0, 0, 0],
    time:'选择看房时间',
    phone: '',
    nickName:'',
    oneHouseData:{},
    comment:'',
    index:0,
  },
 //选择看房时间
  selectTimeClick:function(e){
    console.log("================");
    var arr1 = [];
    var arr2 = [];
    var arr3 = ["00","30"];
    var timestamp = Date.parse(new Date()) / 1000;
    for(let i = 0; i<7;i++){
      var appointmentTimeDate = util.formatTimeTwo(timestamp + i*3600*24, 'Y-M-D');
      arr1[i] = appointmentTimeDate;
    }
    if(this.data.index == 0){
      var appointmentTimeHours = util.formatTimeTwo(timestamp, 'h');
      var intHours = parseInt(appointmentTimeHours);
      for (let i = (intHours + 1); i < 23; i++) {
        var appointmentTimeHours = util.formatTimeTwo(timestamp + (i - intHours + 1) * 3600, 'h');
        arr2[i - intHours - 1] = appointmentTimeHours;
      }
    }else{
     arr2 = this.data.arrHour;
    }
    this.setData({
      multiArray:[arr1,arr2,arr3],
    })
  },
  //选择时间某一列改变触发时间
  bindcolumnchange:function(e){
    console.log(e);
    if (e.detail.column == 0 && e.detail.value > 0){
      var arr = this.data.arrHour;
      var arrTime = this.data.multiArray;
      arrTime[1] = arr;
      this.setData({
        multiArray:arrTime,
        index: e.detail.value,
      })
    } else if (e.detail.column == 0 && e.detail.value == 0){
      var arr = [];
      var timestamp = Date.parse(new Date()) / 1000;
      var appointmentTimeHours = util.formatTimeTwo(timestamp, 'h');
      var intHours = parseInt(appointmentTimeHours);
      for (let i = (intHours + 1); i < 23; i++) {
        var appointmentTimeHours = util.formatTimeTwo(timestamp + (i - intHours + 1) * 3600, 'h');
        arr[i - intHours - 1] = appointmentTimeHours;
      }
      var arrTime = this.data.multiArray;
      arrTime[1] = arr;
      this.setData({
        multiArray: arrTime,
        index: e.detail.value,
      })
    }
  },
  //选择时间
  bindchange:function(e){
    console.log(e.detail);
    var arr1 = this.data.multiArray[0];
    var arr2 = this.data.multiArray[1];
    var arr3 = this.data.multiArray[2];
    var hour = arr2[e.detail.value[1]];
    console.log(hour);
    if (0 <= parseInt(hour) &&  parseInt(hour) <=9){
      hour = '0' + hour;
    }
    this.setData({
      time: arr1[e.detail.value[0]] + " " + hour + ":" + arr3[e.detail.value[2]]
    })
  },

  //看房方式
  lookTypeClick:function(){
    wx.showActionSheet({
      itemList: ['现场看房'],
      success:res =>{
        var lookType = '现场看房';
        console.log(res);
        if (res.tapIndex == 0){
          lookType = '现场看房';
        }else if(res.tapIndex == 1){
          lookType = '音视频看房';
        }
        this.setData({
          lookType:lookType,
        })
      }
    })
  },
  //获取联系人信息
  getNicenameValue:function(e){
    this.setData({
      nickName: e.detail.value
    })
  },
  //获取联系人手机号码
  getPhoneValue:function(e){
    this.setData({
      phone: e.detail.value
    })
  },
  //获取用户留言
  getCommentValue:function(e){
    console.log(e);
    this.setData({
      comment: e.detail.value
    })
  },
  //点击预约按钮
  yyAction:function(){
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.time == "选择看房时间"){
      wx.showToast({
        title: '请选择看房时间',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (this.data.nickName == ''){
      wx.showToast({
        title: '请填写联系人',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (this.data.phone == '') {
      wx.showToast({
        title: '请填写联系人手机号码',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if(!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    var timestamp = Date.parse(new Date()) / 1000;
    var appointmentTimeDate = util.formatTimeTwo(timestamp, 'Y-M-D h:m:s');
    console.log(appointmentTimeDate);
    console.log(this.data.time + ':00');
    wx.request({
      url: utils.reservationSaveUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method:"POST",
      data:{
        appointmentTime:this.data.time + ':00',
        appointmentType:0,
        comment:this.data.comment,
        houseId:this.data.oneHouseData.houseId,
        linkman:this.data.nickName,
        phone:this.data.phone,
        gmtCreate: appointmentTimeDate
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 200){
          wx.showToast({
            title: '预约成功',
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateBack({
            })
            //要延时执行的代码
          }, 1500) //延迟时间
        }
      }
    })
   

  }, 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    wx.request({
      url: utils.houseOneUrl + options.houseId,
      success:res => {
        console.log(res);
        this.setData({
          oneHouseData:res.data.data,
          phone: app.globalData.userInfo.phone,
          nickName: app.globalData.userInfo.nickName,
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
    this.selectTimeClick();
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