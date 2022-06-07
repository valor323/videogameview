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
        'key': "cac5118079744913b2a5b9cc871b510a"
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
    let image = $("<img src=" + responseData.results[i].background_image + " class = poster name =" + responseData.results[i].slug +">").data('imageArray', imageArray);
    $('#gameRow').append(image)
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
      'key': "AIzaSyAlkCSOOQa7QkYOjN3F1l3o4591AJYV3qM",
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


  // for(i = 0; i<responseData.results.length; i++){
  //   let image = $("<img src=" + responseData.results[i].background_image + " class = poster name =" + responseData.results[i].slug +">")
  //   $('#gameRow').append(image)
  // }


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
