const getDateArray = (timestampmillisecond) => {
  var aArray = []
  // 获取时间
  var mydate = new Date()
  if (timestampmillisecond) {
    mydate = new Date(timestampmillisecond)
  }
  var gettime = mydate.getTime()
  // 年
  var year = '' + mydate.getFullYear()
  var date = ''
  var getHours = ''
  var getMinutes = ''
  var getSeconds = ''
  var Month = ''
  // 月
  if ((mydate.getMonth() + 1) >= 1 && (mydate.getMonth() + 1) <= 9) {
    Month = '0' + (mydate.getMonth() + 1)
  } else {
    Month = '' + (mydate.getMonth() + 1)
  }
  // 日
  if (mydate.getDate() >= 1 && mydate.getDate() <= 9) {
    date = '0' + mydate.getDate()
  } else {
    date = '' + mydate.getDate()
  }
  // 时
  if (mydate.getHours() >= 1 && mydate.getHours() <= 9) {
    getHours = '0' + mydate.getHours()
  } else {
    getHours = '' + mydate.getHours()
  }
  // 分
  if (mydate.getMinutes() >= 0 && mydate.getMinutes() <= 9) {
    getMinutes = '0' + mydate.getMinutes()
  } else {
    getMinutes = '' + mydate.getMinutes()
  }
  // 秒
  if (mydate.getSeconds() >= 0 && mydate.getSeconds() <= 9) {
    getSeconds = '0' + mydate.getSeconds()
  } else {
    getSeconds = '' + mydate.getSeconds()
  }
  aArray[0] = gettime
  aArray[1] = Month
  aArray[2] = date
  aArray[3] = getHours
  aArray[4] = getMinutes
  aArray[5] = getSeconds
  aArray[7] = year + '-' + Month + '-' + date
  aArray[8] = year + '-' + Month + '-' + date + ' ' + getHours + ':' + getMinutes
  aArray[9] = year + '-' + Month + '-' + date + ' ' + getHours + ':' + getMinutes + ':' + getSeconds
  aArray[10] = year + '.' + Month + '.' + date
  aArray[11] = getHours + ':' + getMinutes + ':' + getSeconds
  aArray[12] = Month + '.' + date + ' ' + getHours + ':' + getMinutes + ':' + getSeconds
  aArray[13] = year + '.' + Month + '.' + date + ' ' + getHours + ':' + getMinutes
  aArray[14] = year + '/' + Month + '/' + date
  aArray[15] = Month + '.' + date + ' ' + ' ' + getHours + ':' + getMinutes
  aArray[16] = year + '.' + Month + '.' + date
  aArray[17] = year + '.' + Month + '.' + date + ' ' + getHours + ':' + getMinutes + ':' + getSeconds

  return aArray
}
module.exports = {
  getDateArray
}
