// pages/movies/more-movie/more-movie.js
var app =getApp()
var util = require('../../utils/util.js');
Page({
  /**
   * 页面的初始数据
   */
  data: {
    movies:[],
    //  navigateTitle:"",
    requestUrl:'',
    totalCount:0,
    isEmpty:true,
    
  },
  onLoad: function (options) {
    var category = options.category;
    var dataUrl = "";
    switch (category) {
      case "正在热映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/in_theaters";
        break;
      case "即将上映":
        dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon"
        break;
      case "豆瓣TOP250":
        dataUrl = app.globalData.doubanBase + "/v2/movie/top250";
        break;
    }
    this.data.requestUrl = dataUrl;
    util.http(dataUrl,this.processDoubanData)

    // this.data.navigateTitle =category
    console.log(category)
    wx.setNavigationBarTitle({
      title: category,
    })
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.movieid
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId,
    })
  },
  onScrollLower:function(event){
    
    var nextUrl=this.data.requestUrl+"?start="+this.data.totalCount+"&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },
  onPullDownRefresh:function(event){
    var refreshUrl =this.data.requestUrl+"?start=0&count";
    this.data.movies=[];
    this.data.totalCount=0;
    this.data.isEmpty=true
    util.http(refreshUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
    
    
  },
  processDoubanData: function (movieData, settedKey ){
    var movies = [];
    for (let idx in movieData.subjects) {
   //   console.log(movieData.subjects[idx])
      var subject = movieData.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        console.log(title.length)

        title = title.slice(0, 6) + '...'
        console.log(title)
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
    var totalMovies =[];
    this.data.totalCount=+20;
    //如果要绑定新加载的数据，那么需要同旧数据合并在一起



    //存在对象没去重的问题?

    if(!this.data.isEmpty){
      
      totalMovies = this.data.movies.concat(movies);
      console.log(totalMovies)
      console.log(this.data.totalCount)
    
    }else{
      totalMovies=movies;
      this.data.isEmpty=false;
    }
    this.setData({
      movies:totalMovies
    });

   // this.data.totalCount +=20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
  }
  // onReady:function(event){
  //   wx.setNavigationBarTitle({
  //     title: this.data.naigateTitle,
  //   })
  // }

})