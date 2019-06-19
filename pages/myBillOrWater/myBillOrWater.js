// pages/myBillOrWater/myBillOrWater.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelectBillView: true,
    billData: {
      billCategory: ["账单类型", "账单项目", "收款类型", "全部房源"],
      totalPrice: 352124.88,
      totalNum: 211,
      receivePrice: 250104.00,
      receiveNum: 161,
      insteadPrice: 102020.88,
      insteadNum: 50,
      list: [{
        houseName: "宝宝在线公寓-3层302（朝南方向）",
        stats: "未收款",
        type: "房屋租金",
        price: 101.45,
        time: "2018.05.26-2019.03.24"
      },
      {
        houseName: "宝宝在线公寓-3层302（朝南方向）",
        stats: "未收款",
        type: "水费",
        price: 101.45,
        time: "2018.05.26-2019.03.24"
      },
      {
        houseName: "宝宝在线公寓-3层302（朝南方向）",
        stats: "已收款",
        type: "电费",
        price: 101.45,
        time: "2018.05.26-2019.03.24"
      }]
    },
    waterData: {
      waterCategory: ["全部", "交易类型", "全部房源"],
      totalPrice: 352124.88,
      totalNum: 211,
      inPrice: 250104.00,
      inNum: 161,
      outPrice: 102020.88,
      outNum: 50,
      list: [{
        houseName: "宝宝在线公寓-3层302（朝南方向）",
        title: "房屋租金",
        type: 1,
        price: 101.45,
        time: "2018.05.26"
      },
      {
        houseName: "宝宝在线公寓-3层302（朝南方向）",
        title: "管理费",
        type: 1,
        price: 101.45,
        time: "2018.05.26"
      },
      {
        houseName: "宝宝在线公寓-3层302（朝南方向）",
        title: "扣除服务费",
        type: 0,
        price: 101.45,
        time: "2018.05.26"
      }]
    }
  },

  // 选择账单列表/交易流水
  changeSelectState: function (e) {
    var title = e.currentTarget.dataset.title;
    if (title == "bill") {
      this.setData({
        isSelectBillView: true
      })  
    } else {
      this.setData({
        isSelectBillView: false
      })
    }
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