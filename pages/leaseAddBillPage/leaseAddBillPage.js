// pages/leaseAddBillPage/leaseAddBillPage.js
var dateTool = require('../../utils/date.js');
import {
  adminAddLeaseBills,
  adminBillProject,
  adminLeaseBills
} from "../../utils/url.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    leaseBill: null, // 账单
    accountReceivable: 0, //金额
    receiptRemark: "", //备注
    billPeriod: [], //所属账期
    billPeriodStr: "请选择",
    billsId: 0, 
    billProjectStr: "请选择",
    superId: 0,
    subId: 0,
    multiArray: [],
    multiIndex: [0, 0],
    customItem: '全部',
    starTime: null, // 收款日期
    endTime: "2050-01-01", 
    imgList: [], //图片数组
    leaseId: 0, //账单id
    billProject: [] //账单项目
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      leaseId: options.leaseId,
      starTime: dateTool.formatTimeStamp(new Date() / 1000, "yyyy-MM-dd")
    })
    this.billProcet();
    this.getLeaseBills();
  },

  // 账单项目
  billProcet: function () {
    adminBillProject().then(res => {
      if (res.data.code == 200) {
        this.setData({
          billProject: res.data.data.map(item => {
            if (item.billsType === 1) {
              item.billTypeStr = '租金'
            } else if (item.billsType === 2) {
              item.billTypeStr = '其它押金'
            } else if (item.billsType === 3) {
              item.billTypeStr = '水电煤暖网'
            } else if (item.billsType === 4) {
              item.billTypeStr = '服务收费'
            } else if (item.billsType === 5) {
              item.billTypeStr = '维修费用'
            } else if (item.billsType === 6) {
              item.billTypeStr = '杂费'
            } else if (item.billsType === 7) {
              item.billTypeStr = '预收费'
            } else if (item.billsType === 8) {
              item.billTypeStr = '手续费'
            } else if (item.billsType === 9) {
              item.billTypeStr = '违约赔偿'
            } else if (item.billsType === 10) {
              item.billTypeStr = '租赁费用'
            } else {
              item.billTypeStr = '其他类'
            }
            return item;
          }),
        })

        var titleArray = [];
        var subArray = [];
        this.data.billProject.map(item => {
          titleArray.push(item.billTypeStr);
          item.configVos.map(item => {
            subArray.push(item.item);
            return item;
          })
          return item;
        })
        this.setData({
          multiArray: [titleArray, subArray]
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

  // 租约账单
  getLeaseBills: function () {
    let params = {
      leaseId: this.data.leaseId
    }
    console.log(params);
    adminLeaseBills(params).then(res => {
      console.log(res);
      if (res.data.code == 200) {
        this.setData({
          leaseBill: res.data.data.map(item => {
            item.startDateStr = dateTool.formatTimeStamp(item.startDate / 1000, "yyyy.MM.dd");
            item.endDateStr = dateTool.formatTimeStamp(item.endDate / 1000, "yyyy.MM.dd");
            return item;
          })
        })
        var periodArray = [];
        this.data.leaseBill.map(item => {
          periodArray.push(item.stageName + "(" + item.startDateStr + "-" + item.endDateStr + ")");
          return item;
        })
        this.setData({
          billPeriod: periodArray
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

  // 账单项目
  bindMultiPickerChange: function (e) {
    var item = this.data.billProject[e.detail.value[0]];
    var subItem = item.configVos[e.detail.value[1]];
    var str = item.billTypeStr + "/" + subItem.item;
    this.setData({
      multiIndex: e.detail.value,
      billProjectStr: str,
      subId: subItem.id,
      superId: item.billsType
    })
  },

  bindMultiPickerColumnChange: function (e) {
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    var subTitle = [];
    var item = this.data.billProject[data.multiIndex[0]];
    item.configVos.map(item => {
      subTitle.push(item.item);
      return item;
    })
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case data.multiIndex[0]:
            data.multiArray[1] = subTitle;
            break;
        }
        data.multiIndex[1] = 0;
        break;
    }
    this.setData(data);
  },

  bindinputName: function (e) {
    this.setData({
      accountReceivable: e.detail.value
    })
  },

  bindinputTextareaClick: function (e) {
    this.setData({
      receiptRemark: e.detail.value
    })
  },

  // 所属账期
  periodBindchange: function (e) {
    var item = this.data.leaseBill[e.detail.value];
    this.setData({
      billsId: item.billsId,
      billPeriodStr: this.data.billPeriod[e.detail.value]
    })
  },

  bindDateChange: function (e) {
    this.setData({
      starTime: e.detail.value
    })
  },

  // 提交
  submitClick: function () {
    if (this.data.subId == 0 && this.data.superId == 0) {
      wx.showToast({
        title: '请选择账单项目',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.accountReceivable == 0) {
      wx.showToast({
        title: '请输入金额',
        icon: 'none',
        duration: 1500
      })
    } else if (this.data.billsId == 0) {
      wx.showToast({
        title: '请选择账期',
        icon: 'none',
        duration: 1500
      })
    } else {
      let params = {
        accountReceivable: this.data.accountReceivable,
        billsId: this.data.billsId,
        gmtCreate: new Date().getTime(),
        receiptRemark: this.data.receiptRemark,
        receivableDate: new Date(this.data.starTime).getTime(),
        subId: this.data.subId,
        superId: this.data.superId
      }
      adminAddLeaseBills(params).then(res => {
        console.log(res);
        if (res.data.code == 200) {
          wx.showToast({
            title: "添加成功",
            icon: 'none',
            duration: 1500
          })
          setTimeout(function () {
            wx.navigateBack({
            })
          }, 1500)
        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1500
          })
        }
      })
    }
  },

  //添加照片
  addImageClick: function () {
    if (this.data.imgList.length >= 5) {
      wx.showToast({
        title: '只能上传5张图片',
        icon: 'none',
        duration: 1500
      })
      return;
    } else {
      var count = 5 - this.data.imgList.length;
    }
    wx.chooseImage({
      count: count,
      success: res => {
        console.log(res.tempFilePaths);
        for (let i = 0; i < res.tempFilePaths.length; i++) {
          this.data.imgList.push(res.tempFilePaths[i]);
        }
        this.setData({
          imgList: this.data.imgList,
        })
        console.log(this.data.imgList);
      },
    })
  },

  //删除照片
  deltelImage: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.data.imgList.splice(id, 1);
    this.setData({
      imgList: this.data.imgList,
    })
  },

  //查看大图
  lookImageClick: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.previewImage({
      current: this.data.imgList[id], // 当前显示图片的http链接
      urls: this.data.imgList// 需要预览的图片http链接列表
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