Page({

  /**
   * 页面的初始数据
   */
  data: {
    home: [],
    hasAuthUserInfo: false, // 是否授权用户信息权限
  },
  /**
   * 检查是否已获得用户授权
   */
  checkAuthUserInfo: function () {
    var me = this;
    if (wx.getSetting) {
      wx.getSetting({
        success: function (res) {
          var hasAuthUserInfo = false;
          if (res.authSetting['scope.userInfo']) {
            console.log(res)
            hasAuthUserInfo = true;
            me.onGotUserInfo(res)
          }

          me.setData({
            hasAuthUserInfo: hasAuthUserInfo
          })
        }
      })
    }
  },

  ondetail: function() {
    wx.navigateTo({
      url: 'mydetail/index',
    })
  },

  onGotUserInfo: function (res) {
    if (res.detail.errMsg == "getUserInfo:ok") {
      this.setData({
        home: e.detail.userInfo
      })
    }
    
    console.log(this.data.home)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.checkAuthUserInfo()
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

  
})