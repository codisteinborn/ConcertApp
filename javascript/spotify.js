var followArray = [];
var artistArr = [];
var tokenURL = "";

$("#login").on("click", function(){
    window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&scope=user-follow-read&redirect_uri=https://codisteinborn.github.io/ConcertApp/");
});

tokenURL = window.location.href;

var URLArray = tokenURL.split("");
var first = URLArray.indexOf("=") + 1;
var last = URLArray.indexOf("&");
var token = tokenURL.substring(first, last);

if (last > 0){
    $.ajax({
        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
        headers: {
        'Authorization': 'Bearer ' + token
        },
        success: function(response) {

            var followList = function (){
                for (i = 0; i < response.artists.items.length; i++){
                followArray.push(response.artists.items[i].name);
                }
            }

            var artistRender = function(){
                for (i = 0; i < followArray.length; i++){
                    console.log("artist", followArray[i]);
                    var newDiv = $("<p>");
                    newDiv.addClass("artistDiv");
                    newDiv.attr("data-artist",followArray[i]);
                    newDiv.text(followArray[i]);
                    newDiv.on("click", function(){
                        if (artistArr.indexOf($(this).attr("data-artist")) < 0){
                            artistArr.push($(this).attr("data-artist"));
                            $(this).addClass("selectedArtist");
                        }
                        else {
                            artistArr.splice(artistArr.indexOf($(this).attr("data-artist")), 1);
                            $(this).removeClass("selectedArtist");
                        }
                    });
                    $("#artistList").append(newDiv);
                }
            }

            followList();
            artistRender();
        }
    });
}