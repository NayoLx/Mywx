// pages/pop/pop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showalert: true,
    showModal: true 
  },
  ubmit: function () {
    this.setData({
      showModal: true
    })
  },

  go: function () {

    this.setData({

      showModal: false

    })

  },

  alert: function() {
    var that = this;
    this.setData({
      showalert: !that.data.showalert
    })
  },
  
})