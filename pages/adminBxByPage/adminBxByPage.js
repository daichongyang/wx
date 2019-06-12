// pages/adminBxByPage/adminBxByPage.js
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showTitel: '',
    noShowTitel: '',
    show: false,
    current: 1,
    adminReservationList: [],

    houseList: [],
    multiArray: [[]],
    multiIndex: [0],
    title: "",
    index: 0,
  },

  //预约加载更多
  loadMoreClick: function (current) {
    this.data.current += 1;
    this.setData({
      current: this.data.current,
    })
    this.loadDataSourceReservationList(this.data.current);
  },

  //请求数据
  loadDataSource: function () {
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      method: "POST",
      url: utils.adminSelectUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          if (!res.data.data.length) {
            return;
          }

          for (let i = 0; i < res.data.data.length; i++) {
            var title = res.data.data[i].name;
            this.data.multiArray[0].push(title);
          }
          this.setData({
            houseList: res.data.data,
            title: res.data.data[0].name +' '+ '▾',
            multiArray: this.data.multiArray,
            index: res.data.data[0].apartmentId,
          })

          //获取记录
          this.loadDataSourceReservationList(this.data.current,res.data.data[0].apartmentId);
        }
      }
    })
  },



  //选择房间完成
  bindchange: function (e) {
    var id = e.detail.value[0];
    console.log(id);
    this.setData({
      title: this.data.multiArray[0][id] + ' ' + '▾',
      current:1,
      index: this.data.houseList[id].apartmentId,
      adminReservationList:[],
    })
    this.loadDataSourceReservationList(this.data.current,this.data.houseList[id].apartmentId);
  },


  //请求数据预约数据
  loadDataSourceReservationList: function (current,xqid) {
    console.log(current,xqid);
    wx.showLoading({
      title: '正在加载',
    })
    wx.request({
      method: "POST",
      url: utils.adminPropertyGetRepairListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        total: current,
        size: 10,
        xqId: xqid,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.hideLoading();
          for (let i = 0; i < res.data.data.records.length; i++) {
            var obj = res.data.data.records[i];
            if (obj.status == 0){
              obj.status = '正在申请';
            } else if (obj.status == 1){
              obj.status = '已接单';
            } else if (obj.status == 2) {
              obj.status = '已完成';
            } else if (obj.status == 3) {
              obj.status = '已取消';
            } else if (obj.status == 4) {
              obj.status = '投诉';
            }
            this.data.adminReservationList.push(obj);
          }
          if (res.data.data.total > this.data.current) {
            this.setData({
              adminReservationList: this.data.adminReservationList,
              show: true,
              current: current,
              showTitel: "点击加载更多..."
            })
          } else {
            this.setData({
              adminReservationList: this.data.adminReservationList,
              show: false,
              noShowTitel: '数据已全部加载完毕'
            })
          }

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })

        }
      }
    })
  },


  //报修保养详情
  bxbyClick: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    console.log(this.data.adminReservationList[id]);
    wx.navigateTo({
      url: '/pages/myRepairDetailsPage/myRepairDetailsPage?repairId=' + this.data.adminReservationList[id].id,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    //公寓列表
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