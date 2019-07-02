// pages/myBillOrWater/myBillOrWater.js

var dateTool = require('../../utils/date.js');
import {
  getBusinessWater,
  selectApartment,
  itemSelect
} from "../../utils/url.js"
import {
  getDateArray
} from "../../utils/myDate.js"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelectBillView: false,
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
    waterCategory: ["全部", "交易类型", "全部房源"],
    waterData: [],
    jiaoyiType: ['线上', '现金', '支付宝转账', '微信转账', '银行转账', 'POS刷卡', '其它', '对私银行卡转账'],
    waterVO: [],
    apartmentId:0,
    current:1,
    size:10,
    type:0,
    date1: getDateArray()[7],
    date2: getDateArray()[7],
    end: getDateArray()[7],//限制结束时间
    startTime: new Date().getTime(),
    endTime: new Date().getTime() + 99999,
    levelCost: 0,//交易项目
    levelGroup: 0,//交易项目
    levelItem: 0,//交易项目
    apartmentArr:[],//房源下拉列表
    paymentType:'',
  //   itemsele: [
  //   [
  //     { costId: 1, item: "租客" },
  //     { costId: 2, item: "记账" },
  //     { costId: 3, item: "账户" }
  //   ],
  //   [{ costId: 0, item: "全部" }],
  //   [{ costId: 0, item: "全部" }]],
  //   itemsele1: [{ costId:0, item:"全部"}],
  //   itemsele2: [{ costId: 0, item: "全部" }],
  //   itemsele3:[{ costId:0, item:"全部"}],
    costId:0,
    level:1,
    itemsele: [],
  },
  
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e.detail.column, '，值为', e.detail.value);
    var data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    console.log(data.multiIndex);
    this.setData(data);
  },
  // 全部选择
  itemSelectt(){
    let params = {
      costId: this.data.costId,
      level: this.data.level
    }
    itemSelect(params).then(res => {
      console.log(res)
      if (res.data.code == 200) {
        if (this.data.level == 1){
          this.setData({
            itemsele1: res.data.data
          })
        } else if (this.data.level == 2){
          this.setData({
            itemsele2: res.data.data
          })
        }else{
          this.setData({
            itemsele3: res.data.data
          })
        }
        this.data.itemsele[0]=this.data.itemsele1
        this.data.itemsele[1]=this.data.itemsele2
        this.data.itemsele[2]=this.data.itemsele3
      }
    })
  },
  // 交易类型
  changeJiaoyi(event){
    console.log(event.detail )
    this.setData({
      paymentType: event.detail.value,
      current:1
    })
    this.getWaterDataInfo()
  },
  // 全部房源
  changeApartment(event){
    console.log(event.detail )
    this.setData({
      paymentType: event.detail.value,
      current:1
    })
    this.getWaterDataInfo()
  },
  // 时间选择
  bindDateChange1: function (e) {
    console.log(e)
    this.setData({
      date1: e.detail.value,
      startTime: new Date(e.detail.value).getTime(),
      current: 1
    })
    this.getWaterDataInfo()
  },
  bindDateChange2: function (e) {
    console.log(e)
    this.setData({
      date2: e.detail.value,
      endTime: new Date(e.detail.value).getTime()+99999,
      current: 1
    })
    this.getWaterDataInfo()
  },
  // 获取房源下拉列表
  selectApartmentt() {
    selectApartment().then(res => {
      console.log(res)
      if (res.data.code == 200) {
        this.setData({
          apartmentArr: res.data.data
        })
      } else {
        wx.showToast({
          title: res.data.msg,
          icon: 'none',
          duration: 1500
        })
      }
    }).catch(err => {
      wx.showToast({
        title: "网络请求失败",
        icon: 'none',
        duration: 1500
      })
    })
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
      if (!this.data.waterData) {
        this.getWaterDataInfo();
      }
    }
  },
// 流水账单 ---交易流水 
  getWaterDataInfo: function () {
    let params = {
      apartmentId: this.data.apartmentId,
      current: this.data.current,
      size: this.data.size,
      type: this.data.type,
      levelCost: this.data.levelCost,
      levelGroup: this.data.levelGroup,
      levelItem: this.data.levelItem,
      paymentType: this.data.paymentType,
      startTime: this.data.startTime,
      endTime: this.data.endTime,
    }
    console.log(params)
    getBusinessWater(params).then(res => {
      console.log(res)
      if(res.data.code == 200){
        if (res.data.data.records.length!=0){
          var data = res.data.data.records[0].billVO.filter(item => {
            var timestamp = item.billTime / 1000;
            var appointmentTimeDate = dateTool.formatTimeStamp(timestamp);
            item.billTime = appointmentTimeDate;
            return item
          });
          if(this.data.current == 1){
            console.log("current:" + this.data.current)
            this.setData({
              waterVO: data
            })
          }else{
            this.data.waterVO.push(data)
          }
          this.setData({
            waterData: res.data.data.records[0]||[],
            waterVO: this.data.waterVO
          })
        }else{
          if (this.data.current == 1) {
            console.log("current:" + this.data.current)
            this.setData({
              waterVO: []
            })
          } else {
            this.data.waterVO.push([])
          }
          this.setData({
            waterData: res.data.data.records[0]||[],
          })
        }

      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWaterDataInfo()
    this.selectApartmentt()
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.itemSelectt()
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