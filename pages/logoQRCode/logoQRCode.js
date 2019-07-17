
const app = getApp();
var { wNativePay, updateOfflineTradeResult } = require('../../utils/url.js');
var QRCodeJS = require("../../utils/qrcode.js");

Page({
  data:{
    moneyTotal:0,
    showagent:0,
    payType: 1,//1公寓支付2租客支付
    queryDetail:"加油！！！"
  },
  goLogoQRCode2(){
    wx.navigateTo({
      url: '/pages/logoQRCode2/logoQRCode2',
    })
  },
  // 更新线下交易结果
  updateOfflineTradeResultt(orderNo) {
    let pparams = {
      houseId: this.data.houseId,
      orderNo: orderNo
    }
    console.log(pparams)
    updateOfflineTradeResult(pparams).then(res => {
      console.log(res)
    })
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      moneyTotal: options.moneyTotal,
      showagent: options.showagent,
      payType: options.payType,
      houseId: options.houseId,
    })
    let obj = JSON.parse(options.params)
    console.log(obj)
    wNativePay(obj).then(ress => {// 微信扫码支付
      console.log(ress)
      if (ress.data.code == 200) {
        this.data.queryDetail = ress.data.data.codeUrl
        console.log(this.data.queryDetail)
        this.updateOfflineTradeResultt(ress.data.data.orderNo)
        let _this =this
        QRCodeJS.qrApi.draw(_this.data.queryDetail, "logoQRCode", 248, 248, null, app.globalData.userInfo.headImg);
      } else {
        wx.showToast({
          title: ress.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })

    // QRCodeJS.qrApi.draw('https://www.ubicell.cn:8443/pages/homePage/homePage', "logoQRCode", 248, 248, null, app.globalData.userInfo.headImg);

    /**
    * 绘制带logo二维码
    * @param url        二维码字符串 如 https://github.com/xlsn0w
    * @param canvas-id  画布ID 如 logoQRCode
    * @param width      二维码宽度 如 275
    * @param height     二维码高度 如 275
    * @param logo       二维码logo 如 /images/xlsn0w.png
    */

  }

})
