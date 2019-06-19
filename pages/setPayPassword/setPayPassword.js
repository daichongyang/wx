// pages/setPayPassword/setPayPassword.js
import { setCardPassWord} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isNoPass: 1,//是否免密支付0是1否
    psw: '', //支付密码
    psw1:'',//第一次输入密码
  },
  // 第一次输入密码
  getpsw1(e){
    this.setData({
      psw1: e.detail.value,
    })
  },
<<<<<<< HEAD
  // 提交数据
  setCardPassWordd(){
=======
  getpsw2(e){
    this.setData({
      psw: e.detail.value,
    })
  },
  // 提交数据
  setCardPassWordd(){
    if(this.data.psw != this.data.psw1){
      wx.showToast({
        title: '两次输入的密码不一致，请重新输入',
        icon: 'none',
        duration: 1000
      })
    }
>>>>>>> allwork
    let parms = {
      isNoPass: this.data.isNoPass,
      psw: this.data.psw
    }
    setCardPassWord(parms).then(res => {
      console.log(res)
      if(res.data.code == 200){
        wx.showToast({
          title: '设置成功',
          icon: 'none',
          duration: 1000
        })
        setTimeout(()=>{
          wx.navigateBack({
            delta: 1
          })
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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