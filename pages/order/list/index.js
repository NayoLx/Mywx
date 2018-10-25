// pages/order/list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadingHide: '',
    currentTab: 0,
    winWidth: 0,
    winHeight: 0,
    itemData: [
      {
        no: '001',
        img: '/img/ic_need.png',
        name: '宋双庙',
        info: '我：二狗，你妈喊你回家吃饭',
        time: '上午12:00',
      },
      {
        no: '001',
        img: '/images/mp3.png',
        name: '订阅号',
        info: '拜拜吧比较爱白芭比白阿比',
        time: '昨天',
      },
      {
        no: '001',
        img: '/images/pdf.png',
        name: '微信团队',
        info: '登录操作通知',
        time: '上午 9:00',
      },
      {
        no: '001',
        img: '/images/txt.png',
        name: '锤子科技',
        info: '罗永浩 x 罗振宇访谈节目 《长谈》',
        time: '星期二',
      },
      {
        no: '001',
        img: '/images/word.png',
        name: '微信公众平台安全助手',
        info: '小程序登录提醒',
        time: '上午10:00',
      },
      {
        no: '001',
        img: '/images/excel.png',
        name: '微信支付',
        info: '支付成功',
        time: '上午12:00',
      }
      ,
      {
        no: '001',
        img: '/images/excel.png',
        name: '微信支付',
        info: '支付成功',
        time: '上午12:00',
      },
      {
        no: '001',
        img: '/images/excel.png',
        name: '微信支付',
        info: '支付成功',
        time: '上午12:00',
      }
    ]
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
  },

  touchS: function (e) {  // touchstart
    let startX = Public.getClientX(e)
    startX && this.setData({ startX })
  },
  touchMove: function (e) {  // touchmove
    let itemData = Public.touchMove(e, this.data.itemData, this.data.startX)
    itemData && this.setData({ itemData })

  },
  touchEnd: function (e) {  // touchend
    const width = 150  // 定义操作列表宽度
    let itemData = Public.touchEnd(e, this.data.itemData, this.data.startX, width)
    itemData && this.setData({ itemData })
  },
  itemDelete: function (e) {  // itemDelete
    let itemData = Public.deleteItem(e, this.data.itemData)
    itemData && this.setData({ itemData })
  },

})