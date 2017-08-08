// pages/welcome/welcome.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  onTap:function(){
    // wx.navigateTo({
    //   url: '../posts/post',
    // });
    console.log("execute onTap")
    //如果要跳转到一个带tab选项卡的页面，必须使用wx.switchTab这个方法，如果跳转到一个不带Tab选项卡的页面还是要使用redirect或者navigate
    wx.switchTab({
      url: '../posts/post',
    })
  },
  
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})