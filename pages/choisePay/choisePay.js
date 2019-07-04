// pages/choisePay/choisePay.js
const app = getApp();
var utils = require('../../utils/url.js');
<<<<<<< HEAD
import { bindUserCardReSure, getDistributionByHouseId, payByBankCar, getCardPayStatus, getBindUserCardInfo}from "../../utils/url.js"
=======
import { bindUserCardReSure, getDistributionByHouseId, payByBankCar, getCardPayStatus, getBindUserCardInfo, getPayType, updateTradeResult, getMerchQr}from "../../utils/url.js"
>>>>>>> allwork

Page({

  /**
   * 页面的初始数据
   */
  data: {
    payMoney:0,//传过来的金额
    orderId:'299',
    houseId:'101',
    agent: '0',//应收的手续费费用
    payType: '1',//1公寓支付2租客支付
    psw: '123456',//密码
<<<<<<< HEAD
    type: '',//支付类型1微信2支付宝
=======
    type: 1,//支付类型
>>>>>>> allwork
    showagent:0,
    accNo:'',//卡号
    choiseCar: "../../img/my/choise_car.png",
    choiseWx: "../../img/my/choisedCar.png",
    disable:false,
<<<<<<< HEAD
    loadii:false
  },
  // 获取银行看列表
  getBindUserCardInfoo() {
=======
    payway:1,
    saomazhifu:false,//显示扫码弹框
    loadii:false,
    aliUrl: '',//支付宝支付图片位置
    wxUrl: '',//微信支付图片位置
  },
  // 获取二维码图片
  getMerchQrr(){
    let params = {
      houseId: this.data.houseId
    }
    getMerchQr(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          aliUrl: res.data.data.aliUrl,
          wxUrl: res.data.data.wxUrl
        })
      }
    })
  },
  // 保存收款图片
  savezfm(){
    wx.downloadFile({
      url: "http://www.ubicell.cn/apartment_pics/real/1777d6b189b4401a88682d7262662f56.jpg",
      success: function (res) {
        console.log(res);
        //图片保存到本地
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.showToast({
              title: '保存成功',
              icon: 'success',
              duration: 2000
            })
          },
          fail: function (err) {
            console.log(err);
            if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              console.log("当初用户拒绝，再次发起授权")
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting['scope.writePhotosAlbum']) {
                    console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                  } else {
                    console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                  }
                }
              })
            }
          },
          complete(res) {
            console.log(res);
          }
        })
      }
    })
  },
  // 查看是哪种支付方式
  getPayTypee(){
    getPayType().then(res => {
      console.log(res)
      this.setData({
        payway: res.data.data.type
      })
    })
  },
  // 获取银行看列表
  getBindUserCardInfoo() { 
>>>>>>> allwork
    getBindUserCardInfo().then(res => {
      console.log(res)
      if (res.data.code == 200) {
        if (res.data.data.length == 0){
          return
        }
        if (res.data.data[0].delStatus == 0){//是否可用
          this.setData({
            accNo: res.data.data[0].accNo.substring(res.data.data[0].accNo.length - 4)
          })
        }
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  // 选择银行卡支付
  getStatusCar(){
<<<<<<< HEAD
    this.setData({
      type:5,
      choiseCar:"../../img/my/choisedCar.png",
      choiseWx:"../../img/my/choise_car.png"
    })
=======
    if (this.data.type == 5){
      console.log(this.data.type)
      this.setData({
        type: 5
      })
    }
>>>>>>> allwork
  },
  // 微信支付
  getstatusWx(){
    this.setData({
      type:1,
<<<<<<< HEAD
      choiseWx: "../../img/my/choisedCar.png",
      choiseCar: "../../img/my/choise_car.png"
    })
  },
  
=======
    })
  },
  // 微信扫码支付
  getSaomaWx(){
    console.log("微信扫码支付")
    this.setData({
      type:7,
      saomazhifu: true
    })
    this.getMerchQrr()
  },
  // 支付宝扫码支付
  getSaomaZFB(){
    this.setData({
      type:6
    })
  },
  // 关闭扫码支付
  closeSaoma(){
    this.setData({
      saomazhifu: false
    })
  },
  //更新交易结果""icbc专用
  updateTradeResultt(orderNo){
    let params={
      houseId: this.data.houseId ,
      orderNo: orderNo ,
    }
    updateTradeResult(params).then(res => {
      console.log(res)
    })
  },
>>>>>>> allwork
  // 清分方式
  getDistributionByHouseIdd(){
    let params = {
      houseId: this.data.houseId
    }
    getDistributionByHouseId(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        let _this = this
        let obj = res.data.data.filter(function(item){
          if (item.type == 1 || item.type == 5){
            _this.setData({
              type: item.type,
              payType: item.payType,
              agent: ((Number(_this.data.payMoney) * Number(item.disRatio) / (1 - item.disRatio)) * 100).toFixed(0),
              showagent: ((Number(_this.data.payMoney) * Number(item.disRatio) / (1 - item.disRatio))).toFixed(2)
            })
          }
        })
<<<<<<< HEAD
=======
        console.log(this.data.agent, this.data.showagent)
>>>>>>> allwork
      }else{
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1000
        })
      }
    })
  },
  //支付
  payClick: function () {
    let params = {
      agent: this.data.agent,
      houseId: this.data.houseId,
      orderId: this.data.orderId,
      payType: this.data.payType,
      psw: this.data.psw,
      type: this.data.type,
    }
    this.setData({
      disable:true,
      loadii:true,
    })
    console.log(params)
    if (this.data.type == 1){
      wx.request({
        method: "POST",
        url: utils.icbcComPay,
        data: params,
        header: {
          "Authorization": app.globalData.userInfo.token,
        },
<<<<<<< HEAD
        success: res => {
          console.log(res);
          if (res.data.code == 201) {
=======
        success: ress => {
          console.log(ress);
          if (ress.data.code == 201) {
>>>>>>> allwork
            wx.showToast({
              title: '该订单已支付',
              icon: 'none',
              duration: 1000
            })
          } else {
<<<<<<< HEAD
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              success: res => {
=======
            let _this = this
            wx.requestPayment({
              timeStamp: ress.data.data.timeStamp,
              nonceStr: ress.data.data.nonceStr,
              package: ress.data.data.package,
              signType: ress.data.data.signType,
              paySign: ress.data.data.paySign,
              success: ress => {
>>>>>>> allwork
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                  duration: 1000
                })
<<<<<<< HEAD
                wx.navigateBack({
                  delta:1
=======

                wx.navigateBack({
                  delta:2
>>>>>>> allwork
                })
              },
              fail: res => {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 1000
                })
              },
            })
<<<<<<< HEAD
=======
            if (_this.data.payway == 2) {
              this.updateTradeResultt(ress.data.data.orderNo)
            }
>>>>>>> allwork
          }
        }
      })
    } else if (this.data.type == 5){
      //银行卡支付
      payByBankCar(params).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          let paa = res.data.data
          getCardPayStatus(paa).then(res => {
            console.log(res)
            wx.showToast({
              title: res.data,
              icon: 'none',
              duration: 2000
            })
            wx.navigateBack({
<<<<<<< HEAD
              delta: 1
=======
              delta: 2
>>>>>>> allwork
            })
          })
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }else{
      wx.showToast({
        title: '请先配置线上微信支付清分',
        icon: 'none',
        duration: 2000
      })
    }
    this.setData({
      disable: false,
      loadii: false,
    })
<<<<<<< HEAD
  },
  
  // 选择银行卡支付
  getStatusCar(){
    this.setData({
      type:'',
      choiseCar:"../../img/my/choisedCar.png",
      choiseWx:"../../img/my/choise_car.png"
    })
  },
  // 微信支付
  getstatusWx(){
    this.setData({
      type:1,
      choiseWx: "../../img/my/choisedCar.png",
      choiseCar: "../../img/my/choise_car.png"
    })
  },
  
  // 清分方式
  getDistributionByHouseIdd(){
    let params = {
      houseId: this.data.houseId
    }
    getDistributionByHouseId(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        this.setData({
          payType: res.data.data.payType,
          agent: Number(payMoney) * Number(res.data.data.disRatio)
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
  //支付
  payClick: function () {
    let params = {
      agent: this.data.agent,
      houseId: this.data.houseId,
      orderId: this.data.orderId,
      payType: this.data.payType,
      psw: this.data.psw,
      type: this.data.type,
    }
    console.log(this.data.type)
    if (this.data.type == 1){
      wx.request({
        method: "POST",
        url: utils.icbcComPay,
        data: params,
        header: {
          "Authorization": app.globalData.userInfo.token,
        },
        success: res => {
          console.log(res);
          if (res.data.code == 201) {
            wx.showToast({
              title: '该订单已支付',
              icon: 'none',
              duration: 1000
            })
          } else {
            wx.requestPayment({
              timeStamp: res.data.data.timeStamp,
              nonceStr: res.data.data.nonceStr,
              package: res.data.data.package,
              signType: res.data.data.signType,
              paySign: res.data.data.paySign,
              success: res => {
                wx.showToast({
                  title: '支付成功',
                  icon: 'none',
                  duration: 1000
                })
                wx.navigateBack({
                  delta:1
                })
              },
              fail: res => {
                wx.showToast({
                  title: '支付失败',
                  icon: 'none',
                  duration: 1000
                })
              },
            })
          }
        }
      })
    }else{
      //银行卡支付
      payByBankCar(params).then(res => {
        console.log(res)
        if (res.data.code == 200) {
          let paa = res.data.data
          getCardPayStatus(paa).then(res => {
            console.log(res)
            wx.showToast({
              title: res.data.data,
              icon: 'none',
              duration: 1000
            })
          })
        } else {
          wx.showToast({
            title: '支付失败',
            icon: 'none',
            duration: 1000
          })
        }
      })
    }
=======
>>>>>>> allwork
  },
  
  // // 选择银行卡支付
  // getStatusCar(){
  //   this.setData({
  //     type:'',
  //     choiseCar:"../../img/my/choisedCar.png",
  //     choiseWx:"../../img/my/choise_car.png"
  //   })
  // },
  // // 微信支付
  // getstatusWx(){
  //   this.setData({
  //     type:1,
  //     choiseWx: "../../img/my/choisedCar.png",
  //     choiseCar: "../../img/my/choise_car.png"
  //   })
  // },
  
  // //支付
  // payClick: function () {
  //   let params = {
  //     agent: this.data.agent,
  //     houseId: this.data.houseId,
  //     orderId: this.data.orderId,
  //     payType: this.data.payType,
  //     psw: this.data.psw,
  //     type: this.data.type,
  //   }
  //   console.log(this.data.type)
  //   if (this.data.type == 1){
  //     wx.request({
  //       method: "POST",
  //       url: utils.icbcComPay,
  //       data: params,
  //       header: {
  //         "Authorization": app.globalData.userInfo.token,
  //       },
  //       success: res => {
  //         console.log(res);
  //         if (res.data.code == 201) {
  //           wx.showToast({
  //             title: '该订单已支付',
  //             icon: 'none',
  //             duration: 1000
  //           })
  //         } else {
  //           wx.requestPayment({
  //             timeStamp: res.data.data.timeStamp,
  //             nonceStr: res.data.data.nonceStr,
  //             package: res.data.data.package,
  //             signType: res.data.data.signType,
  //             paySign: res.data.data.paySign,
  //             success: res => {
  //               wx.showToast({
  //                 title: '支付成功',
  //                 icon: 'none',
  //                 duration: 1000
  //               })
  //               wx.navigateBack({
  //                 delta:2
  //               })
  //             },
  //             fail: res => {
  //               wx.showToast({
  //                 title: '支付失败',
  //                 icon: 'none',
  //                 duration: 1000
  //               })
  //             },
  //           })
  //         }
  //       }
  //     })
  //   }else{
  //     //银行卡支付
  //     payByBankCar(params).then(res => {
  //       console.log(res)
  //       if (res.data.code == 200) {
  //         let paa = res.data.data
  //         getCardPayStatus(paa).then(res => {
  //           console.log(res)
  //           wx.showToast({
  //             title: res.data.data,
  //             icon: 'none',
  //             duration: 1000
  //           })
  //         })
  //       } else {
  //         wx.showToast({
  //           title: '支付失败',
  //           icon: 'none',
  //           duration: 1000
  //         })
  //       }
  //     })
  //   }
  // },
  bindingCarNext: function () {
    wx.navigateTo({ 
      url: '/pages/myBackCard1/myBackCard1'
    })
  },
  // 支付成功
  goPaySuccese: function () {
    wx.navigateTo({
      url: '/pages/choisePayS/choisePayS'
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      orderId: options.orderId,
      houseId: options.houseId,
      payMoney: options.payMoney
    })
    console.log(this.data.payMoney)
    this.getDistributionByHouseIdd()
    this.getBindUserCardInfoo()
<<<<<<< HEAD
=======
    this.getPayTypee()
>>>>>>> allwork
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