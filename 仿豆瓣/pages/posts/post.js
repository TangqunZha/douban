var postsData = require('../../data/posts_data.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //小车供需总会读取data对象来做数据绑定，这个动作我们成为A
    //而A这个动作的执行，是在onload事件执行之后发生
  },
  imgPath: "/images/...",

  /**
   * 生命周期函数--监听页面加载,页面初始化 options为页面跳转所带来的参数
   */
  onLoad: function () {
    //如果是在页面onload之后，页面其实已经有postkey了，就不用主动去更新了，相当于Data的初始化
    // this.data.post_key = postsData.postList
    //上面这个赋值的方法不科学，获取不到数据
    //一般在onload时异步操作必须用setData来更新这个值，如果数据的更新是在onload之前就需要setData
    //如果涉及数据绑定用setData没错
    this.setData({
      posts_key: postsData.postList
    });
  },
  onPostTap: function (event) {
    var postId = event.currentTarget.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },
  // onSwiperItemTap: function (event) {
  //   var postId = event.currentTarget.dataset.postid;
  //   wx.navigateTo({
  //     url: 'post-detail/post-detail?id=' + postId,
  //   })
  // },
  onSwiperTap:function(event){
    //target指的是当前点击的组件，currentTarget指的是事件捕获
    var postId = event.target.dataset.postid;
    wx.navigateTo({
      url: 'post-detail/post-detail?id=' + postId,
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})