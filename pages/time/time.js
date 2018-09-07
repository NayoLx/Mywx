// pages/time/time.js
var week = require('../../utils/week.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    date_: '', // 传给后台时间
    date: '' // 时间
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      date_: week.getDates(1)[0].year + '-' + week.getDates(1)[0].month + '-' + week.getDates(1)[0].day,
      date: week.getDates(1)[0].year + '-' + week.getDates(1)[0].month + '-' + week.getDates(1)[0].day + ' (' + week.getDates(1)[0].week + ')'
    })
  },

 

 
})