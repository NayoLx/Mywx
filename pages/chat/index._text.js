// pages/chat/websocket/index.js
var wsurl = 'ws://192.168.43.167:2345';
var i = 0;
var socketOpen = false;
import { Cache } from '../../js/Cache.js';
import { WechatApi } from '../../js/WechatApi.js';
var Public = require("../../js/Public.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    chatmsg:"",
    sendmsg: [],
    winHeight: 0,
    winWidth:0,
    scrollTop: 1000, 
    userInfo:"",
    key:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    var keyv = Math.round(Math.random() * 0xFFFFFF).toString();
    that.setData({
      key: keyv
    });
    
    new WechatApi().getUserInfo(function(res){
      Public.Logs(res);
      that.setData({ userInfo: res});
    })
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    
  },
  StartSocket(object){
    var that = object;
    var socketMsgQueue = []
    //创建连接
    wx.connectSocket({
      url: wsurl,
      success: function (res) {
        Public.Log("连接成功");
        Public.Logs(res);
      },
      fail: function (res) {
        Public.Log("连接失败");
        Public.Logs(res);
      }
    });
    //打开连接
    wx.onSocketOpen(function (res) {
      Public.Log("连接成功")
      Public.Logs(res)
      socketOpen = true
      for (let i = 0; i < socketMsgQueue.length; i++) {
        sendSocketMessage(socketMsgQueue[i])
      }
      socketMsgQueue = []
    });
    //连接失败
    wx.onSocketError(function (res) {
      Public.Log("连接失败");
      Public.Logs(res);
      socketOpen = false;
    });
    //连接关闭
    wx.onSocketClose(function (res) {
      Public.Log("连接关闭");
      Public.Logs(res);
      socketOpen = false;
    })
    //接收消息
    wx.onSocketMessage(function (res) {
      var data = JSON.parse(res.data);
      Public.Log("收到服务器内容");
      Public.Logs(res);

      if (data.type != 'system' && data.name != null) {
        var newdata = new Array();
        if(that.data.chatmsg.length==0){
          newdata.push(data);
          var len = that.data.chatmsg.length
          that.setData({
            chatmsg: newdata,
            scrollTop: (that.data.winHeight - 50) * len
          })
        }else{
          that.setData({
            chatmsg: that.data.chatmsg.concat(data),
            scrollTop: (that.data.winHeight - 50) * (that.data.chatmsg.length+1)
          })
        }
        Public.Log(that.data.chatmsg)
        new Cache("chat", that.data.chatmsg);
      }
    })
  },
  onShow(){
    var that = this;
    var chatC = new Cache().get("chat").data.chat;
    if (chatC != undefined) {
      that.setData({
        chatmsg: chatC
      });
    }
    that.StartSocket(that);
  },
  //获取文本框值
  getMessage: function (e) {
    this.setData({
      sendmsg: e.detail.value,
    })
  },
  cleanMessage: function () {
    this.setData({
      sendmsg: "",
    })
  },
  //发送消息
  sendMessage(){
    var that = this;
    if (that.data.sendmsg != '') {
      var msg = {
        'name': new Cache().get("userInfo").data.userInfo.nickName + that.data.key,
        'message': that.data.sendmsg,
        'avatarUrl': new Cache().get("userInfo").data.userInfo.avatarUrl,
      }
      if (socketOpen) {
        wx.sendSocketMessage({
          data: JSON.stringify(msg),
        })
        Public.Log("发送消息");
        Public.Logs(msg);
        that.cleanMessage()
      }
    }
  }
})