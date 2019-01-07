// pages/order/my/text_detail/detail/index.js
var Public = require('../../../../../utils/pubic.js');
var toast = require('../../../../../utils/util.js');
var Da = require("../../../../../utils/fun.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    textdetail: [],
    focus: false,
    winHeight: 600,
    toView: '',
    detail: '',
    limit: 10,
  },

  getDetailData: function() {
    var that = this
    var data = {
      'postimg': 'http://li.bytodream.cn/images/img/banner_3.jpg',
      'title': '更新目录',
      'data': '2018-11-14 14:13',
      'avater': 'https://wx.qlogo.cn/mmopen/vi_32/nfMPoEP0ibtzpJxMqUPGiaojVvCRicATEyNhWvAvPeAibV11IVL8EODcTMZ2whYjGy2RKibJxv4D0p5uULXq94hypibw/132',
      'content': '为了体现产品的人性化，他把对用户的称呼“您”变成“你”，“这个写进我们的产品条约里面去了。后来再也没有人敢在产品中对用户过于尊敬，因为我们一旦对用户过于尊敬，那说明我们可能怀有目的，可能需要骗一点什么东西过来。” 为了保护用户隐私，他坚持微信的系统设计不保留用户的聊天记录，并且坚决不侵犯用户隐私。“我们从来不会给用户发任何的骚扰信息。大家可以回顾一下，在微信里面有没有收到过任何一条系统下发的营销信息，应该是没有的。”',
      'author': 'li',
      'postid': '0',
      'effect_coupon_num': '10',
    }

    that.setData({
      textdetail: data,
    })
  },

  getDetail: function() {
    var that = this
    wx.request({
      url: Da.dataUrl + '?r=comment/getcomment',
      data: {
        postid: 0,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.data.success) {
          console.log('====页面轮询开始====')
          var talk = res.data.detail
          that.setData({
            talk: talk
          })
        }
      }
    })


  },

  onDetail: function(e) {
    this.setData({
      detail: e.detail.value,
    })
  },

  changeFocus: function(e) {
    if (this.data.focus == true) {
      this.setData({
        focus: false,
      })
      return;
    }
    this.setData({
      focus: true,
    })
  },

  click: function() {
    if (this.data.click == true) {
      this.setData({
        click: false
      })
    } else {
      this.setData({
        click: true
      })
    }
  },

  closeFocus: function() {
    this.setData({
      focus: false,
    })
  },

  onJumpComment: function() {
    this.setData({
      toView: 'comment'
    })
  },

  pushComment: function() {
    var that = this
    var openid = wx.getStorageSync('openid')
    // 显示正在加载...
    toast.showLoading()

    if (that.data.detail != '') {
      wx.request({
        url: Da.dataUrl + '?r=comment/addcomment',
        data: {
          openid: openid,
          comment: that.data.detail,
          postid: that.data.textdetail.postid,
        },
        method: 'POST',
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
          // 'Content-Type': 'application/json'
        },
        success: function(res) {
          if (res.data.status == 'true') {
            that.setData({
              value: ''
            })
            that.getDetail()
            // 隐藏加载提示
            toast.hideLoading()
          }
          return;
        }
      })
    } else {
      Public.show('留言不能为空哦')
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winHeight: res.windowHeight
        })
      },
    })
    that.getDetail()
    that.getDetailData()
    that.getAccesstoken()
  },

  //下拉刷新事件
  scrolltolower: function() {
    if (this.data.limit < this.data.talk.length) {
      this.loadMoreDetail()
      console.log('下拉事件触发')
    }
  },

  loadMoreDetail: function() {
    var limit = this.data.limit
    this.setData({
      limit: limit + 10,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    
  },

  onUnload: function (options) {
    var that = this;
    console.log('~~~~清除轮询~~~~')
    clearInterval(that.data.setinter)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var setinter = setInterval(this.getDetail, 10000)
    this.setData({
      setinter: setinter
    })
  },
  
  submitForm: function (e) {
    var self = this;
    var openid = wx.getStorageSync('openid')

    wx.request({
      url: Da.dataUrl + '?r=comment/getcommentapi',
      data: {
        access_token: self.data.access_token,
        touser: openid,
        template_id: 'MLdiehnX6fiwopIBMe7SLkNoGEFm5OiMsao76dB2_tU',
        page: 'pages/order/my/text_detail/detail/index',
        form_id: e.detail.formId,
        keyword1: '您的文章被点赞了',
        keyword4: '点击进入小程序查看',
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.msg.errmsg != 'ok') {
          self.getAccesstoken()
          toast.show('Accesstoken失效，现已重新获取，麻烦再点击一次')
        }
      },
      fail: function (err) {
        console.log('request fail ', err);
      },

    })
  },

  getAccesstoken: function () {
    var that = this
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx1e5e51581c102b66&secret=b1cef0526d4c19b2261a0e33fee62e41',
      success: function (res) {
        that.setData({
          access_token: res.data.access_token
        })
        console.log(res.data)
      }
    })
  },


})