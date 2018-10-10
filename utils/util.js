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
      title: (typeof (title) == "undefined") ? '正在加载...' : title,
      mask: true
    })
  } else {
    wx.showToast({
      title: (typeof (title) == "undefined") ? '正在加载...' : title,
      icon: 'loading',
      duration: (typeof (duration) == "undefined") ? 2000 : duration,
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

module.exports = {
  formatTime: formatTime,
  showLoading: showLoading,
  hideLoading: hideLoading
}
