// pages/order/list/index.js
var toast = require('../../../utils/util.js');
var Da = require("../../../utils/fun.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHide: '',
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    itemData: [],
    order: [],
    modalSubmitOrderHidden: true,
  },

  bindChange: function (e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },
  
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;

    // 显示正在加载...
    toast.showLoading() 

    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });
    that.getOrder()
  },

  getOrder: function () {
    var openid = wx.getStorageSync('openid')
    var that = this
    wx.request({
      url: Da.dataUrl + '?r=order/getallorder',
      data: {
        openid: openid,
        status: 10,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function (res) {
        // 隐藏加载提示
        toast.hideLoading()

        that.setData({
          order: res.data,
          loadingHide: true,
        })
        console.log(that.data.order)
      }
    })
  },

  getDetail: function (e) {
    this.setData({
      modalSubmitOrderHidden: false
    })
    console.log(this.data.order[e.currentTarget.dataset.index])
  },

  actionCloseModal: function (e) {
    this.setData({
      modalSubmitOrderHidden: true
    })
  }
})