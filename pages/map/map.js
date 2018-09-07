// pages/map/map.js
var week = require('../../utils/week.js');
var Da = require("../../utils/fun.js");
var Public = require("../../utils/pubic.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date: '',
    todayClass: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      date:  week.getDates(1)[0].week 
    })
    this.checkweek()
  },

  checkweek:function(){
    if(this.data.date == '周一'){
      this.data.date = 'row1'
    }
    else if (this.data.date == '周二'){
      this.data.date = 'row2'
    }
    else if (this.data.date == '周三') {
      this.data.date = 'row3'
    }
    else if (this.data.date == '周四') {
      this.data.date = 'row4'
    }
    else if (this.data.date == '周五') {
      this.data.date = 'row5'
    }
    else  {
      this.data.date = null
    }

    console.log(this.data.date)
  },
  /**
   * 首页判断
   */
  modalTap: function(e) {
    wx.showModal({
      title: "提示",
      content: "您需要登陆后才能看到课表",
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../login/login',
          })
        } else {
          console.log('弹框后点取消')
        }
      }
    })
  },

  onShow: function() {
    var a = wx.getStorageSync('id')
    if (a != '') {
      var that = this
      wx.request({
        // url: 'http://localhost:8080/login2.3/newphp/new.php',
        url: Da.dataUrl + '?r=my/acgedular',
        data: {
          schoolyear: 2018,
          semester: 1
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
          // 'Content-Type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
          that.setData({
            scge: res.data,
          })
          for (var i = 0; i < res.data.time.length; i++) {
            for (var y = 0; y < res.data.time[i].length; y++) { 
              if (res.data.time[i][y].day == that.data.date && res.data.time[i][y].class != null) {
                that.setData({
                  todayClass:[res.data.time[i][y]]
                })
              }
            } 
          }
          console.log(that.data.todayClass)
        },
        fail: function(res) {
          console.log(res.data)
        },
        complete: function(res) {},
      })

    } else {
      this.modalTap()
    }
  },

})