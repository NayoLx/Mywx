// pages/chat/websocket/index.js
var wsurl = 'ws://192.168.0.145:13142';
var i = 0;
var socketOpen = false;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatmsg: "",
    sendmsg: [],
    winHeight: 0,
    winWidth: 0,
    scrollTop: 1000,
    userInfo: "",
    key: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var keyv = Math.round(Math.random() * 0xFFFFFF).toString();

    that.setData({
      key: keyv,
      home: wx.getStorageSync('home')
    });

    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

  },
  StartSocket(object) {
    var that = object;
    var socketMsgQueue = []
    //创建连接
    // if (!socketOpen) {
      wx.connectSocket({
        url: wsurl,
        success: function(res) {
          console.log("onconnect => 连接成功");
        },
        fail: function(res) {
          console.log("onconnect => 连接失败");
        }
      });
      //打开连接
      wx.onSocketOpen(function(res) {
        console.log("onopen => 连接成功")

        socketOpen = true
        for (let i = 0; i < socketMsgQueue.length; i++) {
          sendSocketMessage(socketMsgQueue[i])
        }
        socketMsgQueue = []
      });

      //连接失败
      wx.onSocketError(function(res) {
        console.log("onError => 连接失败");
        socketOpen = false;
      });
      //连接关闭
      wx.onSocketClose(function(res) {
        console.log("onclose => 连接关闭");
        socketOpen = false;
      })
      //接收消息
      wx.onSocketMessage(function(res) {
        var data = JSON.parse(res.data);
        console.log("onMessage => 收到服务器内容");

        if (data.type != 'system' && data.name != null) {
          var newdata = new Array();
          if (that.data.chatmsg.length == 0) {
            newdata.push(data);
            var len = that.data.chatmsg.length
            that.setData({
              chatmsg: newdata,
              scrollTop: (that.data.winHeight - 50) * len
            })
          } else {
            that.setData({
              chatmsg: that.data.chatmsg.concat(data),
              scrollTop: (that.data.winHeight - 50) * (that.data.chatmsg.length + 1)
            })
          }
          console.log(that.data.chatmsg)
        }
      })
    // }
  },
  onShow() {
    var that = this;

    that.StartSocket(that);
  },
  //获取文本框值
  getMessage: function(e) {
    this.setData({
      sendmsg: e.detail.value,
    })
  },
  cleanMessage: function() {
    this.setData({
      sendmsg: "",
    })
  },
  //发送消息
  sendMessage() {
    var that = this;
    var home = wx.getStorageSync('home')
    if (that.data.sendmsg != '') {
      var msg = {
        'name': home.nickName,
        'message': that.data.sendmsg,
        'avatarUrl': home.avatarUrl,
      }
      if (socketOpen) {
        wx.sendSocketMessage({
          data: JSON.stringify(msg),
        })
        console.log("发送消息");
        that.cleanMessage()
      }
    }
  },
  onUnload: function() {
    // if (socketOpen) {
    //   wx.closeSocket(function(res) {
    //     console.log("close => 关闭连接");
    //     socketOpen = false
    //   })
    // }
  }
})