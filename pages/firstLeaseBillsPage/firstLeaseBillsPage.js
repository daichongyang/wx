// pages/firstLeaseBillsPage/firstLeaseBillsPage.js
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    layout:'',
    rentCost:'',
    firstPay:'',
    leaseId:'',
    houseId:'',
    lszdList: [],
    lszdAllList:[],
    flag:true,
    chekboxAll:false,
    chekZdCount:0,
    money:0,
    payQueryArr: [],
    allCount:0,//全部count
    allZdcount:0,//没有点开全部的 count
    tempArr:[],
    isHeiden:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    wx.setStorageSync('options', options)
    this.setData({
      layout:options.layout,
      leaseId: options.leaseId,
      firstPay: options.firstPay,
      rentCost:options.rentCost,
      houseId: options.houseId
    })
    //账单信息
    this.loadDataSource(options.leaseId);
    console.log(this.data.houseId)
  },

  //加载数据
  loadDataSource: function (leaseId) {
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.leaseBillsUrl + leaseId + '/0',
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      method: "POST",
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          var data = res.data.data;
          wx.hideLoading();
          if (!data){
            return;
          }
          var timestamp = Date.parse(new Date());
          var curentTime = util.formatTimeTwo(timestamp / 1000, 'Y/M/D');
          //全部时间转换一下
          for (let i = 0; i < data.length; i++) {
            var startPayment = util.formatTimeTwo(data[i].startPayment / 1000, 'Y/M/D');
            var gmtCreate = util.formatTimeTwo(data[i].gmtCreate / 1000, 'Y/M/D');
            var endPayment = util.formatTimeTwo(data[i].endPayment / 1000, 'Y/M/D');
            data[i].startPayment = startPayment;
            data[i].endPayment = endPayment;
            data[i].gmtCreate = gmtCreate;
            for (let j = 0; j < data[i].detailVos.length; j++) {
              var receivableDate=util.formatTimeTwo(data[i].detailVos[j].receivableDate/1000,'Y/M/D');
              data[i].detailVos[j].receivableDate=receivableDate;
              if (data[i].detailVos[j].payStatus == 0){
                this.data.allZdcount += 1;
              }
             }
          }

          if (this.data.firstPay == 1){ //第一次进入付款
            console.log('第一次进入付款')
            this.data.chekboxAll = true;
            this.data.flag = true;
            for (let i = 0; i < data.length; i++) {
              if (data[i].stage == 1) {
                this.data.lszdList.push(data[i]);
              
                for (let j = 0; j < data[i].detailVos.length;j++){
                  if (data[i].detailVos[j].payStatus == 0){
                    this.data.chekZdCount += 1;
                    this.data.money += data[i].detailVos[j].accountReceivable;
                    var payQuery = {
                      billsId : data[i].billsId,
                      billsCost : data[i].detailVos[j].accountReceivable,
                      pkId: data[i].detailVos[j].pkId,
                    };
                    this.data.payQueryArr.push(payQuery);
                  }
                }
              }
            }
          }else{ //以后付款
            this.data.chekboxAll = false;
            this.data.flag = false;
            for (let i = 0; i < data.length; i++) {
              if (curentTime >= data[i].startPayment) {
                this.data.lszdList.push(data[i]);
                for (let j = 0; j < data[i].detailVos.length; j++){
                  if (data[i].detailVos[j].payStatus == 0) {
                    this.data.allCount += 1;
                  }
                }
              }
            }
          }
        

          //赋值
          this.setData({
            lszdList: this.data.lszdList,
            lszdAllList: data,
            chekboxAll: this.data.chekboxAll,
            flag: this.data.flag,
            chekZdCount: this.data.chekZdCount,
            money: this.data.money,
            payQueryArr: this.data.payQueryArr,
            allZdcount: this.data.allZdcount,
            allCount:this.data.allCount,

          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }
        wx.hideLoading();
      }
    })
  },

  //全选或者不全选
  allcheckboxChange:function(e){
      console.log(e)
      if (e.detail.value.length == 1) {
        this.data.payQueryArr = [];
        this.data.chekZdCount = 0;
        this.data.money = 0;
        for (let i = 0; i < this.data.lszdList.length; i++) {
          for (let j = 0; j < this.data.lszdList[i].detailVos.length; j++) {
            if (this.data.lszdList[i].detailVos[j].payStatus == 0) {
              this.data.lszdList[i].detailVos[j].superId = 1000;
              var payQuery = {
                billsId: this.data.lszdList[i].billsId,
                billsCost: this.data.lszdList[i].detailVos[j].accountReceivable,
                pkId: this.data.lszdList[i].detailVos[j].pkId,
              };
              this.data.chekZdCount += 1;
              this.data.money = parseFloat(this.data.money);
              this.data.money += parseFloat(this.data.lszdList[i].detailVos[j].accountReceivable) * 100;
              this.data.payQueryArr.push(payQuery);
              var item = i + '-' + j;
              this.data.tempArr.push(item);
            }
          }
        }
        console.log(this.data.tempArr);
      }else{
        this.data.payQueryArr = [];
        this.data.chekZdCount = 0;
        this.data.money = 0;
        this.data.tempArr = [];
        for (let i = 0; i < this.data.lszdList.length; i++) {
          for (let j = 0; j < this.data.lszdList[i].detailVos.length; j++) {
            if (this.data.lszdList[i].detailVos[j].payStatus == 0) {
              this.data.lszdList[i].detailVos[j].superId = 0;
            }
          }
        }
      }
      this.setData({
        lszdList:this.data.lszdList,
        payQueryArr:this.data.payQueryArr,
        chekZdCount:this.data.chekZdCount,
        money:this.data.money/100,
        tempArr:this.data.tempArr,
      })
  },
  // 支付页面
  gochoisePay(orderId, houseId) {
    let payMoney = this.data.money
    wx.navigateTo({
      url: '/pages/choisePay/choisePay?orderId=' + orderId + '&houseId=' + houseId + '&payMoney=' + payMoney
    })
  },
  //点击去支付
  payClick: function () {
    if (!this.data.payQueryArr.length){
      wx.showToast({
        title: '请选择支付项',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    console.log(JSON.stringify(this.data.payQueryArr))
    wx.request({
      method: "POST",
      url: utils.leaseBillsPayUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data:JSON.stringify(this.data.payQueryArr),
      
      success: res => {
        console.log(res);
        this.gochoisePay(res.data.data, this.data.houseId)
        // wx.request({
        //   method: "POST",
        //   url: utils.wechatPaycreateUrl + res.data.data + '/' + this.data.houseId,
        //   header: {
        //     "Authorization": app.globalData.userInfo.token,
        //   },
        //   success:res => {
        //     if (res.data.code != 200) {
        //       wx.showToast({
        //         title: res.data.msg,
        //         icon: 'none',
        //         duration: 2000
        //       })
        //     } else {
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
        //           if (this.data.firstPay == 1) {
        //             let pages = getCurrentPages();
        //             let prevPage = pages[pages.length - 2];
        //             console.log(prevPage)
        //             if (prevPage.route == "pages/myLeasePage/myLeasePage") {
        //               prevPage.setData({
        //                 refresh:true,
        //               })
        //               wx.navigateBack({
        //                 detail: 1,
        //               })
        //             }
        //           } else {
        //             //晚上加的代码
        //             this.setData({
        //               lszdList: [],
        //               lszdAllList: [],
        //               flag: true,
        //               chekboxAll: false,
        //               chekZdCount: 0,
        //               money: 0,
        //               payQueryArr: [],
        //               allCount: 0,//全部count
        //               allZdcount: 0,//没有点开全部的 count
        //               tempArr: [],
        //               isHeiden: 0
        //             })
        //             this.loadDataSource(this.data.leaseId);
        //             //晚上加的代码
        //           }
        //         },
        //         fail: res => {
        //           wx.showToast({
        //             title: '支付失败',
        //             icon: 'none',
        //             duration: 1000
        //           })
        //         },

        //       })
        //     }
        //   }
        // })
     
      }
    })
  },

  //查看所有账单
  lookAllZdClick:function(){
    this.setData({
      lszdList:this.data.lszdAllList,
      flag:true,
      payQueryArr :[],
      chekZdCount: 0,
      money : 0,
      chekboxAll:false,
      allCount:this.data.allZdcount,
      tempArr:[],
      isHeiden:1,
    })
  },

  //历史账单
  lszdClick:function(){
    wx.navigateTo({
      url: '/pages/lookingLeaseBillsPage/lookingLeaseBillsPage?leaseId=' + this.data.leaseId,
    })
  },


  //选择账单支付
  checkboxChange:function(e){
   if(this.data.allCount > e.detail.value.length){
     this.setData({
       chekboxAll:false,
     })
   }else{
     this.setData({
       chekboxAll: true,
     })
   }
     
    if (e.detail.value.length > this.data.tempArr.length) {
      var lastObj = e.detail.value[e.detail.value.length - 1];
      console.log(lastObj);
      var arr = lastObj.split('-');
      console.log(arr);
      var payQuery = {
        billsId: this.data.lszdList[arr[0]].billsId,
        billsCost: this.data.lszdList[arr[0]].detailVos[arr[1]].accountReceivable,
        pkId: this.data.lszdList[arr[0]].detailVos[arr[1]].pkId,
      };
      this.data.chekZdCount += 1;
      this.data.money = parseFloat(this.data.money );
      this.data.money += parseFloat(this.data.lszdList[arr[0]].detailVos[arr[1]].accountReceivable);
      console.log(this.data.lszdList[arr[0]].detailVos[arr[1]].accountReceivable)
      this.data.payQueryArr.push(payQuery);
      console.log(this.data.payQueryArr);
     
    } else {
      let a = new Set(this.data.tempArr);
      let b = new Set(e.detail.value);
      let difference = new Set([...a].filter(x => !b.has(x)));
      var index = Array.from(difference);
      var objStr = index[0];
      var arr = objStr.split('-');
      this.data.money = parseFloat(this.data.money);
      this.data.money -= parseFloat(this.data.lszdList[arr[0]].detailVos[arr[1]].accountReceivable);
      this.data.chekZdCount -= 1;
      for (let i = 0; i < this.data.tempArr.length;i++){
        if (this.data.tempArr[i] == index[0]){
          this.data.payQueryArr.splice(i, 1);
        }
      }
      console.log(this.data.payQueryArr);
      if (this.data.payQueryArr.length == 0){
        this.data.money = 0;
      }
    }

    var number = parseFloat(this.data.money);
    console.log("==========", number.toFixed(2));
    var x = number.toFixed(2);
    this.setData({
      tempArr: e.detail.value,
      chekZdCount: this.data.chekZdCount,
      payQueryArr: this.data.payQueryArr,
      money: x,
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
    // if (wx.getStorageSync('options')){
    //   this.setData({
    //     chekZdCount: 0,
    //     money: 0,
    //     payQueryArr:[],
    //     lszdList:[]

    //   })
    //   this.onLoad(wx.getStorageSync('options'))

      // this.onLoad()
    // }
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