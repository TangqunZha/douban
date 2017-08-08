var util = require('../utils/util.js');
var app = getApp();
Page({
  data: {
    inTheaters: {},
    comingSoon: {},
    top: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
  },

  onLoad: function (event) {
    var inTheatersURL = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonURL = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250URL = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";
    this.getMovieListData(inTheatersURL, "inTheaters", "正在热映");
    this.getMovieListData(comingSoonURL, "comingSoon", "即将上映");
    this.getMovieListData(top250URL, "top", "豆瓣TOP250");

  },
  onMoreTap: function (event) {
    var category = event.currentTarget.dataset.category;
    console.log(category)
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },
  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: 'movie-detail/movie-detail?id='+movieId,
    })
  },
  getMovieListData: function (url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      data: {},
      method: 'GET',
      header: {
        "Content-Type": "application/xml"
      },
      success: function (res) {
        console.log(res);
        that.processDoubanData(res.data, settedKey, categoryTitle)
        console.log(res.data.subjects)
      },
      fail: function (error) {
        console.log(error)
      },
    })
  },
  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
         searchResult:{}
    })
  },
  onBindFocus: function (event) {
    this.setData({
      containerShow: false,
      searchPanelShow: true,
    })
  },
  onBindBlur: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "")
  },
  onBindChange: function (event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "")
  },

  processDoubanData: function (movieData, settedKey, categoryTitle) {
    var movies = [];
    console.log(categoryTitle)
    for (let idx in movieData.subjects) {
      console.log(movieData.subjects[idx])
      var subject = movieData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        console.log(title.length)

        title = title.slice(0, 6) + '...'
      }
        
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id,
      }
      movies.push(temp)
     
    }
    var readyData = {};
    readyData[settedKey] = {
      categoryTitle: categoryTitle,
      movies: movies
    }
  //  console.log(readyData)
    this.setData(readyData);

  }
})
