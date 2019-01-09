// pages/chat/websocket/index.js
var wsurl = 'ws://127.0.0.1:13142';
var i = 0;
var socketOpen = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    value: '',
    winHeight: 0,
    scrollTop: 0, 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.websocket()
    var home = wx.getStorageSync('home')
    that.setData({
      home: home
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
        });
      }
    });
  },

  websocket: function() {
    var socketMsgQueue = []
    var that = this
    var chatmsg = []

    wx.connectSocket({
      url: wsurl,
      success: function(res) {
        console.log(res)
      }
    })

    wx.onSocketOpen(function(res) {
      console.log('WebSocket连接已打开！')
      socketOpen = true
    })

    wx.onSocketError(function(res) {
      console.log('WebSocket连接打开失败，请检查！')
    })

    wx.onSocketMessage(function(res) {
      console.log('收到服务器内容：' + JSON.stringify(res))
      if (JSON.parse(res.data).type != 'system' && JSON.parse(res.data).name != null) {
        chatmsg.push(JSON.parse(res.data))
        var len = chatmsg.length
        that.setData({
          chatmsg: chatmsg,
          scrollTop: (that.data.winHeight - 50) * len
        })
      }
    })
  },

  bindinputvalue: function(e) {
    this.setData({
      value: e.detail.value,
    })
  },

  sendMessage: function() {
    if (this.data.value != '') {
      var msg = {
        'name': this.data.home.nickName,
        'message': this.data.value,
        'avatarUrl': this.data.home.avatarUrl
      }
      if (socketOpen) {
        wx.sendSocketMessage({
          data: JSON.stringify(msg),
        })
        this.setData({
          value: '',
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },


})