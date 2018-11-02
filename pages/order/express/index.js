// pages/order/express/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  expressIdInput: function (e) {
    this.setData({
      expressid: e.detail.value
    })
  },

  expressNameInput: function (e) {
    this.setData({
      expressname: e.detail.value
    })
  },

  getExpressDetail: function(e) {
    var that = this
    console.log(that.data.expressname)
    console.log(that.data.expressid)
    wx.request({
      url: 'https://m.kuaidi100.com/index_all.html?type=' + that.data.expressname + '&postid=' + that.data.expressid,
      success: function (res) {
        console.log(res)
      }
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

  },
})