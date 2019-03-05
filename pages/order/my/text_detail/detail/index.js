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
    loadingHide: false,
  },

  getDetailData: function() {
    var that = this
    wx.request({
      url: Da.dataUrl + '?r=comment/comentdetail',
      data: {
        id: that.data.id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function(res) {
        var detail = res.data.detail;
        var data = {
          'postimg': 'https://li.bytodream.cn/images/img/banner_3.jpg',
          'title': detail.title,
          'data': detail.data,
          'avater': detail.avater,
          'content': detail.detail,
          'author': detail.author,
        }

        that.setData({
          textdetail: data,
          loadingHide: true,
        })
      }
    })
  },

  getDetail: function() {
    var that = this
    wx.request({
      url: Da.dataUrl + '?r=comment/getcomment',
      data: {
        postid: that.data.id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
        if (res.data.success) {
          console.log('====页面轮询开始====')
          if(res.data.error) {
            console.log(res.data.error); 
            clearInterval(that.data.setinter)
            return ;
          }
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
          postid: that.data.id,
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
          } else {
            toast.show(res.data.error)
            that.setData({
              value: ''
            })
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
          winHeight: res.windowHeight,
          id: options.id
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

  onUnload: function(options) {
    var that = this;
    console.log('~~~~清除轮询~~~~')
    clearInterval(that.data.setinter)
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(options) {
    var setinter = setInterval(this.getDetail, 10000)
    this.setData({
      setinter: setinter
    })
  },

  submitForm: function(e) {
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
      success: function(res) {
        console.log(res)
        if (res.data.msg.errmsg != 'ok') {
          self.getAccesstoken()
          toast.show('Accesstoken失效，现已重新获取，麻烦再点击一次')
        }
      },
      fail: function(err) {
        console.log('request fail ', err);
      },

    })
  },

  getAccesstoken: function () {
    var that = this
    wx.request({
      // url: Da.dataUrl + '?r=my/getwxtoken',
      url: 'http://localhost:8080/basic/web/index.php?r=my/getwxtoken',
      success: function (res) {
        that.setData({
          access_token: res.data.access_token
        })
        console.log(res.data)
      }
    })
  },

})