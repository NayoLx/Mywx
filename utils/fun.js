module.exports = {
  dataUrl : "http://192.168.0.145:8080/basic/web/index.php",
  getscgedular: getscgedular,
}

/**
   * 获取课表
   */
function getscgedular(schoolyear, semester) {
  var that = this
  wx.request({
    // url: 'http://localhost:8080/login2.3/newphp/new.php',
    url: Da.dataUrl + '?r=my/acgedular',
    data: {
      schoolyear: schoolyear,
      semester: semester
    },
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
      // 'Content-Type': 'application/json'
    },
    method: 'POST',
    success: function (res) {
      that.setData({
        scge: res.data,
      })
      console.log(res.data)
    },
    fail: function (res) {
      console.log(res.data)
    },
    complete: function (res) { },
  })
}
