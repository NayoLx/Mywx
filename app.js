//app.js
App({

  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        var that = this
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: 'https://api.weixin.qq.com/sns/jscode2session?appid=wx1e5e51581c102b66&secret=b1cef0526d4c19b2261a0e33fee62e41&js_code=' + res.code + '&grant_type=authorization_code',
            method: 'GET',
            header: {
              'content-type': 'application/json'
            },
            success: function(openIdRes) {
              console.info("获取用户openId成功");
              console.info(openIdRes.data.openid);
              wx.setStorageSync('openid', openIdRes.data.openid)
              // 获取用户信息
              wx.getSetting({
                success: res => {
                  if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                      success: res => {
                        wx.setStorageSync('home', {
                          'openid': openIdRes.data.openid,
                          'nickName': res.userInfo.nickName,
                          'avatarUrl': res.userInfo.avatarUrl,
                          'country': res.userInfo.country,
                          'city': res.userInfo.city,
                          'gender': res.userInfo.gender,
                          'province': res.userInfo.province,
                          'language': res.userInfo.language
                        })
                        console.log('onlogin:登陆成功')
                        that.oncheck(res.userInfo, openIdRes.data.openid)
                      }
                    })
                  }
                }
              })
            },
            fail: function(error) {
              console.info("获取用户openId失败");
              console.info(error);
            },
            complete: function(openIdRes) {

            }
          })
        }
      }
    })

  },

  oncheck: function(res, openId) {
    var that = this;
    console.log(res)
    var dataUrl = "https://bytodream.cn/basic/web/index.php";
    wx.request({
      // url: 'http://localhost:8080/login2.3/newphp/login.php',
      url: dataUrl + '?r=my/savedetail',
      data: {
        nickName: res.nickName,
        gender: res.gender,
        country: res.country,
        city: res.city,
        avatarUrl: res.avatarUrl,
        province: res.province,
        openid: openId,
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.statusCode)
      },
      fail: function(res) {
        console.log('error')
      },
      complete: function(res) {},
    })
  },

  globalData: {
    userInfo: null
  }
})