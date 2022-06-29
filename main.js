$(document).ready(initializeApp);

function initializeApp(){
  getOpeningPageGames();
}

//Global Variables

var player;
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
    let imageWrapper = $("<div></div>").addClass("imageWrapper");
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

  $("#description").append(responseData.description_raw)
  let publisher = $("<p>Publisher:      "+ responseData.publishers[0].name + "</p>").addClass("info")
  $("#publishersAndOtherFacts").append(publisher);
  let esrbRating = $("<p>ESRB Rating:      " + responseData.esrb_rating.name + "</p>").addClass("info")
  $("#publishersAndOtherFacts").append(esrbRating);
  let metacriticScore = $("<p>Metacritic Score:      " +  + responseData.metacritic + "%</p>").addClass("info")
  $("#publishersAndOtherFacts").append(metacriticScore);
  let playtime = $("<p>Playtime:      " + responseData.playtime + " Hours</p>").addClass("info");
  $("#publishersAndOtherFacts").append(playtime);
  let released = $("<p>Released:      " + responseData.released + "</p>").addClass("info");
  $("#publishersAndOtherFacts").append(released);
  let redditUrl = $("<p>Reddit URL:      </p>").addClass("info").append($("<a href =" + responseData.reddit_url + ">"+ responseData.name + " Reddit Page</a>"));
  $("#publishersAndOtherFacts").append(redditUrl);
  let website = $("<p>Game Website:      </p>").addClass("info").append($("<a href =" + responseData.website + ">"+ responseData.name + " Website</a>"));
  $("#publishersAndOtherFacts").append(website);

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
  let otherGameInSeriesWrapper = $("<div></div>").addClass("othergameInSeriesWrapper");
  let othegamesInSeriesImage = $("<img src ="+ responseData.results[i].background_image +" class = otherGameInSeriesPoster name = "+ responseData.results[i].slug + ">").data('imageArray', imageArray)
  let otherGameInSeriesPosterText = $("<p>"+ responseData.results[i].name + "</p>").addClass("otherGameInSeriesPosterText");
  otherGameInSeriesWrapper.append(othegamesInSeriesImage);
  otherGameInSeriesWrapper.append(otherGameInSeriesPosterText);
  $("#getOtherGamesInSeries").append(otherGameInSeriesWrapper);
  }
  $(".otherGameInSeriesPoster").click(function(){
    console.log($(this).attr("name"));
    console.log('image array', $(this).data("imageArray"))
    let screenshotArray = $(this).data("imageArray");
    $('#screenshots').empty();
    $('#description').empty();
    $('#publishersAndOtherFacts').empty();
    $("#otherGameTitle").empty();
    $('#getOtherGamesInSeries').empty();
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
  player.loadVideoById(""+ responseData.items[0].id.videoId + "")
}

function getNewTrailerError(){
  console.log('get new trailer error');
}
