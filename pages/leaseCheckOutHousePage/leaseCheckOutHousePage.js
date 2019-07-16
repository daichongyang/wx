// pages/leaseCheckOutHousePage/leaseCheckOutHousePage.js
import {
  adminCheckOutHouseClose,
  adminCheckOutHouseData,
  adminCheckOutSelectData
} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paymentArray: ["线上", "现金", "支付宝转账", "微信转账", "对公银行转账", "其他", "对私银行转账"],
    paymentStr: "银行卡/支付宝/微信转账",
    leaseId: 0,
    refundArray: [], // 退款数据
    refundSelectArray: [],
    arrearsArray: [], // 欠款数据
    deductionArray: [], // 扣款数据
    deductionSelectArray: [],
    returnCause: "", // 原因
    badDebtCost: 0, // 坏账数据
    returenCost: 0, // 退款总账
    deductionCost: 0, // 扣款总账
    remark: "", // 备注
    pathway: -1, // 付款方式
    isDisabled: false 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      leaseId: options.leaseId
    })
    this.getCheckOutHouseData();
    this.getRefundSelectDate();
    this.getDeductionSelectDate();
  },

  getCheckOutHouseData: function () {
    let params = {
      leaseId: this.data.leaseId
    }
    adminCheckOutHouseData(params).then(res => {
      if (res.data.code == 200) {
        var refundArray = [];
        var arrearsArray = [];
        var deductionArray = [];
        res.data.data.costVos.map(item => {
          if (item.refundStatus == 0) {
            refundArray.push(item);
          } else if (item.refundStatus == 1) {
            deductionArray.push(item);
          } else {
            arrearsArray.push(item);
          }
        })
        this.setData({
          returenCost: -res.data.data.returenCost,
          badDebtCost: res.data.data.badDebtCost,
          refundArray: refundArray,
          arrearsArray: arrearsArray,
          deductionArray: deductionArray
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  // 计算最终数据
  statisticalFinalData: function () {
    var returenCost = 0;
    var deductionCost = 0;
    this.data.refundArray.map(item => {
      returenCost += parseFloat(item.cost);
    })
    this.data.deductionArray.map(item => {
      deductionCost += parseFloat(item.cost);
    })
    returenCost -= deductionCost;
    this.data.isDisabled = -returenCost > 0;
    if (-returenCost > 0) {
      wx.showToast({
        title: "扣款金额不能大于退款金额",
        icon: 'none',
        duration: 1500
      })
    }

    this.setData({
      isDisabled: this.data.isDisabled,
      returenCost: -Number(returenCost).toFixed(2),
    })
  },

  // 添加退款
  addRefundClick: function () {
    let item = {
      refundStatus: 0,
      billsDetailId: 0,
      name: "请选择",
      cost: 0
    }
    this.data.refundArray.push(item);
    this.setData({
      refundArray: this.data.refundArray
    })
    this.statisticalFinalData();
  },

  // 删除退款
  refundDeleteClick: function (e) {
    this.data.refundArray.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      refundArray: this.data.refundArray
    })
    this.statisticalFinalData();
  },

  // 退款金额
  bindinputRefund: function (e) {
    var item = this.data.refundArray[e.currentTarget.dataset.index];
    item.cost = e.detail.value;
    this.setData({
      refundArray: this.data.refundArray
    })
    this.statisticalFinalData();
  },

  // 退款下拉
  refundChange: function (e) {
    var item = this.data.refundArray[e.currentTarget.dataset.index];
    item.name = this.data.refundSelectArray[e.detail.value];
    this.setData({
      refundArray: this.data.refundArray
    })
  },

  // 添加扣款
  addDeductionClick: function () {
    let item = {
      refundStatus: 1,
      billsDetailId: 0,
      name: "请选择",
      cost: 0
    }
    this.data.deductionArray.push(item);
    this.setData({
      deductionArray: this.data.deductionArray
    })
    this.statisticalFinalData();
  },

  // 删除扣款
  deductionDeleteClick: function (e) {
    this.data.deductionArray.splice(e.currentTarget.dataset.index, 1)
    this.setData({
      deductionArray: this.data.deductionArray
    })
    this.statisticalFinalData();
  },

  // 扣款金额
  bindinputDeduction: function (e) {
    var item = this.data.deductionArray[e.currentTarget.dataset.index];
    item.cost = e.detail.value;
    this.setData({
      deductionArray: this.data.deductionArray
    })
    this.statisticalFinalData();
  },

  // 扣款下拉
  deductionChange: function (e) {
    var item = this.data.deductionArray[e.currentTarget.dataset.index];
    item.name = this.data.deductionSelectArray[e.detail.value];
    this.setData({
      deductionArray: this.data.deductionArray
    })
  },

  // 获取退款下拉选项
  getRefundSelectDate: function () {
    let params = {
      index: 1
    }
    adminCheckOutSelectData(params).then(res => {
      if (res.data.code == 200) {
        var array = [];
        res.data.data.map(item => {
          array.push(item.item);
        })
        this.setData({
          refundSelectArray: array
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  // 获取下拉选项
  getDeductionSelectDate: function () {
    let params = {
      index: 2
    }
    adminCheckOutSelectData(params).then(res => {
      if (res.data.code == 200) {
        var array = [];
        res.data.data.map(item => {
          array.push(item.item);
        })
        this.setData({
          deductionSelectArray: array
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    })
  },

  bindinputTextareaClick: function (e) {
    if (e.currentTarget.dataset.item == "return") {
      this.setData({
        returnCause: e.detail.value
      })
    } else {
      this.setData({
        remark: e.detail.value
      })
    }
  },

  paymentChange: function (e) {
    this.setData({
      paymentStr: this.data.paymentArray[e.detail.value],
      pathway: e.detail.value
    })
  },

  nextClick: function () {
    if (this.data.badDebtCost > 0 && this.data.returenCost < 0) {
      wx.showToast({
        title: "该账单中同时存在退款和欠款，请确认结账金额是否正确。",
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.pathway == -1) {
      wx.showToast({
        title: "请选择付款途径",
        icon: 'none',
        duration: 1500
      })
    } else {

    }
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