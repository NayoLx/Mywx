// pages/order/my/push/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    toView: 'device-info',
    index: 0,
    winWidth: 0,
    winHeight: 0,
    array: ['代拿', '其他']
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.getSystemInfo({
      success: function (res) {
        console.log(res)
        that.setData({
          winHeight: res.windowHeight
        })
      }
    })
    console.log(this.data.winHeight)
  },


  /**
    * 删除图片
    */
  closeImg: function (e) {
    var that = this;
    var images = that.data.src;
    var index = e.currentTarget.id; //获取当前长按图片下标
    console.log(index)
    console.log(images)
    wx.showModal({
      title: '提示',
      content: '确定要删除此图片吗？',
      success: function (res) {
        if (res.confirm) {
          console.log('点击确定了');
          images.splice(index, 1);
        } else if (res.cancel) {
          console.log('点击取消了');
          return false;
        }
        that.setData({
          src: images
        });
      }
    })
  },

  /**
   * 上传图片
   */
  upLoadImg: function (e) {
    var that = this
    wx.chooseImage({
      count: 5,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // success
        console.log(res)
        that.setData({
          src: res.tempFilePaths
        })
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
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