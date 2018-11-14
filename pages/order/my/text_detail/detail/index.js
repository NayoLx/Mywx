// pages/order/my/text_detail/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    textdetail: [],
    focus: false,
  },

  getDetail: function() {
    var data = {
      'postimg': 'http://li.bytodream.cn/images/img/banner_3.jpg',
      'title': '更新目录',
      'data': '2018-11-14 14:13',
      'avater': 'https://wx.qlogo.cn/mmopen/vi_32/nfMPoEP0ibtzpJxMqUPGiaojVvCRicATEyNhWvAvPeAibV11IVL8EODcTMZ2whYjGy2RKibJxv4D0p5uULXq94hypibw/132',
      'content': '为了体现产品的人性化，他把对用户的称呼“您”变成“你”，“这个写进我们的产品条约里面去了。后来再也没有人敢在产品中对用户过于尊敬，因为我们一旦对用户过于尊敬，那说明我们可能怀有目的，可能需要骗一点什么东西过来。” 为了保护用户隐私，他坚持微信的系统设计不保留用户的聊天记录，并且坚决不侵犯用户隐私。“我们从来不会给用户发任何的骚扰信息。大家可以回顾一下，在微信里面有没有收到过任何一条系统下发的营销信息，应该是没有的。”',
      'author': 'li',
      'postid': '0',
      'talk': [{
          'id': '1540226133',
          'name': '',
          'talk': '',
        'time': '2018-11-14 14:13',
        },
        {
          'id': '1540226133',
          'name': '',
          'talk': '',
          'time': '2018-11-14 14:14',
        },
        {
          'id': '1540226133',
          'name': '',
          'talk': '',
          'time': '2018-11-14 14:15',
        },
      ],
      'effect_coupon_num': '10',
    }
    this.setData({
      textdetail: data,
    })
  },

  changeFocus: function() {
    if (this.data.focus == true) {
      this.setData({
        focus: false,
      })
      return ;
    }
    this.setData({
      focus: true,
    })
  },

  click: function () {
    if (this.data.click == true) {
      this.setData({
        click: false
      })
    }
    else {
      this.setData({
        click: true
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.getDetail()
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

  
})