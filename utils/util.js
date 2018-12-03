var Da = require("/fun.js");

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function showLoading(title, duration) {
  if (wx.showLoading) {
    wx.showLoading({
      title: (typeof(title) == "undefined") ? '正在加载...' : title,
      mask: true
    })
  } else {
    wx.showToast({
      title: (typeof(title) == "undefined") ? '正在加载...' : title,
      icon: 'loading',
      duration: (typeof(duration) == "undefined") ? 2000 : duration,
    })
  }
}

// 隐藏 loading 提示框
function hideLoading() {
  if (wx.hideLoading) {
    wx.hideLoading() // 1.1新增接口
  } else {
    wx.hideToast()
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function _getIndex(e) { // 获取滑动列表的下标值
  return e.currentTarget.dataset.index
}

function _getEndX(e, startX) { // 获取滑动结束滑动的距离
  let touch = e.changedTouches
  if (touch.length === 1) {
    return touch[0].clientX - startX
  }
}

function _resetData(dataList) { // 重置数据， 把所有的列表 left 置为 0
  for (let i in dataList) {
    dataList[i].left = 0
  }
  return dataList
}

function getClientX(e) { // 获取滑动的横坐标
  let touch = e.touches
  if (touch.length === 1) {
    return touch[0].clientX
  }
}

function touchMove(e, dataList, startX) { // touchmove 过程中更新列表数据
  let list = this._resetData(dataList)
  list[this._getIndex(e)].left = -150
  return list
}

function touchEnd(e, dataList, startX, width) { // touchend 更新列表数据
  let list = this._resetData(dataList)
  let disX = this._getEndX(e, startX)
  let left = 0

  if (disX < 0) { // 判断滑动方向， （向左滑动）
    // 滑动的距离大于删除宽度的一半就显示操作列表 否则不显示
    left = -150
  } else { // 向右滑动复位
    left = 0
  }

  list[this._getIndex(e)].left = left
  return list
}

function deleteItem(e, dataList) { // 删除功能
  // dataList.splice(this._getIndex(e), 1)
  var that = this
  var openid = wx.getStorageSync('openid')
  var order_no = e.currentTarget.dataset.id
  
  wx.request({
    url: Da.dataUrl + '?r=order/deleteorder',
    data: {
      openid: openid,
      order_no: order_no,
    },
    method: 'POST',
    header: {
      "Content-Type": "application/x-www-form-urlencoded"
      // 'Content-Type': 'application/json'
    },
    success: function(res) {
      console.log(res.data)
    }
  })
  return dataList
}

function show(text) {
  wx.showToast({
    title: text,
    icon: 'none',
    duration: 2000
  })
}

function timeShow(text, time) {
  wx.showToast({
    title: text,
    icon: 'none',
    duration: time
  })
}


module.exports = {
  formatTime: formatTime,
  showLoading: showLoading,
  hideLoading: hideLoading,
  _getIndex: _getIndex,
  _getEndX: _getEndX,
  _resetData: _resetData,
  getClientX: getClientX,
  touchMove: touchMove,
  touchEnd: touchEnd,
  deleteItem: deleteItem,
  show: show,
  timeShow: timeShow,
}