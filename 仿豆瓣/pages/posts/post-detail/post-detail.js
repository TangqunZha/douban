var postsData = require('../../../data/posts_data.js')
var app = getApp();
Page({
  data: {
    isPlayingMusic: false
  },
  onLoad: function (option) {
    var globalData = app.globalData;
    console.log(app.globalData.g_isPlayingMusic)
    var postId = option.id;
    this.data.currentPostId = postId;
    var postData = postsData.postList[postId];
    //  console.log(postData)
    this.setData({
      postData: postData
    })
    // var postsCollected = {
    //   1: "true",
    //   2: "false",
    //   3: "true",
    // }
    var postsCollected = wx.getStorageSync('posts_collected');
    if (postsCollected) {
      var postCollected = postsCollected[postId];
      this.setData({
        collected: postCollected
      })
    }
    else {
      var postsCollected = {};
      postsCollected[postId] = false;
      wx.setStorageSync("posts_collected", postsCollected)
    }
    if (app.globalData.g_isPlayingMusic && app.globalData.g_currentMusicPostId == this.data.currentPostId) {
      //this.data.isPlayingMusic=true;
      this.setData({
        isPlayingMusic: true,
      })
    }

    this.setAudioMonitor();
  },
  setAudioMonitor: function () {
    var that = this;
    wx.onBackgroundAudioPlay(function () {
      that.setData({
        isPlayingMusic: true,
      })
      app.globalData.g_isPlayingMusic = true;
      app.globalData.g_currentMusicPostId = that.data.currentPostId;
    });
    wx.onBackgroundAudioPause(function () {
      that.setData({
        isPlayingMusic: false,
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
    wx.onBackgroundAudioStop(function () {
      that.setData({
        isPlayingMusic: false,
      })
      app.globalData.g_isPlayingMusic = false;
      app.globalData.g_currentMusicPostId = null;
    });
    

  },

  onCollectionTap: function (event) {
    //  this.getPostsCollectedSyc();
    this.getPostsCollectedAsy();
  },
  getPostsCollectedAsy: function () {
    var that = this;
    wx.getStorage({
      key: 'posts_collected',
      success: function (res) {
        var postsCollected = res.data;
        var postCollected = postsCollected[that.data.currentPostId];
        postCollected = !postCollected;
        postsCollected[that.data.currentPostId] = postCollected;
        //更新文章是否有缓存值
        that.showToast(postsCollected, postCollected);
      },
    })
  },


  getPostsCollectedSyc: function () {
    var postsCollected = wx.getStorageSync("posts_collected");
    var postCollected = postsCollected[this.data.currentPostId];
    //收藏切换
    postCollected = !postCollected;
    postsCollected[this.data.currentPostId] = postCollected;
    //更新文章是否有缓存值

    this.showToast(postsCollected, postCollected);

  },
  showToast: function (postsCollected, postCollected) {
    wx.setStorageSync("posts_collected", postsCollected);
    //更新数据绑定变量，从而实现切换图片
    this.setData({
      collected: postCollected
    });
    wx.showToast({
      title: postCollected ? "收藏成功" : "取消成功",
      duration: 1000,
      icon: "success"
    })
  },

  showModal: function (postsCollected, postCollected) {
    var that = this;
    wx.showModal({
      title: '收藏',
      content: postCollected ? '收藏该文章' : "取消收藏該文章?",
      showCancel: 'true',
      cancelText: "取消",
      cancelColor: '#333',
      confirmText: "确认",
      confirmColor: "#c46c00",
      success: function (res) {
        if (res.confirm) {
          wx.setStorageSync("posts_collected", postsCollected);
          //更新数据绑定变量，从而实现切换图片
          that.setData({
            collected: postCollected
          })
        }
      }
    })
  },
  onMusicTap: function (event) {
    var currentPostId = this.data.currentPostId;
    var isPlayingMusic = this.data.isPlayingMusic;
    if (isPlayingMusic) {
      wx.pauseBackgroundAudio()
      this.setData({
        isPlayingMusic: false,
      })
    }
    else {

      wx.playBackgroundAudio({
        dataUrl: postsData.postList[currentPostId].music.url,
        title: postsData.postList[currentPostId].music.title,
        coverImgUrl: postsData.postList[currentPostId].music.coverImgUrl,
      })
      this.setData({
        isPlayingMusic: true,
      })
    }

  },

  onShareTap: function (event) {
    var itemList = [
      "分享给微信好友",
      "分享到朋友圈",
      "分享到QQ",
      "分享到微博",
    ]
    wx.showActionSheet({
      itemList: itemList,
      itemColor: "#c46c00",
      success: function (res) {
        //res.cancel用户是不是点击了取消按钮
        //res.tapindex数组元素的序号，从0开始
        wx.showModal({
          title: '用户' + itemList[res.tapIndex],
          content: '用户是否取消?',
        })
      }

    })

  }
})