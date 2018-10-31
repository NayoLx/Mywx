// pages/order/my/index.js
var toast = require('../../../utils/util.js');
var Da = require("../../../utils/fun.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHide: false,
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    itemData: [],
    order: [],
    modalSubmitOrderHidden: true,
  },

  stopTouchMove: function() {
    return false;
  },

  bindChange: function(e) {
    var that = this;
    that.setData({
      currentTab: e.detail.current
    });
  },

  /**
   * 点击tab切换
   */
  swichNav: function(e) {
    // 显示正在加载...
    toast.showLoading()

    var that = this;
    that.setData({
      loadingHide: false,
    })
    
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
      that.getItemData(e.target.dataset.current)
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    // 显示正在加载...
    toast.showLoading()

    var that = this;
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({
      success: function(res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

    that.getItemData(0)
  },

  onJumpOrder: function() {
    wx.navigateTo({
      url: 'push/index',
    })
  },

  touchS: function(e) { // touchstart
    let startX = toast.getClientX(e)
    startX && this.setData({
      startX
    })
  },
  
  touchMove: function(e) { // touchmove
    let order = toast.touchMove(e, this.data.order, this.data.startX)
    order && this.setData({
      order
    })
  },

  touchEnd: function(e) { // touchend
    const width = 150 // 定义操作列表宽度
    let order = toast.touchEnd(e, this.data.order, this.data.startX, width)
    order && this.setData({
      order
    })
  },

  itemDelete: function(e) { // itemDelete
    var that = this
    wx.showModal({
      title: '确认删除？',
      content: '是否删除该订单，会自动取消订单',
      success(res) {
        if (res.confirm) {
          let order = toast.deleteItem(e, that.data.order)  

          // 显示正在加载...
          toast.showLoading() 

          order && that.setData({
            order
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
    that.onShow()
  },

  getItemData: function(id) {
    var openid = wx.getStorageSync('openid')
    var that = this 
    wx.request({
      url: Da.dataUrl + '?r=order/getallorder',
      data: {
        openid: openid,
        status: id,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
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

  onShow: function(options) {
    this.getItemData(this.data.currentTab)
  },

  getDetail: function (e) {
    this.setData({
      modalSubmitOrderHidden: false,
      checkOrder: this.data.order[e.currentTarget.dataset.index]
    })
  },

  actionCloseModal: function (e) {
    this.setData({
      modalSubmitOrderHidden: true,
      checkOrder: ''
    })
  },
})