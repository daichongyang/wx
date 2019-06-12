// pages/test10/test10.js
var utils = require('../../utils/url.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    gdsyArr:[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    temp :[],//筛选中间数组
    startCost:0,
    endCost : 0,
    tag : 100,
    cityId :0,//城市ID
    type : 0,//房源类型
    houseList:[],
    array: ["区域▾", "租金▾", "户型▾", "更多筛选▾", "↑↓"],
    sortingArr: ["不限", "最新发布", "租金由低到高", "租金由高到低", "面积由小到大", "面积由大到小"],
    doorModelArr: ["不限", "一室", "二室", "三室", "四室", "更大户型"],
    rentArr: ["不限", "≤1500以下", "1000-2000元", "2000-2500元", "2500-3000元", "3500元以上"],
    mjArr: [{ name: "≤40㎡", select: false }, { name: "40-60㎡", select: false }, { name: "60-80㎡", select: false }, { name: "80-100㎡", select: false }, { name: "100-120㎡", select: false }, { name: "≥120㎡", select: false }, { name: "有电梯", select: false }, { name: "无电梯", select: false }, { name: "押一付一", select: false }, { name: "押二付一", select: false }, { name: "低楼层", select: false }, { name: "中楼层", select: false }, { name: "高楼层", select: false }, { name: "在线签约", select: false }, { name: "智慧公寓", select: false }],
    flag: true,
    id: 1000,//总的id
    zjId: 0,
    qyId: 0,//区域id
    sqId:0,//商圈id
    hxId: 0,//户型id
    pxId: 0,//排序id
    locationData:[],//城市列表
    locationList:[],//商圈列表
    widthSelcet:0,//商圈的宽度
    width:375,//区域
    money:'0元-不限',//租金
    moneyValue:0,
  },
  //租金
  rentClick:function(e){
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值
    var startCost = 0;
    var endCost = 0;
    if(id == 0){
      startCost = 0;
      endCost = 0;
    }else if(id == 1){
      startCost = 0;
      endCost = 1500;
    }else if (id == 2) {
      startCost = 1500;
      endCost = 2500;
    }else if (id == 3) {
      startCost = 2000;
      endCost = 2500;
    } else if (id == 4) {
      startCost = 2500;
      endCost = 3000;
    } else if (id == 5) {
      startCost = 3500;
      endCost = 0;
    }
    this.setData({
      zjId: id,
      moneyValue: 0,
      money: '0元-不限',
      startCost: startCost,
      endCost: endCost
    })
    this.loadSearchRequestData();
  },
  //租金拖动调
  bindchanging:function(e){
    console.log(e);
    var money = '0元-不限';
    var startCost = 0;
    var endCost = 0;
    if (e.detail.value == 20000 || e.detail.value == 0){
      money = '0元' + '-' + '不限';
      startCost = 0;
      endCost = 0;
    }else{
      money = '0元' + '-' + e.detail.value + '元';
      startCost = 0;
      endCost = e.detail.value;
    }
    this.setData({
      zjId: 6,
      money: money,
      moneyValue: e.detail.value,
      startCost: startCost,
      endCost: endCost
    })
  },
  //租金中的确定按钮
  okMoneyClick:function(){
    console.log(this.data.startCost);
    console.log(this.data.endCost);
    this.loadSearchRequestData();
  },
  //户型
  hxClick: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值
    this.setData({
      hxId: id,
    })
    //筛选请求
    this.loadSearchRequestData();
  },
  //排序
  pxClick: function (e) {
    console.log("================")
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值
    this.setData({
      pxId: id,
    })
    //筛选请求
    this.loadSearchRequestData();
  },
  //阻止事件
  stopTap: function () {

  },
  //重置
  bindreset: function (e) {
    console.log(e)
    for (let i = 0; i < this.data.mjArr.length; i++) {
      this.data.mjArr[i]['select'] = false;
      this.setData({
        mjArr: this.data.mjArr,
        temp:[],
      })
    }
  },
  //提交
  bindsubmit: function (e) {
    var gdsyArr = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for(let i=0;i<this.data.temp.length;i++){
      gdsyArr[this.data.temp[i]] = 1;
    }
    this.setData({
      gdsyArr:gdsyArr,
    })
    this.loadSearchRequestData();
  },
  //更多筛选
  checkboxChange: function (e) {
    console.log(e.detail.value)
    console.log(this.data.temp)
    if (e.detail.value.length > this.data.temp.length) {
      this.data.mjArr[e.detail.value[e.detail.value.length - 1]]['select'] = true;
      this.setData({
        mjArr: this.data.mjArr,
        temp: e.detail.value
      })
    } else {
      let a = new Set(this.data.temp);
      let b = new Set(e.detail.value);
      let difference = new Set([...a].filter(x => !b.has(x)));
      var index = Array.from(difference);
      this.data.mjArr[index[0]]['select'] = false;
      this.setData({
        mjArr: this.data.mjArr,
        temp:e.detail.value
      })
    }
  },
  //点击区域、租金、户型、更多筛选 排序按钮
  choseTxtColor: function (e) {
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值
    console.log(id);
    if (this.data.tag == id) {
      this.setData({
        id: 1000,
        flag: true,
        array: ["区域▾", "租金▾", "户型▾", "更多筛选▾", "↑↓"],
        tag:100,
      })
    } else {
      this.setData({
        tag:id,
        id: id,
        flag: false,
      })
      if (id == 0) {
        this.setData({
          array: ["区域▴", "租金▾", "户型▾", "更多筛选▾", "↑↓"],
        })
      } else if (id == 1) {
        this.setData({
          array: ["区域▾", "租金▴", "户型▾", "更多筛选▾", "↑↓"],
        })
      } else if (id == 2) {
        this.setData({
          array: ["区域▾", "租金▾", "户型▴", "更多筛选▾", "↑↓"],
        })
      } else if (id == 3) {
        this.setData({
          array: ["区域▾", "租金▾", "户型▾", "更多筛选▴", "↑↓"],
        })
      } else if (id == 4) {
        this.setData({
          array: ["区域▾", "租金▾", "户型▾", "更多筛选▾", "↑↓"],
        })
      }
    }

  },
  //点击蒙版
  maskShow: function () {
    this.setData({
      tag:100,
      id: 1000,
      flag: true,
      array: ["区域▾", "租金▾", "户型▾", "更多筛选▾", "↑↓"],
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadAllData(options);
  },
  //第一次进来加载全部条件的房源
  loadAllData: function (options){
    this.setData({
      type:options.type,
      cityId: options.cityId
    })
    //精选房源
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      data: {
        cityId: this.data.cityId,
        type: this.data.type,
      },
      //加载区域的数据
      url: utils.houseListUrl,
      success: res => {
        this.setData({
          houseList: res.data.data,
        })
        this.loadAreaData();
      }
    })
    
  },

  //加载区域的数据
  loadAreaData:function(){
    wx.request({
      url: utils.locationUrl,
      data:{
        locationId: this.data.cityId,
      },
      success:res => {
        wx.hideLoading();
        console.log(res);
        var dataList = res.data.data;
        var obj = { name: '全城', locationId:0};
        dataList.unshift(obj);
        this.setData({
          locationData: dataList,
        })
      }
    })
  },

  //点击精选房源
  houseInfoClick: function (e) {
    console.log(e.currentTarget.dataset.id);
    console.log(this.data.houseList[e.currentTarget.dataset.id].houseId)
    wx.navigateTo({
      url: '/pages/houseDetails/houseDetails?houseId=' + this.data.houseList[e.currentTarget.dataset.id].houseId,
    })
  },

  //加载筛选后的房源
  loadSearchRequestData:function(){
    var qyId = 0;
    var sqId = 0;
    if(this.data.qyId != 0){
      qyId = this.data.locationData[this.data.qyId].locationId
    }
    if(this.data.sqId != 0){
      sqId = this.data.locationList[this.data.sqId].locationId
    }
    //去掉蒙版
    this.maskShow();
    var _this = this;
    wx.showLoading({
      title: '正在加载...',
    })
    wx.request({
      url: utils.houseListUrl,
      data:{
        //入口type
        type:this.data.type,
        //城市id
        cityId:this.data.cityId,
        //区域id
        districtId: qyId,
        //商圈id
        locationIds: sqId,
        //租金
        startCost:this.data.startCost,
        endCost:this.data.endCost,
        //排序
        filterMore:this.data.pxId,
        //户型
        houseType:this.data.hxId,
        //更多筛选
        // 面积
        areaOne:this.data.gdsyArr[0],
        areaTwo: this.data.gdsyArr[1],
        areaThree: this.data.gdsyArr[2],
        areaFour: this.data.gdsyArr[3],
        areaFive: this.data.gdsyArr[4],
        areaSix: this.data.gdsyArr[5],
        //电梯
        isElevator: this.data.gdsyArr[6],
        noElevator: this.data.gdsyArr[7],
        //付款方式
        paymentOne: this.data.gdsyArr[8],
        paymentOne: this.data.gdsyArr[9],
        //楼层
        lowFloor: this.data.gdsyArr[10],
        middleFloor: this.data.gdsyArr[11],
        highFloor: this.data.gdsyArr[12],
        //其他筛选
        reservation: this.data.gdsyArr[13],
        wisdom: this.data.gdsyArr[14],
      },
       success: function (e) {
        _this.setData({
          houseList: e.data.data,
        })
        wx.hideLoading();
      }
    })

  },

  //点击区域
  areaClick:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值
    if (e.currentTarget.dataset.id == 0){
      this.setData({
        width: 375,
        widthSelcet: 0,
        qyId: id,
        sqId:0,
        locationList:[],
      })
      //请求筛选
      this.loadSearchRequestData();
    }else{
      console.log(this.data.locationData[id].locationList);
      var locationList = this.data.locationData[id].locationList;
      var obj = { name: '全部', locationId: 0 };
      locationList.unshift(obj);
      this.setData({
        width: 250,
        widthSelcet: 250,
        qyId: id,
        locationList: locationList
      })
      locationList = this.data.locationData[id].locationList.shift(obj);
    }
  },
  //点击商圈
  businessClick:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;  //获取自定义的ID值
    if (e.currentTarget.dataset.id == 0) {
      this.setData({
        sqId: id,
      })
    } else {
      this.setData({
        sqId: id,
      })
    }
    //请求筛选
    this.loadSearchRequestData();
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