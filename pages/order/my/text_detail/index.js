// pages/order/my/text_detail/index.js
var Da = require("../../../../utils/fun.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    loadingHide: false,
  },

  onJumpToTalk: function (e) {
    console.log(e.currentTarget.dataset.id)
    var comment_id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'detail/index?id=' + comment_id,
    })
  },

  onJumpToChatroom:function(e) {
    wx.navigateTo({
      url: '../../../chat/websocket/index',
    })
  },

  onJumpToSocketIo: function (e) {
    wx.navigateTo({
      url: '../../../chat/socketio/index',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    var that = this
    wx.request({
      url: Da.dataUrl + '?r=comment/commentwxlist',
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        console.log(res)
        if (res.data.success) {
          that.setData({
            list: res.data.list,
            loadingHide: true
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },


})