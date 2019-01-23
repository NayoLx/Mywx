// pages/order/express/index.js
var Da = require("../../../utils/fun.js");
var Public = require('../../../utils/pubic.js');
var toast = require("../../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    keyword: '',
    index: '',
    loadingHide: true,
  },

  expressIdInput: function(e) {
    this.setData({
      expressid: e.detail.value
    })
  },

  getExpressDetail: function(e) {
    var that = this
    // 显示正在加载...
    toast.showLoading()

    wx.request({
      url: Da.dataUrl + '?r=express/getordertraces',
      data: {
        shipper: that.data.value,
        logistc: that.data.expressid
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res.data)
        if (res.data.Success == 'false' || res.data.Traces.length == '0') {
          Public.show(res.data.Reason)
          that.setData({
            traces: ''
          })
          return
        }
        // 隐藏加载提示
        toast.hideLoading()

        that.setData({
          traces: res.data.Traces
        })
      },
      fail: function(res) {
        console.log(res.data)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setKey()
    var key = that.data.key
    // 显示正在加载...
    toast.showLoading()

    wx.request({
      url: Da.dataUrl + '?r=express/getkuaidi',
      success: function(res) {

        var comarray = [key, res.data[key[0].k_name]]

        that.setData({
          com: res.data,
          loadingHide: false,
          comarray: comarray
        })
        console.log(comarray)
        // 隐藏加载提示
        toast.hideLoading()

      }
    })

  },

  /**
   * 更改右边快递公司
   */
  bindChange: function(e) {
    var that = this
    var id = e.detail.value[1]

    that.setData({
      index: id,
      value: that.data.comarray[1][id].value
    })

  },

  /**
   * 更改列与其相关数据
   */
  bindMultiPickerColumnChange: function(e) {
    var that = this
    var key = that.data.key
    var id = e.detail.value

    var data = {
      comarray: this.data.comarray,
      index: this.data.index
    };

    data.index = e.detail.value;

    if (e.detail.column == 0) {
      data.comarray = that.data.com[key[id].k_name]
      data.index = key

      var datas = [data.index, data.comarray]

      that.setData({
        comarray: datas
      })
    }
  },

  setKey: function() {
    var key = [{
      'k_name': 'of'
    }, {
      'k_name': 'A'
    }, {
      'k_name': 'B'
    }, {
      'k_name': 'C'
    }, {
      'k_name': 'D'
    }, {
      'k_name': 'E'
    }, {
      'k_name': 'F'
    }, {
      'k_name': 'G'
    }, {
      'k_name': 'H'
    }, {
      'k_name': 'J'
    }, {
      'k_name': 'K'
    }, {
      'k_name': 'L'
    }, {
      'k_name': 'M'
    }, {
      'k_name': 'N'
    }, {
      'k_name': 'P'
    }, {
      'k_name': 'Q'
    }, {
      'k_name': 'R'
    }, {
      'k_name': 'S'
    }, {
      'k_name': 'T'
    }, {
      'k_name': 'U'
    }, {
      'k_name': 'W'
    }, {
      'k_name': 'X'
    }, {
      'k_name': 'Y'
    }, {
      'k_name': 'Z'
    }]
    this.setData({
      key: key
    })
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
})