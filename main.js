$(document).ready(initializeApp);

function initializeApp(){
  getOpeningPageGames();
  searchBar();
}

//Global Variables
var videoPlayerThere = false;
var player;
// var input = document.getElementById("searchBar").value
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
      var firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


async function getOpeningPageGames (){
    var openiningPageGameParams = {
      url: "https://api.rawg.io/api/games",
      method: 'GET',
      data: {
        'key': rawgApi.key
      },
      success: getOpeningPageGamesSuccess,
      error: getOpeningPageGamesError,
    }
    await $.ajax( openiningPageGameParams );
}

function getOpeningPageGamesSuccess(responseData){
  console.log('success');
  console.log('responseData', responseData);
  let imageArray = [];
  for(i = 0; i<responseData.results.length; i++){
    imageArray=[];
    for(k=0; k < responseData.results[i].short_screenshots.length; k++){
      imageArray.push(responseData.results[i].short_screenshots[k].image);
    }
    let imageWrapper = $("<div></div>").addClass("imageWrapper col-3");
    let image = $("<img src=" + responseData.results[i].background_image + " class = poster name =" + responseData.results[i].slug +">").data('imageArray', imageArray);
    let posterText = $("<p>"+ responseData.results[i].name + "</p>").addClass("posterText");
    imageWrapper.append(image);
    imageWrapper.append(posterText);
    $('#gameRow').append(imageWrapper);
    // $('#gameRow').append(posterText);
  }
  $(".poster").click(function(){
    console.log($(this).attr("name"));
    console.log('image array', $(this).data("imageArray"))
    let screenshotArray = $(this).data("imageArray");
    $('#gameRow').empty();
    for(i=0; i< imageArray.length-1; i++){
      let screenshots = $("<img class = short_screenshots src =" + screenshotArray[i] + ">")
      $('#screenshots').append(screenshots);
    }
    getTrailer($(this).attr("name"), $(this).attr("imageArray"));
    getGameDesacription($(this).attr("name"))
    getOtherGamesInSeries($(this).attr('name'));
  });
};

function getOpeningPageGamesError(){
  console.log('error');
}

async function getTrailer (name, imageArray){
  videoPlayerThere = true;
  console.log('getTrailer id', name);
  console.log('imageArray2', imageArray);

  var getTrailerParams = {
    url: "https://www.googleapis.com/youtube/v3/search",
    method: 'GET',
    data: {
      'key': youtubeApi.key,
      'part': 'snippet',
      'maxResults': '1',
      'q': name + "trailer"
    },
    success: getTrailerSuccess,
    error: getTrailerError,
  }
  await $.ajax( getTrailerParams );
};



function getTrailerSuccess(responseData, imageArray){
  console.log('trailer success');
  console.log('trailerResponseData', responseData);
  $('#player').css('display', 'inline-block')

  player = new YT.Player('player', {
    height: '390',
    width: '640',
    videoId: responseData.items[0].id.videoId,
    playerVars: {
      'playsinline': 1
    },
  });
}

function getTrailerError(){
  console.log('trailer error');
}

async function getGameDesacription(name){
  var getGameDescriptionParams = {
    url: "https://api.rawg.io/api/games/" + name,
    method: 'Get',
    data: {
      'key': rawgApi.key
    },
    success: getGameDescriptionSuccess,
    error: getGameDescriptionError
  }
  await $.ajax( getGameDescriptionParams )
};

function getGameDescriptionSuccess(responseData){
  console.log('gameDescription', responseData);
  if(responseData.description_raw){
    $("#description").append(responseData.description_raw)
  }else{
    let summary = $("<p>No Description Available</p>").addClass("info")
    $('#description').append(summary)
  }

  if(responseData.publishers[0]){
    let publisher = $("<p>Publisher:      "+ responseData.publishers[0].name + "</p>").addClass("info")
    $("#publishersAndOtherFacts").append(publisher);
  }else{
    let publisher = $("<p>Publisher:      No Information Available</p>").addClass("info")
      $("#publishersAndOtherFacts").append(publisher);
  }

  if(responseData.esrb_rating){
    let esrbRating = $("<p>ESRB Rating:      " + responseData.esrb_rating.name + "</p>").addClass("info")
    $("#publishersAndOtherFacts").append(esrbRating);
  }else{
    let esrbRating = $("<p>ESRB Rating:      No Information Available</p>").addClass("info")
    $("#publishersAndOtherFacts").append(esrbRating);
  }

  if(responseData.metacritic){
    let metacriticScore = $("<p>Metacritic Score:      " +  + responseData.metacritic + "%</p>").addClass("info")
    $("#publishersAndOtherFacts").append(metacriticScore);
  }else{
    let metacriticScore = $("<p>Metacritic Score:      No Information Available</p>").addClass("info")
    $("#publishersAndOtherFacts").append(metacriticScore);
  }

  if(responseData.playtime){
    let playtime = $("<p>Playtime:      " + responseData.playtime + " Hours</p>").addClass("info");
      $("#publishersAndOtherFacts").append(playtime);
  }else{
    let playtime = $("<p>Playtime:      No Information Available</p>").addClass("info")
      $("#publishersAndOtherFacts").append(playtime);
  }

  if(responseData.released){
    let released = $("<p>Released:      " + responseData.released + "</p>").addClass("info");
    $("#publishersAndOtherFacts").append(released);
  }else{
    let released = $("<p>Released:      No Information Available</p>").addClass("info")
      $("#publishersAndOtherFacts").append(released);
  }

  if(responseData.reddit_url){
    let redditUrl = $("<p>Reddit URL:      </p>").addClass("info").append($("<a href =" + responseData.reddit_url + ">"+ responseData.name + " Reddit Page</a>"));
    $("#publishersAndOtherFacts").append(redditUrl);
  }else{
    let redditUrl = $("<p>Reddit URL:      No Information Available</p>").addClass("info")
      $("#publishersAndOtherFacts").append(redditUrl);
  }

  if(responseData.website){
    let website = $("<p>Game Website:      </p>").addClass("info").append($("<a href =" + responseData.website + ">"+ responseData.name + " Website</a>"));
    $("#publishersAndOtherFacts").append(website);
  }else{
    let website = $("<p>Game Website:      No Information Available</p>").addClass("info")
      $("#publishersAndOtherFacts").append(website);
  }

};

function getGameDescriptionError(){
  console.log('description error')
};


async function getOtherGamesInSeries(name){
  var getOtherGamesInSeriesParams = {
    url: "https://api.rawg.io/api/games/"+ name +"/game-series",
    method: 'Get',
    data: {
      'key': rawgApi.key
    },
    success: getOtherGamesInSeriesSuccess,
    error: getOtherGamesInSeriesError
  }
  await $.ajax( getOtherGamesInSeriesParams )
}

function getOtherGamesInSeriesSuccess(responseData){
  console.log('get other games', responseData)
  $("#otherGameTitle").append($("<p>Other Games in Series</p>").addClass('titleBreak'))
  let imageArray = [];
  for(i = 0; i < responseData.results.length; i++) {
    imageArray = [];
  for(k=0; k<responseData.results[i].short_screenshots.length; k++){
    imageArray.push(responseData.results[i].short_screenshots[k].image)
  }
  let otherGameInSeriesWrapper = $("<div></div>").addClass("othergameInSeriesWrapper col-3");
  let othegamesInSeriesImage = $("<img src ="+ responseData.results[i].background_image +" class = otherGameInSeriesPoster name = "+ responseData.results[i].slug + ">").data('imageArray', imageArray)
  let otherGameInSeriesPosterText = $("<p>"+ responseData.results[i].name + "</p>").addClass("otherGameInSeriesPosterText");
  otherGameInSeriesWrapper.append(othegamesInSeriesImage);
  otherGameInSeriesWrapper.append(otherGameInSeriesPosterText);
  $("#getOtherGamesInSeriesRow").append(otherGameInSeriesWrapper);
  }
  $(".otherGameInSeriesPoster").click(function(){
    console.log($(this).attr("name"));
    console.log('image array', $(this).data("imageArray"))
    let screenshotArray = $(this).data("imageArray");
    $('#screenshots').empty();
    $('#description').empty();
    $('#publishersAndOtherFacts').empty();
    $("#otherGameTitle").empty();
    $('#getOtherGamesInSeriesRow').empty();
    for(i=0; i< imageArray.length-1; i++){
      let screenshots = $("<img class = short_screenshots src =" + screenshotArray[i] + ">")
      $('#screenshots').append(screenshots);
    }
    getNewTrailer($(this).attr("name"), $(this).attr("imageArray"));
    getGameDesacription($(this).attr("name"))
    getOtherGamesInSeries($(this).attr('name'));
  });
}

function getOtherGamesInSeriesError(){
  console.log('get other game error')
}


async function getNewTrailer(name, imageArray){
  var getNewTrailerParams = {
    url: "https://www.googleapis.com/youtube/v3/search",
    method: 'GET',
    data: {
      'key': youtubeApi.key,
      'part': 'snippet',
      'maxResults': '1',
      'q': name + "trailer"
    },
    success: getNewTrailerSuccess,
    error: getNewTrailerError,
  }
  await $.ajax( getNewTrailerParams );
}

function getNewTrailerSuccess(responseData){
$('#player').css('display', 'inline-block')
  player.loadVideoById(""+ responseData.items[0].id.videoId + "")
}

function getNewTrailerError(){
  console.log('get new trailer error');
}


function searchBar(){
  $("#button").click(function(){
    let value = $("#searchBar").val();
    console.log(value)
    searchGame(value)
  })
}

function SearchGameInDepth(responseData){
  console.log('success');
  console.log('responseData', responseData);
  let imageArray = [];
  for(i = 0; i<responseData.results.length; i++){
    imageArray=[];
    for(k=0; k < responseData.results[i].short_screenshots.length; k++){
      imageArray.push(responseData.results[i].short_screenshots[k].image);
    }
    let imageWrapper = $("<div></div>").addClass("imageWrapper col-3");
    let image = $("<img src=" + responseData.results[i].background_image + " class = poster name =" + responseData.results[i].slug +">").data('imageArray', imageArray);
    let posterText = $("<p>"+ responseData.results[i].name + "</p>").addClass("posterText");
    imageWrapper.append(image);
    imageWrapper.append(posterText);
    $('#gameRow').append(imageWrapper);
    // $('#gameRow').append(posterText);
  }
  $(".poster").click(function(){
    console.log($(this).attr("name"));
    console.log('image array', $(this).data("imageArray"))
    let screenshotArray = $(this).data("imageArray");
    $('#gameRow').empty();
    for(i=0; i< imageArray.length-1; i++){
      let screenshots = $("<img class = short_screenshots src =" + screenshotArray[i] + ">")
      $('#screenshots').append(screenshots);
    }
    getNewTrailer($(this).attr("name"), $(this).attr("imageArray"));
    getGameDesacription($(this).attr("name"))
    getOtherGamesInSeries($(this).attr('name'));
  });
};

async function searchGame(value){
  debugger;
  if(videoPlayerThere === true){
    var searchGameParams = {
      url: "https://api.rawg.io/api/games",
      method: 'Get',
      data: {
        'key': rawgApi.key,
        "search": value,
      },
      success: searchGameSuccess,
      error: searchGameError
    }
    await $.ajax( searchGameParams )
  }else{
    var searchGameParams = {
      url: "https://api.rawg.io/api/games",
      method: 'Get',
      data: {
        'key': rawgApi.key,
        "search": value,
      },
      success: searchGameSuccessNoPreviousVideo,
      error: searchGameError
    }
    await $.ajax( searchGameParams )
  }
}

function searchGameSuccess(responseData){
  console.log('searcGameData', responseData);
  $("#gameRow").empty();
  $('#screenshots').empty();
  $('#description').empty();
  $('#publishersAndOtherFacts').empty();
  $("#otherGameTitle").empty();
  $('#getOtherGamesInSeriesRow').empty();
  $('#player').css('display', 'none')
  SearchGameInDepth(responseData);
}

function searchGameSuccessNoPreviousVideo(responseData){
  console.log('searcGameData', responseData);
  $("#gameRow").empty();
  $('#screenshots').empty();
  $('#description').empty();
  $('#publishersAndOtherFacts').empty();
  $("#otherGameTitle").empty();
  $('#getOtherGamesInSeriesRow').empty();
  $('#player').css('display', 'none')
  getOpeningPageGamesSuccess(responseData);
}

function searchGameError(){
  console.log('searchGameError');
}
