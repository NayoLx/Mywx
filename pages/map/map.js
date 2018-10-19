// pages/map/map.js
var week = require('../../utils/week.js');
var Da = require("../../utils/fun.js");
var Public = require("../../utils/pubic.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModal: false,
    date: '',
    winWidth: '',
    winHeight: '',
    todayClassb: [],
    arrlocal: '',
    todayClass: [],
    local1: {},
    local2: {},
    local3: {},
    local4:{},
    animationData: {},
    markers: []
  },
  /**
   * 课程任务查看
   */
  checkclass: function() {
    var that = this
    var arrdata = []
    for (var id = 0; id < that.data.todayClass.length; id++) {
      var classroom = that.data.todayClass[id].classroom
      console.log(classroom)
      if (classroom == null) {

      } else {
        if (classroom.length == 4) {
          var strclass = classroom.substring(0, 1)
          if (strclass == 'T' || strclass == 'S' || strclass == 'U') {
            /**
             * STU教学楼
             */
            that.data.local1 = {
              iconPath: "../../img/renwu.png",
              id: id,
              classname: that.data.todayClass[id].classname,
              classroom: that.data.todayClass[id].classroom,
              class: that.data.todayClass[id].class,
              teacher: that.data.todayClass[id].teacher,
              // time:'',
              latitude: 23.4520,
              longitude: 113.49359,
              width: 25,
              height: 45,
            }
            arrdata.push(that.data.local1)
          }
          /**
           * E型教学楼
           */
          else if (strclass == 'A' || strclass == 'B' || strclass == 'C' || strclass == 'D' || strclass == 'E') {
            that.data.local2 = {
              iconPath: "../../img/renwu.png",
              id: id,
              classname: that.data.todayClass[id].classname,
              classroom: that.data.todayClass[id].classroom,
              class: that.data.todayClass[id].class,
              teacher: that.data.todayClass[id].teacher,
              latitude: 23.4504,
              longitude: 113.49302,
              width: 25,
              height: 45,
            }
            arrdata.push(that.data.local2)
          } else if (strclass == 'L') {
            that.data.local2 = {
              iconPath: "../../img/renwu.png",
              id: id,
              classname: that.data.todayClass[id].classname,
              classroom: that.data.todayClass[id].classroom,
              class: that.data.todayClass[id].class,
              teacher: that.data.todayClass[id].teacher,
              latitude: 23.4508,
              longitude: 113.49389,
              width: 25,
              height: 45,
            }
            arrdata.push(that.data.local2)
          }
        } else if (classroom.length == 5) {
          var strclass = classroom.substring(0, 2)
          /**
           * S2教学楼
           */
          if (strclass == 'S2') {
            that.data.local3 = {
              iconPath: "../../img/renwu.png",
              id: id,
              classname: that.data.todayClass[id].classname,
              classroom: that.data.todayClass[id].classroom,
              class: that.data.todayClass[id].class,
              teacher: that.data.todayClass[id].teacher,
              latitude: 23.45018,
              longitude: 113.49368,
              width: 25,
              height: 45,
            }
            arrdata.push(that.data.local3)
          } else if (strclass == 'TY') {
            that.data.local3 = {
              iconPath: "../../img/renwu.png",
              id: id,
              classname: that.data.todayClass[id].classname,
              classroom: that.data.todayClass[id].classroom,
              class: that.data.todayClass[id].class,
              teacher: that.data.todayClass[id].teacher,
              latitude: 23.4515,
              longitude: 113.49258,
              width: 25,
              height: 45,
            }
            arrdata.push(that.data.local3)
          }
        }
      }
    }
    that.setData({
      markers: arrdata
    })
    console.log(this.data.markers)
  },

  /**
   * markerId点击事件
   */
  markertap(e) {
    var that = this
    var arrlocal = []
    var latitude = this.data.markers[e.markerId].latitude
    var longitude = this.data.markers[e.markerId].longitude
    for (var i = 0; i < this.data.markers.length; i++) {
      if (latitude == this.data.markers[i].latitude && longitude == this.data.markers[i].longitude) {
        var loaclclass = {
          classname: that.data.todayClass[i].classname,
          classroom: that.data.todayClass[i].classroom,
          class: that.data.todayClass[i].class,
          teacher: that.data.todayClass[i].teacher,
          time: that.data.todayClass[i].time,
        }
        arrlocal.push(loaclclass)
      }
    }
    this.setData({
      arrlocal: arrlocal,
      showModal: true
    })
    console.log(this.data.arrlocal)
  },
  go: function() {
    this.setData({
      showModal: false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    console.log(week.getDates(1))
    this.setData({
      date: week.getDates(1)[0].week
    })
    this.checkweek()

  },

  checkweek: function() {
    if (this.data.date == '周一') {
      this.data.date = 'row1'
    } else if (this.data.date == '周二') {
      this.data.date = 'row2'
    } else if (this.data.date == '周三') {
      this.data.date = 'row3'
    } else if (this.data.date == '周四') {
      this.data.date = 'row4'
    } else if (this.data.date == '周五') {
      this.data.date = 'row5'
    } else {
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
    var that = this
    
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          systemInfo: res,
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        })
      }
    })

    var a = wx.getStorageSync('id')
    var stunum = a[0]
    var pass = a[1]

    if (a != '') {
      var that = this
      wx.request({
        // url: 'http://localhost:8080/login2.3/newphp/new.php',
        url: Da.dataUrl + '?r=my/mapacgedular',
        data: {
          stunumber: stunum,
          password: pass,
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
          /**
           * 先获取一天所有的课，这样就能获得上课时间
           */
          var a = []
          var c = []
          for (var i = 0; i < res.data.time.length; i++) {
            for (var y = 0; y < res.data.time[i].length; y++) {
              if (res.data.time[i][y].day == that.data.date) {
                a.push(res.data.time[i][y])
                // && res.data.time[i][y].class != null
              }
            }
          }
          that.setData({
            todayClassb: a
          })
          console.log(that.data.todayClassb)
          /**
           * 筛选无课
           */
          var ardata = []
          for (var x = 0; x < that.data.todayClassb.length; x++) {
            
            if (that.data.todayClassb[x].class != null) {
              that.data.local4 = {
                classname: that.data.todayClassb[x].classname,
                classroom: that.data.todayClassb[x].classroom,
                class: that.data.todayClassb[x].class,
                teacher: that.data.todayClassb[x].teacher,
                time: x,
              }
              ardata.push(that.data.local4)
            }
          }
          that.setData({
            todayClass: ardata
          })
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