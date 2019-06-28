const app = getApp()

// 微信请求api

let requestApi = function(method, url, data) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: httpUrl + url,
      data: data || {},
      method: method,
      header: {
        "Authorization": app.globalData.userInfo.token,
      },
      success: (res => {
        resolve(res)
      }),
      fail: (err => {
        reject(err)
        console.log(err)
      })
    })
  })
}

// // 我是管理员
var httpUrl = "https://www.ubicell.cn/apartment";
// var httpUrl = "http://192.168.0.145:8080";
// var httpUrl = "http://192.168.0.180:8080";


// 用户确定绑定银行卡
const bindUserCardReSure = (params) => {
  return requestApi("post", "/userCar/bindUserCardReSure", params)
}

// 用户绑定银行卡
const userCarbindUserCard = (params) => {
  return requestApi("post", "/userCar/bindUserCard", params)
}

// 用手机号修改用户锁密码
const updateLockPassWordByPhone = (params) => {
  return requestApi("post", "/hydroelectric/updateLockPassWordByPhone/" + params.houseId + "/" + params.passWordNew)
}

// 消息通知中心 - 置未读为已读
const readNotice = (msgId) => {
  return requestApi("post", "/notice/read/" + msgId)
}

// 获取手机验证码
const getVerifyCode = (params) => {
  return requestApi("post", "/apVerifyCode/getVerifyCode/" + params.phoneNum)
}

// 验证手机验证码
const verifyCode = (params) => {
  return requestApi("post", "/apVerifyCode/verifyCode/" + params.code + "/" + params.phoneNum)
}
// 原生扫码支付
let wNativePay = (params) => {
  return requestApi("post", "/icbc/wNativePay/" + params.orderId + "/" + params.payType)
}
// 城市选择请求接口
var locationUrl = httpUrl + "/v1.0/web/house/location";
//房源列表
var houseListUrl = httpUrl + "/v1.0/web/house/list";
//精品房源列表
var houseListBoutiqueUrl = httpUrl + "/v1.0/web/house/list/boutique";
//首页轮播图
var houseIndexUrl = httpUrl + "/v1.0/web/house/index";
//房源详情
var houseInfoUrl = httpUrl + "/v1.0/web/house/info";
//登录发送code
var userAccessUrl = httpUrl + "/user/access";
//注册发送验证码
var registerCodeUrl = httpUrl + "/user/register/code";
//注册
var registerUrl = httpUrl + "/user/register";

//预约列表
var reservationlistUrl = httpUrl + "/v1.0/web/reservation/list";
//预约列表详情
var reservationDetailsUrl = httpUrl + "/v1.0/web/reservation/detail";
//单个房源数据
var houseOneUrl = httpUrl + "/v1.0/web/house/one/";
//用户发布预约房源
var reservationSaveUrl = httpUrl + "/v1.0/web/reservation/save";
//公寓详情
var apartmentInfoUrl = httpUrl + "/v1.0/web/apartment/info/";
//同公寓其他房源列表
var apartmentInfoListUrl = httpUrl + "/v1.0/web/apartment/house/list/";
//收藏房源
var houseCollectAddUrl = httpUrl + "/v1.0/web/house/collect/add/";
//收藏房源
var houseCollectCancelUrl = httpUrl + "/v1.0/web/house/collect/cancel/";
//收藏房源列表
var houseCollectListUrl = httpUrl + "/v1.0/web/house/collect/list";
//预定房源
var advanceorderSaveUrl = httpUrl + "/v1.0/web/advanceorder/save";
//我的预定房源列表
var advanceorderListUrl = httpUrl + "/v1.0/web/advanceorder/list";
//预定列表详情
var advanceorderDetailsUrl = httpUrl + "/v1.0/web/advanceorder/detail";
//我的租约列表
var leaseListUrl = httpUrl + "/v1.0/web/lease/list";
//租约详情
var leaseDetailUrl = httpUrl + "/v1.0/web/lease/detail/";
//租约合同
var leaseContractUrl = httpUrl + "/v1.0/web/lease/contract/";
//租约账单
var leaseBillsUrl = httpUrl + "/v1.0/web/lease/bills/";
//账单支付
var leaseBillsPayUrl = httpUrl + "/v1.0/web/lease/bills/pay";
//确认租约
var leaseConfirmUrl = httpUrl + "/v1.0/web/lease/confirm/";
//获取有权限的门禁设备
var hydroelectricGetControlDevUrl = httpUrl + "/hydroelectric/getControlDev";
//网络远程开门
var hydroelectricOpenDoorUrl = httpUrl + "/hydroelectric/openDoor";
//获取通行证二维码
var hydroelectricGetQrCodeDataUrl = httpUrl + "/hydroelectric/getQrCodeData/";
//入住人信息
var leaseTenantlistUrl = httpUrl + "/v1.0/web/lease/tenant/list";
//报修保养列表
var repairGetRepairListUrl = httpUrl + "/repair/getRepairList";
//申请报修保养中房原信息Url
var hydroelectricGetGyAndHouseListUrl = httpUrl + "/hydroelectric/getGyAndHouseList";
//申请报修保养
var repairBillUrl = httpUrl + "/repair/bill";
//修改资料
var userUpdateUrl = httpUrl + "/user/update";
//修改手机号码
var userPhoneUpdateUrl = httpUrl + "/user/phone/update";
//个人中心消息个数
var noticeCenterListUrl = httpUrl + "/notice/center/list";
//消息盒子
var noticeCenterUrl = httpUrl + "/notice/list";
//消息红点判断
var noticeListRemindUrl = httpUrl + "/notice/list/remind";

// let noticeListRemindUrl = (params) => { return requestApi("/notice/list/remind", "post", params) } 

//房源详情(从房型入口勾选进入)
var houseTypeInfoUrl = httpUrl + "/v1.0/web/house/type/info";
//水电表列表
var hydroelectricGetCurrentDevInfoUrl = httpUrl + "/hydroelectric/getCurrentDevInfo";
//单个水电表列表
var hydroelectricGetDevInfoUrl = httpUrl + "/hydroelectric/getDevInfo/";
//上传图片
var uploadUploadfileUrl = httpUrl + "/upload/uploadfile";
//获取维修单详情
var repairGetDetailUrl = httpUrl + "/repair/getDetail/";
// 取消保修保养的申请
var repairRecallUrl = httpUrl + "/repair/recall/";

//预定支付
var wechatPaycreateUrl = httpUrl + "/icbc/comPay";
// var wechatPaycreateUrl = httpUrl + "/wechat/paycreate/";
// 工银小程序支付订单
var icbcComPay = wechatPaycreateUrl;

//房源列表集中式房源
var adminHouseListUrl = httpUrl + "/v1.0/admin/house/list";
//待办事项
var adminTodoUrl = httpUrl + "/v1.0/admin/index/todo";
var adminReservationListUrl = httpUrl + "/v1.0/admin/reservation/list";
var adminAdvanceListUrl = httpUrl + "/v1.0/admin/advance/list";
var adminLeaseListUrl = httpUrl + "/v1.0/admin/lease/list";
var adminSelectUrl = httpUrl + "/v1.0/admin/apartment/select";
var adminPropertyGetRepairListUrl = httpUrl + "/property/getRepairList";
// 水电表抄表
var adminhydroelectricshowAndUpAllDevUrl = httpUrl + "/hydroelectric/showAndUpAllDev/";

// 数据报表/总账单
const adminIndexbilltotal = (params) => {
  return requestApi("post", "/v1.0/admin/index/bill/total", params)
}
// 数据报表/未来预计收入
const adminIndexbillfuture = (params) => {
  return requestApi("post", "/v1.0/admin/index/revenue/future", params)
}
// 数据报表/快到期合同
const adminIndexWillExpired = (params) => {
  return requestApi("post", "/v1.0/admin/index/contract/expired/" + params.day)
}
// 数据报表/已到期合同
const adminIndexBeExpired = (params) => {
  return requestApi("post", "/v1.0/admin/index/contract/expired", params)
}

// 数据报表 ---流水统计 
const getDataTableWithWater = (params) => {
  return requestApi("post", "/v1.0/admin/report/statements/list", params)
}

// 数据报表 ---账单统计 
const getDataTableWithBill = (params) => {
  return requestApi("post", "/v1.0/admin/report/bills/list", params)
}

// 流水账单 ---交易流水 
const getBusinessWater = (params) => {
  return requestApi("post", "/v1.0/admin/report/business/list", params)
}

// 用户设置支付密码
const setCardPassWord = (params) => {
  return requestApi("post", "/userCar/setCardPassWord/" + params.isNoPass + "/" + params.psw)
}

// 通过房间查询清分信息
const getDistributionByHouseId = (params) => {
  return requestApi("post", "/userCar/getDistributionByHouseId/" + params.houseId)
}

// 用户银行卡支付
const payByBankCar = (params) => {
  return requestApi("post", "/userCar/payByBankCar", params)
}

// 查询银行卡支付结果
const getCardPayStatus = (params) => {
  return requestApi("post", "/userCar/getCardPayStatus", params)
}

// 获取用户绑定的银行卡
const getBindUserCardInfo = (params) => {
  return requestApi("post", "/userCar/getBindUserCardInfo", params)
}

// 删除用户绑定的银行卡
const delBindUserCardInfo = (params) => {
  return requestApi("post", "/userCar/delBindUserCardInfo/" + params.id)
}


module.exports = {
  getBindUserCardInfo,
  delBindUserCardInfo,
  getCardPayStatus,
  payByBankCar,
  getDistributionByHouseId,
  setCardPassWord,
  bindUserCardReSure,
  userCarbindUserCard,
  readNotice,
  updateLockPassWordByPhone,
  verifyCode,
  getVerifyCode,
  icbcComPay,
  locationUrl,
  houseListUrl,
  houseIndexUrl,
  houseInfoUrl,
  userAccessUrl,
  registerCodeUrl,
  registerUrl,
  wechatPaycreateUrl,
  reservationlistUrl,
  reservationDetailsUrl,
  houseListBoutiqueUrl,
  houseOneUrl,
  reservationSaveUrl,
  apartmentInfoUrl,
  apartmentInfoListUrl,
  houseCollectAddUrl,
  houseCollectCancelUrl,
  houseCollectListUrl,
  advanceorderSaveUrl,
  advanceorderListUrl,
  advanceorderDetailsUrl,
  leaseListUrl,
  leaseDetailUrl,
  leaseContractUrl,
  leaseBillsUrl,
  leaseBillsPayUrl,
  leaseConfirmUrl,
  hydroelectricGetControlDevUrl,
  hydroelectricOpenDoorUrl,
  hydroelectricGetQrCodeDataUrl,
  leaseTenantlistUrl,
  repairGetRepairListUrl,
  userUpdateUrl,
  userPhoneUpdateUrl,
  noticeCenterListUrl,
  noticeCenterUrl,
  noticeListRemindUrl,
  houseTypeInfoUrl,
  hydroelectricGetCurrentDevInfoUrl,
  hydroelectricGetDevInfoUrl,
  hydroelectricGetGyAndHouseListUrl,
  repairBillUrl,
  uploadUploadfileUrl,
  repairGetDetailUrl,
  repairRecallUrl,
  adminHouseListUrl,
  adminTodoUrl,
  adminReservationListUrl,
  adminAdvanceListUrl,
  adminLeaseListUrl,
  adminSelectUrl,
  adminPropertyGetRepairListUrl,
  adminhydroelectricshowAndUpAllDevUrl,
  adminIndexbilltotal,
  adminIndexbillfuture,
  wNativePay,
  getBusinessWater,
  adminIndexWillExpired,
  adminIndexBeExpired,
  getDataTableWithWater,
  getDataTableWithBill
}


/************************************** ==== 测试服务器 ==== **************************************/



// // 城市选择请求接口
// var locationUrl = "http://192.168.0.187:8080/v1.0/web/house/location";
// //房源列表
// var houseListUrl = "http://192.168.0.187:8080/v1.0/web/house/list";
// //精品房源列表
// var houseListBoutiqueUrl = "http://192.168.0.187:8080/v1.0/web/house/list/boutique";
// //首页轮播图
// var houseIndexUrl = "http://192.168.0.187:8080/v1.0/web/house/index";
// //房源详情
// var houseInfoUrl = "http://192.168.0.187:8080/v1.0/web/house/info";
// //登录发送code
// var userAccessUrl = "http://192.168.0.187:8080/user/access";
// //注册发送验证码
// var registerCodeUrl = "http://192.168.0.187:8080/user/register/code";
// //注册
// var registerUrl = "http://192.168.0.187:8080/user/register";
// //预定支付
// var wechatPaycreateUrl = "http://192.168.0.187:8080/wechat/paycreate/";
// //预约列表
// var reservationlistUrl = "http://192.168.0.187:8080/v1.0/web/reservation/list";
// //预约列表详情
// var reservationDetailsUrl = "http://192.168.0.187:8080/v1.0/web/reservation/detail";
// //单个房源数据
// var houseOneUrl = "http://192.168.0.187:8080/v1.0/web/house/one/";
// //用户发布预约房源
// var reservationSaveUrl = "http://192.168.0.187:8080/v1.0/web/reservation/save";
// //公寓详情
// var apartmentInfoUrl = "http://192.168.0.187:8080/v1.0/web/apartment/info/";
// //同公寓其他房源列表
// var apartmentInfoListUrl = "http://192.168.0.187:8080/v1.0/web/apartment/house/list/";
// //收藏房源
// var houseCollectAddUrl = "http://192.168.0.187:8080/v1.0/web/house/collect/add/";
// //收藏房源
// var houseCollectCancelUrl = "http://192.168.0.187:8080/v1.0/web/house/collect/cancel/";
// //收藏房源列表
// var houseCollectListUrl = "http://192.168.0.187:8080/v1.0/web/house/collect/list";
// //预定房源
// var advanceorderSaveUrl = "http://192.168.0.187:8080/v1.0/web/advanceorder/save";
// //我的预定房源列表
// var advanceorderListUrl = "http://192.168.0.187:8080/v1.0/web/advanceorder/list";
// //预定列表详情
// var advanceorderDetailsUrl = "http://192.168.0.187:8080/v1.0/web/advanceorder/detail";
// //我的租约列表
// var leaseListUrl = "http://192.168.0.187:8080/v1.0/web/lease/list";
// //租约详情
// var leaseDetailUrl = "http://192.168.0.187:8080/v1.0/web/lease/detail/";
// //租约合同
// var leaseContractUrl = "http://192.168.0.187:8080/v1.0/web/lease/contract/";
// //租约账单
// var leaseBillsUrl = "http://192.168.0.187:8080/v1.0/web/lease/bills/";
// //账单支付
// var leaseBillsPayUrl = "http://192.168.0.187:8080/v1.0/web/lease/bills/pay";
// //确认租约
// var leaseConfirmUrl = "http://192.168.0.187:8080/v1.0/web/lease/confirm/";
// //获取有权限的门禁设备
// var hydroelectricGetControlDevUrl = "http://192.168.0.180:8080/hydroelectric/getControlDev";
// //网络远程开门
// var hydroelectricOpenDoorUrl = "http://192.168.0.187:8080/hydroelectric/openDoor";
// //获取通行证二维码
// var hydroelectricGetQrCodeDataUrl = "http://192.168.0.180:8080/hydroelectric/getQrCodeData/";
// //入住人信息
// var leaseTenantlistUrl = "http://192.168.0.180:8080/v1.0/web/lease/tenant/list";
// //报修保养列表
// var repairGetRepairListUrl = "http://192.168.0.145:8080/repair/getRepairList";
// //申请报修保养中房原信息Url
// var hydroelectricGetGyAndHouseListUrl = "http://192.168.0.145:8080/hydroelectric/getGyAndHouseList";
// //申请报修保养
// var repairBillUrl = "http://192.168.0.145:8080/repair/bill";
// //修改资料
// var userUpdateUrl = "http://192.168.0.187:8080/user/update";
// //修改手机号码
// var userPhoneUpdateUrl = "http://192.168.0.187:8080/user/phone/update";
// //个人中心消息个数
// var noticeCenterListUrl = "http://192.168.0.187:8080/notice/center/list";
// //消息盒子
// var noticeCenterUrl = "http://192.168.0.187:8080/notice/list";
// //消息红点判断
// var noticeListRemindUrl = "http://192.168.0.187:8080/notice/list/remind";
// //房源详情(从房型入口勾选进入)
// var houseTypeInfoUrl = "http://192.168.0.187:8080/v1.0/web/house/type/info";
// //水电表列表
// var hydroelectricGetCurrentDevInfoUrl = "http://192.168.0.145:8080/hydroelectric/getCurrentDevInfo";
// //单个水电表列表
// var hydroelectricGetDevInfoUrl = "http://192.168.0.145:8080/hydroelectric/getDevInfo/";
// //上传图片
// var uploadUploadfileUrl = "http://192.168.0.187:8080/upload/uploadfile";
// //获取维修单详情
// var repairGetDetailUrl = "http://192.168.0.145:8080/repair/getDetail/";
// //取消保修保养的申请
// var repairRecallUrl = "http://192.168.0.145:8080/repair/recall/";
