// pages/houseDetails/houseDetails.js
var utils = require('../../utils/url.js');
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    mapHidden:false,
    type:0,//刚刚进来请求为0
    houseInfoData:{},//房源详情
    selectHouse:'',//选择的房源
    isElevator:'',//是否有电梯
    sameTypeHousList:[],//同类型房源
    moreHouseListAction:true,
    currentImg:1,
    rentCost:0,
    picture:"",
    flag:true,
    indexOne:0,
    indexTwo:0,
    houseModel:[],
    scImage:'../../img/houseDetails/bb_hd_08@2x.png',
    markers: [{
      iconPath: '/img/tabBarImg/hdl2.png',
      width: 50,
      height: 50
    }],

  },
  //点击预览大图片
  previewlmg:function(e){
    console.log(e.currentTarget.dataset.id);
    var imgIdx = e.currentTarget.dataset.id;
    var imgs = this.data.houseInfoData.apartmentPicture;
    wx.previewImage({
      current:imgs[imgIdx],
      urls: imgs,
    })
  },
  //房源详情
  textIntroduceClick:function(){
    wx.navigateTo({
      url: '/pages/textIntroduce/textIntroduce?intro=' + this.data.houseInfoData.intro,
    })
  },
  //公寓介绍
  introduceClick:function(){
    wx.navigateTo({
      url: '/pages/apartmentIntroduced/apartmentIntroduced?apartmentId=' + this.data.houseInfoData.apartmentId,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 房源详情
   this.loadHouseInfoData(options.houseId);
    console.log(options.houseId);
  },
  //加载房源详情
  loadHouseInfoData: function (houseId){
    var token = app.globalData.userInfo.token;
    if(!token){
      token = "token";
    }
    wx.request({
      data: {
        houseId:houseId
      },
      header: {
        "Authorization": token,
      },
      url: utils.houseInfoUrl,
      success: res => {
        var isElevator = res.data.data.isElevator;
        var orElevator;
        if (isElevator == 0) {
          orElevator = "无";
        } else if (isElevator == 1) {
          orElevator = "有";
        }
        console.log(res);
        var image = '../../img/houseDetails/bb_hd_08@2x.png';
        if (res.data.data.isCollect == 1){
          image = '../../img/houseDetails/bb_hd_07@2x.png'
        }
        this.setData({
          houseInfoData: res.data.data,
          isElevator: orElevator,
          scImage:image
        })
        //获取已选房型
        this.roomTypes(res.data.data.roomTypes);
        //同类型房源
        this.requestloadTheSameTypeHousData(this.data.type);
      }
    }) 
  },

  //获取已选房型
  roomTypes: function (roomTypes){
    for (let i = 0; i < roomTypes.length;i++){
      for (let j = 0; j < roomTypes[i].roomType.length; j++){
        var obj = roomTypes[i].roomType[j];
        if (obj.select == 1){
          this.setData({
            selectHouse: obj.type
          })
        }
      }
    }
  },


  //同类型房源
  requestloadTheSameTypeHousData: function (type) {
    //同类型房源
    wx.request({
      url: utils.apartmentInfoListUrl + this.data.houseInfoData.apartmentId + '/' + type,
      success: res => {
        var moreHouseListAction = true;
        if (res.data.data.count > 5 && type == 0){
          moreHouseListAction = false;
        }else{
          moreHouseListAction = true;
        }
        this.setData({
          sameTypeHousList: res.data.data,
          moreHouseListAction:moreHouseListAction,
        })
      }
    })
  },

  //点击同公寓房源
  houseInfoClick:function(e){
    console.log(this.data.sameTypeHousList);
    console.log(e.currentTarget.dataset.id);
    // 房源详情
    this.loadHouseInfoData(this.data.sameTypeHousList.houses[e.currentTarget.dataset.id].houseId);
    
    wx.navigateTo({
      url: '/pages/houseLastDetails/houseLastDetails?houseId=' + this.data.sameTypeHousList.houses[e.currentTarget.dataset.id].houseId
      })
  },

  //滑动轮播图
  swiperbindtransition:function(e){
    console.log(e);
    var currentImg = e.detail.current + 1;
    this.setData({
      currentImg: currentImg
    })
  },
  //点击费用详情
  costDetailClick:function(){
    wx.navigateTo({
      url: '/pages/costDetail/costDetail?costDetail=' + JSON.stringify(this.data.houseInfoData.costDetail),
    })
  },

  //点击查看全部剩下的房源
  lookAllHouseListClick:function(){
    this.setData({
      type:1,
    })
    //同类型房源
    this.requestloadTheSameTypeHousData(this.data.type);
  },

  //联系房东
  contactClick:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.houseInfoData.contactNumber,
     })
  },
  //预约看房
  yyLookHouse:function(){
    var isLogin = this.isLogin();
    if (isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/seeLookHouse/seeLookHouse?houseId=' + this.data.houseInfoData.houseId,
      })
    }

  },
  //预定房源
  ydLookHouse:function(){
    var isLogin = this.isLogin();
    if (isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    } else {
      wx.navigateTo({
        url: '/pages/dueTohousing/dueTohousing?houseId=' + this.data.houseInfoData.houseId,
      })
    }
  },

  //收藏
  collectClick:function(){
    var isLogin = this.isLogin();
    if (isLogin) {
      wx.navigateTo({
        url: '/pages/login/login',
      })
    }else {
      if (this.data.houseInfoData.isCollect == 0) {
        wx.request({
          url: utils.houseCollectAddUrl + this.data.houseInfoData.houseId,
          header: {
            "Authorization": app.globalData.userInfo.token,
          },
          method: "POST",
          success: res => {
            console.log(res);
            if (res.data.code == 200) {
              var data = this.data.houseInfoData;
              data.isCollect = 1;
              wx.showToast({
                title: '收藏成功',
                icon: 'none',
                duration: 1500
              })
              this.setData({
                houseInfoData:data,
                scImage:"../../img/houseDetails/bb_hd_07@2x.png",
              })
            }
          }
        })
      } else {
        wx.request({
          url: utils.houseCollectCancelUrl + this.data.houseInfoData.houseId,
          header: {
            "Authorization": app.globalData.userInfo.token,
          },
          method: "POST",
          success: res => {
            console.log(res);
            if (res.data.code == 200) {
              var data = this.data.houseInfoData;
              data.isCollect = 0;
              wx.showToast({
                title:'已取消收藏',
                icon: 'none',
                duration: 1500
              })
              this.setData({
                houseInfoData: data,
                scImage: "../../img/houseDetails/bb_hd_08@2x.png",
              })
            }
          }
        })
      } 
    }
   
  },

  //选择房型
  chooseHouseModelClick:function(){
    var picture = '';
    var rentCost = 0;
    var indexOne = 0;
    var indexTwo = 0;
    var houseModel=[];     
    var roomTypes = this.data.houseInfoData.roomTypes;
    for (let i = 0; i < roomTypes.length;i++){
      if (roomTypes[i].select == 1){
        indexOne = i;
        houseModel = roomTypes[i].roomType;
        for (let j = 0; j < roomTypes[i].roomType.length; j++){
          if (roomTypes[i].roomType[j].select == 1){
            indexTwo = j;
          }
        }
      }
    }
    this.setData({
      flag:false,
      picture:picture,
      rentCost:rentCost,
      indexOne:indexOne,
      houseModel:houseModel,
      indexTwo:indexTwo,
      mapHidden:true,
    })
  },
  //点击付款类型
  roomTypesClick:function(e){
    console.log(e);
    var id = e.currentTarget.dataset.id;
    var houseModel = this.data.houseInfoData.roomTypes[id].roomType;
    console.log(houseModel);
    var indexTwo = 0;
    for (let j = 0; j < houseModel.length; j++) {
      if (houseModel[j].select == 1) {
        indexTwo = j;
      }
    }
    this.setData({
      indexOne:id,
      houseModel:houseModel,
      indexTwo: indexTwo,
      selectHouse: houseModel[indexTwo].type,
    })
  },
  //点击房型
  roomTypeClick: function (e) {
    console.log(e);
    var id = e.currentTarget.dataset.id;
    this.setData({
      indexTwo: id,
      selectHouse:this.data.houseModel[id].type,
    })
  },
  //点击蒙版关闭
  closeMastClick:function(){
    this.setData({
      flag: true,
      mapHidden:false,
    })
  },
  //closeMaskClick点击关闭按钮
  closeMaskClick:function(){
    this.setData({
      flag: true,
      mapHidden: false,
    })
  },
  //阻止穿透
  stopTap:function(){

  },
  //选择房型后确定按钮
  selcetHouseModelAction:function(){
    var tonken;
    if (app.globalData.userInfo.token){
      tonken = app.globalData.userInfo.token;
    }else{
      tonken = "";
    }
    this.setData({
      flag: true,
      mapHidden:false,
    })
    console.log(this.data.houseInfoData.roomTypes[this.data.indexOne].roomType[this.data.indexTwo]);
    if (this.data.houseInfoData.roomTypes[this.data.indexOne].roomType[this.data.indexTwo].isVacant == 0){
      wx.showToast({
        title: '很抱歉，该模板没有空房',
        icon: 'none',
        duration: 2000
      })
      return
    }
    wx.request({
      url: utils.houseTypeInfoUrl,
      header: {
        "Authorization": tonken,
      },
      data:{
        apartmentId: this.data.houseInfoData.apartmentId,
        area: this.data.houseInfoData.roomTypes[this.data.indexOne].roomType[this.data.indexTwo].area,
        bathRoom: this.data.houseInfoData.roomTypes[this.data.indexOne].roomType[this.data.indexTwo].bathRoom,
        bedRoom: this.data.houseInfoData.roomTypes[this.data.indexOne].roomType[this.data.indexTwo].bedRoom,
        hall: this.data.houseInfoData.roomTypes[this.data.indexOne].roomType[this.data.indexTwo].hall,
        rentCost: this.data.houseInfoData.roomTypes[this.data.indexOne].roomType[this.data.indexTwo].rentCost,
      },
      success:res =>{
        console.log("=====================");
        console.log(res);
        if(res.data.code == 200){
          this.setData({
            houseInfoData: res.data.data || [],
          })
        }else{
          wx.showToast({
            title: '网络连接异常',
            icon: 'none',
            duration: 2000
          })
        }
      }
    })
  },

  //判断是否需要登录
  isLogin: function () {
    if (!app.globalData.userInfo.token) {
      return true;
    } else {
      return false;
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