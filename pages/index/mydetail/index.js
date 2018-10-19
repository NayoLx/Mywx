//index.js
//获取应用实例
const app = getApp()
var Public = require("../../../utils/pubic.js");
var Da = require("../../../utils/fun.js");
var toast = require("../../../utils/util.js");

Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    winWidth: 0,
    winHeight: 0,
    currentTab: 0,
    loadingHide: false,
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
          that.showSwiper()
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },
  /**
   * 显示按钮
   */
  showSwiper() {
    this.setData({
      swiper: true,
      login: true,
      worryimg: false
    })
  },
  hideSwiper() {
    this.setData({
      swiper: false,
      login: false,
      worryimg: true
    })
  },

  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 跳转登陆
   */
  login: function() {
    wx.navigateTo({
      url: '../login/login',
    })
  },
  /**
   * 登陆判断
   */
  modalTap: function(e) {
    // 隐藏加载提示
    toast.hideLoading()

    wx.showModal({
      title: "提示",
      content: "您需要登陆后才能看到个人信息",
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

  onShow: function(e) {
    
  },

  onLoad: function(e) {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var that = this;
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
    // 显示正在加载...
    toast.showLoading()

    var a = wx.getStorageSync('id')
    var openid = wx.getStorageSync('openid')

    if (a != '') {
      this.hideSwiper()
      var that = this
      wx.request({
        // url: 'http://localhost:8080/login2.3/newphp/new.php',
        url: Da.dataUrl + '?r=my/bindpersonal',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
          // 'Content-Type': 'application/json'
        },
        data: {
          openid: openid
        },
        method: 'POST',
        success: function (res) {

          // 显示正在加载...
          toast.hideLoading()

          that.setData({
            person: res.data,
            loadingHide: true,
          })
          console.log(res.data)
        },
        fail: function (res) {
          console.log(res.data)
        },
        complete: function (res) { },
      }),
        wx.request({
          url: Da.dataUrl + '?r=my/bindobligatory',
          header: {
            "Content-Type": "application/x-www-form-urlencoded"
            // 'Content-Type': 'application/json'
          },
          data: {
            openid: openid
          },
          method: 'POST',
          success: function (ob) {
            that.setData({
              obligatory: ob.data,
              loadingHide: true,
            })
            console.log(ob.data)
          },
          fail: function (ob) {
            console.log(ob.data)
          },
          complete: function (ob) { },
        })
    } else {
      this.modalTap()
      this.showSwiper()
    }
  },
})