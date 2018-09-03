// pages/login/login.js
var Public = require("../../utils/pubic.js");
var Da = require("../../utils/fun.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userName: '',
    Password: '',
    id:[],
    scgedularData: '',
    personData: '',
    cookies: ''
  },
  /**
   * 获取inputd的值
   */
  userNameInput: function(e) {
    this.setData({
      userName: e.detail.value
    })
  },
  passWdInput: function(e) {
    this.setData({
      Password: e.detail.value
    })
  },

  /**
   * 判断userName和Password
   */
  onTap: function() {  
    if(this.data.userName == ''){
      Public.show('请输入学号')
      return;
    }
    else if (this.data.Password == '') {
      Public.show('请输入密码')
      return;
    }
    else {     
      this.oncheck()
    }
  },

  /**
   * 缓存处理
   */
  setStor:function(e){
    var user = this.data.userName
    var pass = this.data.Password
    var data = Array(user, pass)
    Public.put('id', data, 5)
  },

  /**
   * 登陆
   */
  oncheck: function() {
    var that = this;
    wx.request({
      // url: 'http://localhost:8080/login2.3/newphp/login.php',
      url: Da.dataUrl + '?r=my/loginpost',
      data: {
        username: this.data.userName,
        password: this.data.Password
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
        // 'Content-Type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data)
        if (res.data.state) {
          that.setStor()
          wx.switchTab({
            url: '../scgedular/scgedular',
            success: function (e) {
              var page = getCurrentPages().pop();
              if (page == undefined || page == null) return;
              page.onLoad();
            } 
          }) 
        }
        else {
          Public.show("登录失败，账号或密码错误！");
        }
      },
      fail: function (res) {
        console.log(res.data)
      },
      complete: function (res) {
      },
    })
  },
})