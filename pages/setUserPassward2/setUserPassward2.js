// pages/setUserPassward2/setUserPassward2.js
import { updateLockPassWordByPhone} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 接受内部参数
    optionss:[],
    index: '',
    array: ['美国', '中国', '巴西', '日本'],
    houseId:'',
    passWordNew:'',
    passWordOld:'',
  },
// 获取提交数据信息
  getpassWordNew(e){
    this.setData({
      passWordNew:e.detail.value
    })
  },
  getpassWordOld(e){
    this.setData({
      passWordOld:e.detail.value
    })
  },
  
  bindPickerChange(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      houseId: this.data.optionss[e.detail.value].houseId,
      index: e.detail.value,
    })
  },
  // 提交信息
  updateLockPassWordByPhonee(){
    if (this.data.passWordNew != this.data.passWordOld){
      wx.showToast({
        title: '两次输入密码不一致',
        duration: 2000,
        icon: "none"
      })
      return
    }
    let params = {
      houseId: this.data.houseId,
      passWordNew: this.data.passWordNew,
    }
    updateLockPassWordByPhone(params).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        wx.showToast({
          title: '修改成功',
          duration: 2000,
          icon: "none"
        })
        
        setTimeout(function(){
          wx.navigateBack({
            delta: 2
          })
        },1500)
      }else{
        wx.showToast({
          title: res.data.msg,
          duration: 2000,
          icon: "none"
        })
      }
    }).catch(err => {
      wx.showToast({
        title: '请求失败',
        duration: 2000,
        icon: "none"
      })
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      optionss: JSON.parse(options.paramss)||[]
    })
    console.log(this.data.optionss)
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