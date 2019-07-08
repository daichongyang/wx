// pages/seeLookHouse/seeLookHouse.js
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    multiArray: [[], []],
    multiIndex: [0, 0],
    time: '选择时间',
    phone: '',
    nickName: '',
    oneHouseData: {},
    comment: '',
    ydzqArray: [],
    ydzqTime:"选择时间",
    ydzqdisabled:true,
    startTime:'',
    houseId:'',
    endTime:''

  },
  //最晚签约时间
  ydzqbindchange:function(e){
    this.setData({
      ydzqTime: this.data.ydzqArray[e.detail.value],
      ydzqdisabled:false
    })

    this.selectTimeClick();
  },
  //最晚签约时间
  selectTimeClickTwo:function(){
    var arr = [];
    var timestamp = Date.parse(new Date()) / 1000;
    for (let i = 0; i < 7; i++) {
      var appointmentTimeDate = util.formatTimeTwo(timestamp + i * 3600 * 24, 'Y-M-D');
      arr[i] = appointmentTimeDate;
    }
    this.setData({
      ydzqArray: arr
    })
  },
  //约定租期选择时间
  selectTimeClick: function (e) {
    if (this.data.ydzqTime == "选择时间") {
      wx.showToast({
        title: '请先选择最晚签约时间',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    console.log(e);
    var arr1 = [];
    arr1.push(this.data.ydzqTime);
    var arrEndTime = [];
    for(let i = 0;i<7;i++){
      var arr2 = this.data.ydzqTime.split("-");
      var y = parseInt(arr2[0]);
      var m = parseInt(arr2[1]) + 6 + i;
      var d = parseInt(arr2[2]);
      var mStr;
      if (m < 10) {
        mStr = "0" + String(m);
      } else if (m <= 12 && m >= 10) {
        mStr = String(m);
      } else if (m > 12) {
        y += 1;
        m = m - 12;
        if (m < 10) {
          mStr = "0" + String(m);
        }
      }
      if(d < 10){
        d = '0'+d;
      }
      arrEndTime[i] = String(y) + '-' + mStr + '-' + String(d);
    }
    this.setData({
      multiArray: [arr1, arrEndTime],
    })
  },
  //约定租期选择时间选择时间某一列改变触发时间
  bindcolumnchange: function (e) {
    console.log(e);

  },
  //约定租期选择时间然后确定
  bindchange: function (e) {
    console.log(e.detail.value);
    var arr1 = this.data.multiArray[0];
    var arr2 = this.data.multiArray[1];
    this.setData({
      time: arr1[0] + "至" + arr2[e.detail.value[1]],
      startTime:arr1[0] + ' ' + '00:00:00',
      endTime: arr2[e.detail.value[1]] + ' ' + '00:00:00',
    })
  },

  //获取联系人信息
  getNicenameValue: function (e) {
    this.setData({
      nickName: e.detail.value
    })
  },
  //获取联系人手机号码
  getPhoneValue: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },
  //获取用户留言
  getCommentValue: function (e) {
    console.log(e);
    this.setData({
      comment: e.detail.value
    })
  },
  // 支付页面
  gochoisePay(orderId) {
    let payMoney = Number(this.data.oneHouseData.advanceCost)
    wx.navigateTo({
      url: '/pages/choisePay/choisePay?orderId=' + orderId + '&houseId=' + this.data.oneHouseData.houseId + '&payMoney=' + payMoney
    })
  },
  //点击预定按钮
  yyAction: function () {
    let _this = this
    var myreg = /^(14[0-9]|13[0-9]|15[0-9]|17[0-9]|18[0-9])\d{8}$$/;
    if (this.data.ydzqTime == "选择时间") {
      wx.showToast({
        title: '请选择最晚签约时间',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (this.data.time == "选择时间") {
      wx.showToast({
        title: '请选择租期时间',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    if (this.data.nickName == '') {
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
    if (!myreg.test(this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none',
        duration: 1500
      })
      return;
    }
    console.log(this.data.oneHouseData.advanceCost);
    // console.log(this);
    // console.log(this.data.houseId);
    if (this.data.oneHouseData.advanceCost == 0){
      wx.showToast({
        title: '定金不能为0元',
        icon: 'none',
        duration: 1000
      })
    }
    var timestamp = Date.parse(new Date()) / 1000;
    var appointmentTimeDate = util.formatTimeTwo(timestamp, 'Y-M-D h:m:s');
    console.log(appointmentTimeDate);
    wx.request({
      url: utils.advanceorderSaveUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method: "POST",
      data: {
        advanceCost: this.data.oneHouseData.advanceCost,
        latestTime: this.data.ydzqTime + ' ' + '00:00:00',
        startTime: this.data.startTime,
        endTime: this.data.endTime,
        remark: this.data.comment,
        houseId: this.data.oneHouseData.houseId,
        promiseMan: this.data.nickName,
        phone: this.data.phone,
        gmtCreate: appointmentTimeDate,
        rentCost: this.data.oneHouseData.rentCost,
        payStatus: 0
      },
      success: function (res) {
        console.log(res);
        // console.log(_this)
        if (res.data.code == 200) {
          _this.gochoisePay(res.data.data)
          // wx.request({
          //   method: "POST",
          //   url: utils.icbcComPay + res.data.data + '/' + _this.data.oneHouseData.houseId,
          //   header: {
          //     "Authorization": app.globalData.userInfo.token,
          //   },
          //   success: res => {
          //     if (res.data.code == 200) {
          //       wx.requestPayment({
          //         timeStamp: res.data.data.timeStamp,
          //         nonceStr: res.data.data.nonceStr,
          //         package: res.data.data.package,
          //         signType: res.data.data.signType,
          //         paySign: res.data.data.paySign,
          //         success: res => {
          //           wx.showToast({
          //             title: '支付成功',
          //             icon: 'none',
          //             duration: 2000
          //           })
          //           wx.navigateBack({
          //             detail: 1
          //           })
          //         },
          //         fail: function (res) {
          //           wx.navigateBack({
          //             detail: 1
          //           })
          //         }
          //       })

          //     }else{
          //       wx.showToast({
          //         title: res.data.msg,
          //         icon: 'none',
          //         duration: 2000
          //       })
          //     }
          //   }
          // })
        
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
    console.log(options.houseId + "房间Id")
    this.setData({
      houseId: options.houseId
    })
    
    wx.request({
      url: utils.houseOneUrl + options.houseId,
      success: res => {
        console.log(res);
        this.setData({
          oneHouseData: res.data.data,
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
    //最晚签约时间时间初始化
    var arr = [];
    var timestamp = Date.parse(new Date()) / 1000;
    for (let i = 0; i < 7; i++) {
      var appointmentTimeDate = util.formatTimeTwo(timestamp + i * 3600 * 24, 'Y-M-D');
      arr[i] = appointmentTimeDate;
    }
    console.log(arr);
    this.setData({
      ydzqArray: arr
    })
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