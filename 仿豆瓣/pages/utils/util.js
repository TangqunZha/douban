function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 0; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    }
    else {
      array.push(0);
    }
  }
  return array;
}
function convertToCastString(casts) {
  var castsjoin = "";
  for (var idx in casts) {
    castsjoin += casts[idx].name + " / "
  }
  return castsjoin.substring(0, castsjoin.length-2);
}
function convertToCastInfo(casts){
  var castsArray=[];
  for(var idx in casts){
    var cast={
      img: !casts[idx].avatar ? casts[idx].avatars.large : "",
      name:casts[idx].name
    }
    castsArray.push(cast);
  }
  return castsArray;
}
function http(url, callBack) {
  //  var that = this;
  wx.request({
    url: url,
    data: {},
    method: 'GET',
    header: {
      "Content-Type": "application/xml"
    },
    success: function (res) {
      callBack(res.data)
    },
    fail: function (error) {

    },
  })
}

module.exports = {
  convertToCastString: convertToCastString,
  convertToCastInfo: convertToCastInfo,
  convertToStarsArray: convertToStarsArray,
  http: http
}