var Public = require("../../utils/pubic.js");
var check = require("../../utils/fun.js");
var utils = require("../../utils/utils.js");
var toast = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    home: [],
    hasAuthUserInfo: false, // 是否授权用户信息权限
    modalChooseStuNumHidden: true,
    modalChooseIdcardHidden: true,
    is_bind: '',
    checkText: '',
    codenum: '获取验证码',
    usernumber: '',
    password: '',
    nullInput: '',
    code: '',
    phone: '',
    idcard: '',
    name: ''
  },
  /***
   * 获取输入框的值
   */
  userNameInput: function(e) {
    this.setData({
      usernumber: e.detail.value
    })
  },
  passwordInput: function(e) {
    this.setData({
      password: e.detail.value
    })
  },
  phoneInput: function(e) {
    this.setData({
      phone: e.detail.value
    })
  },
  codeInput: function(e) {
    this.setData({
      code: e.detail.value
    })
  },
  idCardInput: function(e) {
    this.setData({
      idcard: e.detail.value
    })
  },
  nameInput: function(e) {
    this.setData({
      name: e.detail.value
    })
  },
  /**
   * 检查是否已获得用户授权
   */
  checkAuthUserInfo: function() {
    var me = this;
    if (wx.getSetting) {
      wx.getSetting({
        success: function(res) {
          var hasAuthUserInfo = false;
          if (res.authSetting['scope.userInfo']) {
            console.log(res)
            hasAuthUserInfo = true;
          }
          me.setData({
            hasAuthUserInfo: hasAuthUserInfo
          })
        }
      })
    }
  },

  onGotUserInfo: function(res) {
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        home: res.detail.userInfo
      })
      Public.timeShow('已更新', 1000)
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var res = wx.getStorageSync('home')

    if (wx.getStorageSync('openid') == '') {
      wx.setStorageSync('openid', res.openid)
    }
    
    this.setData({
      home: res
    })
    if (this.data.home != '') {
      wx.removeStorageSync('home')
      wx.removeStorageSync('check')
    }
  },

  // 绑定学号modal
  modalChoose: function() {
    var that = this
    wx.request({
      url: 'http://localhost:8080/basic/web/index.php?r=my/checkstuname',
      data: {
        openid: this.data.home.openid,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        if (res.data.state == true) {
          Public.show('此账号已绑定')
        } else {
          that.setData({
            modalChooseStuNumHidden: false
          })
        }
      },
      fail: function(res) {
        console.log('error')
      },
      complete: function(res) {},
    })

  },

  /**
   * 实名判断 
   */
  onCheckName: function() {
    var that = this
    wx.request({
      url: 'http://localhost:8080/basic/web/index.php?r=my/checkidcard',
      data: {
        openid: this.data.home.openid,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.state == true) {
          Public.show('此账号已验证')
        } else {
          that.setData({
            modalChooseIdcardHidden: false
          })
        }
      },
      fail: function (res) {
        console.log('error')
      },
      complete: function (res) { },
    })
  },

  onCheckCard:function() {
    var that = this
    wx.request({
      url: 'http://localhost:8080/basic/web/index.php?r=my/isidcard',
      data: {
        openid: this.data.home.openid,
        idcard: this.data.idcard,
        name: this.data.name
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.statusCode)
        if (res.data == true)
        {
          Public.show('绑定成功')
          that.actionCancel()
        }
        else {
          Public.show('绑定失败，请检查身份证')
        }
      },
      fail: function (res) {
        console.log('error')
      },
      complete: function (res) { },
    })
  },

  actionCancel: function() {
    this.setData({
      modalChooseStuNumHidden: true,
      modalChooseIdcardHidden: true,
      usernumber: '',
      password: '',
      nullInput: '',
      code: '',
      phone: '',
      idcard: '',
      name: '',
    })
    wx.removeStorageSync('check')
  },

  bingStuDetail: function() {
    var that = this
    that.oncheck()

    // 显示正在加载...
    toast.showLoading()

    if (this.data.checkText == 'false') {

      // 隐藏正在加载...
      toast.hideLoading()
      Public.show('账号密码输入错误')
    } else if (utils.isEmpty(this.data.phone)) {
      Public.show('请输入号码')
    } else if (this.data.code != this.data.codenum) {
      Public.show('请输入正确的验证码')
    } else if (!utils.isMobile(this.data.phone)) {
      Public.show('请输入正确的手机号码')
    } else {
      wx.request({
        url: 'http://localhost:8080/basic/web/index.php?r=my/savebinddetail',
        data: {
          openid: this.data.home.openid,
          usernumber: this.data.usernumber,
          password: this.data.password,
          phone: this.data.phone,
          is_bind: this.data.checkText,
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
          // 'Content-Type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          console.log(res.statusCode)
          Public.show('绑定成功')
          that.actionCancel()
        },
        fail: function(res) {
          console.log('error')
        },
        complete: function(res) {},
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    wx.removeStorageSync('home')
  },
  /**
   * 随机数生成
   */
  createCode: function() {
    var codenum = '';
    var codeLength = 4;

    var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
    for (var i = 0; i < codeLength; i++) {
      var index = Math.floor(Math.random() * 10);
      codenum += random[index];
    }
    this.setData({
      codenum: codenum
    })
  },
  creatnum: function() {
    this.createCode()
  },

  oncheck: function() {
    var that = this;
    wx.request({
      // url: 'http://localhost:8080/login2.3/newphp/login.php',
      url: 'http://localhost:8080/basic/web/index.php?r=my/loginpost',
      data: {
        username: this.data.usernumber,
        password: this.data.password
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data)
        if (res.data.state) {
          Public.show('success')
          that.setData({
            checkText: true
          })
        } else {
          Public.show('fail')
          that.setData({
            checkText: false
          })
        }
      },
      fail: function(res) {
        console.log(res.data)
      },
      complete: function(res) {},
    })
  },

  jumpOnScgedular: function(e) {
    wx.navigateTo({
      url: '../scgedular/scgedular',
    })

  },

  /**appid只有企业账号认证后才有权限**/
  // getPhoneNumber: function (e) {
  //   console.log(e.detail.errMsg)
  //   console.log(e.detail.iv)
  //   console.log(e.detail.encryptedData)
  //   if (e.detail.errMsg == 'getPhoneNumber:fail user deny') {
  //     wx.showModal({
  //       title: '提示',
  //       showCancel: false,
  //       content: '未授权',
  //       success: function (res) { }
  //     })
  //   } else {
  //     wx.showModal({
  //       title: '提示',
  //       showCancel: false,
  //       content: '同意授权',
  //       success: function (res) { }
  //     })
  //   }
  // },

  ondetail: function() {
    wx.navigateTo({
      url: 'mydetail/index',
    })
  }
})