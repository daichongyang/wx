
const app = getApp();
var { wNativePay } = require('../../utils/url.js');
var QRCodeJS = require("../../utils/qrcode.js");

Page({
  goLogoQRCode2(){
    wx.navigateTo({
      url: '/pages/logoQRCode2/logoQRCode2',
    })
  },
  onLoad: function (options) {
    let params = {
      orderId: 279,
      payType: 1,
    }
    // 二维码支付
    wNativePay(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        let text = res.data.data.codeUrl
        QRCodeJS.qrApi.draw(text, "logoQRCode", 248, 248, null, app.globalData.userInfo.headImg);
      }
    }).catch(res => {
      wx.showToast({
        title: '请求失败',
        icon: 'none',
        duration: 2000
      })
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
