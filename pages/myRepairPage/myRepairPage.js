// pages/myRepairPage/myRepairPage.js
const app = getApp();
var utils = require('../../utils/url.js');
var util = require('../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgList:[],//图片数组
    name:"",//姓名
    phone:"",//手机号码
    houseName:"选择房源",
    dataSource:[],//总数据源
    houseList:[],
    typeName:"选择分类",
    typedisabled:true,
    applyTypes:[],
    applyTypesList:[],
    time:"选择时间",
    date:"选择日期",
    startTime:"",  //选择时间的区间开始时间
    endTime: "", //选择时间的区间结束时间
    houseId:0,//房间id
    tdesc:"",//描述
    typeId:0,//分类id
    xqId:0,//公寓id
  },

//点击包裹器选择分类
  selcetdTypeClick:function(){
    if (this.data.houseName == "选择房源"){
      wx.showToast({
        title: '请先选择房源',
        icon: 'none',
        duration: 1000
      })
    }
  },

  //type分类选择
  typeBindchange:function(e){   
    var id = e.detail.value;
    this.setData({
      typeName: this.data.applyTypes[id],
      typeId: this.data.applyTypesList[id].id
    })
  },

  //选择房源
  houseBindchange:function(e){
    console.log(e);
    var id = e.detail.value;
    var arr=[];
    for (let i = 0; i < this.data.dataSource[id].applyTypes.length;i++){
      var name = this.data.dataSource[id].applyTypes[i].name;
      arr.push(name);
    }
    this.setData({
      houseName: this.data.houseList[id],
      typedisabled:false,
      applyTypes: arr,
      applyTypesList: this.data.dataSource[id].applyTypes,
      typeName: "选择分类",
      xqId: this.data.dataSource[id].gyId,
      houseId: this.data.dataSource[id].houseId,
      typeId:0,
    })
  },

  //描述
  bindinputTextareaClick:function(e){
    this.setData({
      tdesc:e.detail.value,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadDataSource();

//初始化时间
    this.initTimeDate();
  },

  //初始化时间
  initTimeDate:function(){
    var timestamp = Date.parse(new Date()) / 1000;
    var startTime = util.formatTimeTwo(timestamp, 'Y-M-D');
    var endTime = util.formatTimeTwo(timestamp + 3600*24*7, 'Y-M-D');
    console.log(startTime);
    console.log(endTime);
    this.setData({
      startTime:startTime,
      endTime:endTime
    })
  },

  //选择日期
  bindDateChange:function(e){
    console.log(e);
    this.setData({
      date: e.detail.value
    })
  },
  //选择时间
  bindTimeChange:function(e){
    console.log(e);
    this.setData({
      time: e.detail.value
    })
  },

  //加载数据
  loadDataSource: function () {
    console.log(app.globalData.userInfo.token);
    console.log(utils.hydroelectricGetGyAndHouseListUrl);
    wx.request({
      method: "POST",
      url: utils.hydroelectricGetGyAndHouseListUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: res => {
        console.log(res);  
        if (res.data.code == 200) {
          if (!res.data.data) {
            return;
          }else{
            for(let i=0;i<res.data.data.length;i++){
              var houseName = res.data.data[i].gyName + res.data.data[i].houseName;
              this.data.houseList.push(houseName);
            }
            this.setData({
              name: app.globalData.userInfo.nickName,
              phone:app.globalData.userInfo.phone,
              dataSource:res.data.data,
              houseList:this.data.houseList,
            })
          }
        }
      }
    })
  },

  //添加照片
  addImageClick:function(){
    if(this.data.imgList.length >= 5){
      wx.showToast({
        title: '只能上传5张图片',
        icon: 'none',
        duration: 1500
      })
      return;
    }else{
      var count = 5 - this.data.imgList.length;
    }
    wx.chooseImage({
      count: count,
      success: res =>{
        console.log(res.tempFilePaths);
        for (let i = 0; i < res.tempFilePaths.length;i++){
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
  deltelImage:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.data.imgList.splice(id,1);
    this.setData({
      imgList:this.data.imgList,
    })
  },
  //查看大图
  lookImageClick:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    wx.previewImage({
      current: this.data.imgList[id], // 当前显示图片的http链接
      urls: this.data.imgList// 需要预览的图片http链接列表
    })
  },

  //输入联系姓名
  bindinputName:function(e){
    this.setData({
      name:e.detail.value
    })
  },

  //输入联系人手机号码
  bindinputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },


  //点击申请按钮
  overClick:function(){
    if (this.data.houseName == "选择房源"){
      wx.showToast({
        title: '请选择房源',
        icon: 'none',
        duration: 1000
      })
      return;
    }else if(this.data.name.length == 0){
      wx.showToast({
        title: '请填写联系人',
        icon: 'none',
        duration: 1000
      })
      return;
    } else if (this.data.phone.length == 0) {
      wx.showToast({
        title: '请填写手机号码',
        icon: 'none',
        duration: 1000
      })
      return;
    } else if (this.data.typeName == "选择分类") {
      wx.showToast({
        title: '请选择分类',
        icon: 'none',
        duration: 1000
      })
      return;
    } else if (this.data.time == "选择时间") {
      wx.showToast({
        title: '请选择时间',
        icon: 'none',
        duration: 1000
      })
      return;
    } else if (this.data.tdesc == "") {
      wx.showToast({
        title: '请填写具体问题描述',
        icon: 'none',
        duration: 1000
      })
      return;
    }
    wx.showLoading({
      title: '正在申请...',
    })
    if (this.data.imgList.length){
      var pictureList=[];
      var count = this.data.imgList.length;
      for (let i = 0; i < this.data.imgList.length;i++) {
        wx.uploadFile({
          method: "POST",
          url: utils.uploadUploadfileUrl,
          header: {
            "Authorization": app.globalData.userInfo.token,
          },
          filePath: this.data.imgList[i],
          name: 'file',
          success: res => {
            var data = JSON.parse(res.data);
            pictureList.push(data.data[0]);
            console.log(pictureList);
            count -= 1;
            if (count == 0){
              var picture = "";
              for(let j = 0;j < pictureList.length;j++){
                if (j <= pictureList.length - 2){
                  picture += pictureList[j] + ',';
                } else if (j == pictureList.length - 1){
                  picture += pictureList[j];
                  console.log(picture);
                  this.loadSqFunchtionAddPicture(picture);
               
                } 
              }
             
            }
          }
        })
      }
    }else{
      this.loadSqFunchtion();
    }
 
  },
  //申请报修保养带图片
  loadSqFunchtionAddPicture: function (picture) {
    var date = this.data.date + " " + this.data.time + ":00";
    console.log(date);
    wx.request({
      method: "POST",
      url: utils.repairBillUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data: {
        applyName: this.data.name,
        appointmentTimeString: date,
        connectPhone: this.data.phone,
        houseId: this.data.houseId,
        tdesc: this.data.tdesc,
        typeId: this.data.typeId,
        xqId: this.data.xqId,
        picture: picture
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200){
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            isBack: true,
          })
          wx.navigateBack({
            delta:1
          })
        }else{
          wx.showToast({
            title: "操作失败",
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },

  //申请报修保养不带图片
  loadSqFunchtion: function (){
    var date = this.data.date + " " + this.data.time + ":00";
    console.log(date);
    wx.request({
      method: "POST",
      url: utils.repairBillUrl,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      data:{
        applyName:this.data.name,
        appointmentTimeString: date,
        connectPhone:this.data.phone,
        houseId:  this.data.houseId,
        tdesc:this.data.tdesc,
        typeId:this.data.typeId,
        xqId:this.data.xqId,
      },
      success: res => {
        console.log(res);
        if (res.data.code == 200) {
          let pages = getCurrentPages();
          let prevPage = pages[pages.length - 2];
          prevPage.setData({
            isBack: true,
          })
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.showToast({
            title: "操作失败",
            icon: 'none',
            duration: 1000
          })
        }
      }
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