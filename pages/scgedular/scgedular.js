// pages/scgedular/scgedular.js
var Public = require("../../utils/pubic.js");
var Da = require("../../utils/fun.js");
var toast = require("../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    year: '',
    semester: '',
    IndexYear: 0,
    IndexSemester: 0,
    Index: [0, 0],
    loadingHide: true,
  },
  /**
   * 显示按钮
   */
  showLogin() {
    this.setData({
      login: true,
      table: true,
      worryimg: false
    })
    
  },
  hideLogin() {
    this.setData({
      login: false,
      table: false,
      worryimg: true
    })
  },

  /**
   * 跳转登陆
   */
  login: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },

  toMap: function() {
    wx.navigateTo({
      url: '../map/map',
    })
  },
  
  /**
   * 清除缓存
   */
  outLogin: function() {
    var that = this
    wx.showModal({
      title: "提示",
      content: "是否退出账号",
      success: function(res) {
        if (res.confirm) {
          Public.remove('id')
          that.showLogin()
        }
        else {
          console.log('弹框后点取消')
        }
      }
    })
  },

  /**
   * 获取学期学年
   */
  bindCasPickerChangeAll: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      Index: e.detail.value
    })
    console.log(this.data.Index[0])
    this.clearList();
  },
  clearList() {
    this.setData({
      year: this.data.scge.stugrade[0][this.data.Index[0]],
      semester: this.data.scge.stugrade[1][this.data.Index[1]],
    })
    console.log("学年:" + this.data.year + " 学期:" + this.data.semester);
    this.getscgedular();
  },
  /**
   * 获取课表
   */
  getscgedular: function() {
    // 显示正在加载...
    toast.showLoading()

    var that = this
    wx.request({
      // url: 'http://localhost:8080/login2.3/newphp/new.php',
      url: Da.dataUrl + '?r=my/acgedular',
      data: {
        schoolyear: this.data.year,
        semester: this.data.semester
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function(res) {

        // 隐藏加载提示
        toast.hideLoading()
        
        that.setData({
          scge: res.data,
          loadingHide: true
        })
        console.log(res.data)
      },
      fail: function(res) {
        console.log(res.data)
      },
      complete: function(res) {},
    })
  },

  /**
   * 登陆按钮
   */
  onShow: function(options) {
    var a = wx.getStorageSync('id')
    if (a != '') {
      this.hideLogin()
    } else {
      this.showLogin()
    }
  },

  /**
   * 首页判断
   */
  modalTap: function(e) {

    // 隐藏加载提示
    toast.hideLoading()
    
    wx.showModal({
      title: "提示",
      content: "您需要登陆后才能看到课表",
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   * 判断是否已登录
   */
  onLoad: function(options) {
    var a = wx.getStorageSync('id')

    // 显示正在加载...
    toast.showLoading()

    if (a != '') {
      var that = this
      wx.request({
        // url: 'http://localhost:8080/login2.3/newphp/new.php',
        url: Da.dataUrl +'?r=my/acgedular',
        data: {
          schoolyear: 2018,
          semester: 1
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
          // 'Content-Type': 'application/json'
        },
        method: 'POST',
        success: function(res) {

          // 隐藏加载提示
          toast.hideLoading()

          that.setData({
            scge: res.data,
            loadingHide: true
          })
          console.log(res.data)
        },
        fail: function(res) {
          console.log(res.data)
        },
        complete: function(res) {},
      })
    } else {
      this.modalTap()
    }
  },

  onGotUserInfo: function (res) {
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        home: res.detail.userInfo
      })
    }
  }
})