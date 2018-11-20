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
    hasNewUserAgreementVersion: false,
    limit: 10,
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
      that.getItemData()
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
    that.getItemData()

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
      title: '确认取消？',
      content: '是否取消该订单',
      success(res) {
        if (res.confirm) {
          // 显示正在加载...
          toast.showLoading()
          var setInter = setInterval(that.getItemData, 500)

          let order = toast.deleteItem(e, that.data.order)
          order && that.setData({
            order,
            hasNewUserAgreementVersion: false,
          })
          clearInterval(setInter)
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
      //
    })
    

  },

  getItemData: function() {
    var openid = wx.getStorageSync('openid')
    var that = this
    wx.request({
      url: Da.dataUrl + '?r=order/getallorder',
      data: {
        openid: openid,
        status: that.data.currentTab,
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
        that.setData({
          order: res.data,
          loadingHide: true,
        })
        console.log('getData:5秒轮询,获取数据')
        // 隐藏加载提示
        toast.hideLoading()
      }
    })
  },

  onShow: function(options) {
    this.getItemData(this.data.currentTab)
    var setinter = setInterval(this.getItemData, 5000)
    this.setData({
      setinter: setinter
    })
  },
  onHide: function(options) {
    clearInterval(this.data.setinter)
  },

  getDetail: function(e) {
    this.setData({
      modalSubmitOrderHidden: false,
      hasNewUserAgreementVersion: true,
      checkOrder: this.data.order[e.currentTarget.dataset.index]
    })
  },

  actionCloseModal: function(e) {
    this.setData({
      modalSubmitOrderHidden: true,
      hasNewUserAgreementVersion: false,
      checkOrder: ''
    })
  },
  closeAgreement: function() {
    this.setData({
      hasNewUserAgreementVersion: false,
      checkOrder: ''
    })
  },

  /**
   * 更改订单状态
   */
  actionSubmit: function(e) {
    var status = e.target.dataset.status
    var that = this

    // 显示正在加载...
    toast.showLoading()

    wx.request({
      url: Da.dataUrl + '?r=order/changeorder',
      data: {
        openid: that.data.openid,
        status: status,
        order_no: that.data.checkOrder.order_no
      },
      method: 'POST',
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      success: function(res) {
        console.log(res)
        that.actionCloseModal()
        that.getItemData()
      }
    })
  },

  //下拉刷新事件
  scrolltolower: function () {
    if (this.data.limit < this.data.order.length) {
      this.loadMoreDetail()
      console.log('下拉事件触发')
    }
  },

  loadMoreDetail: function () {
    var limit = this.data.limit
    this.setData({
      limit: limit + 10,
    })
  },
})