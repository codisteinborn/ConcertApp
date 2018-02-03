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

var artistRender = function(){
    $("#artistList").empty();
    for (i = 0; i < followArray.length; i++){
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

            followList();
            artistRender();
            console.log("followArray", followArray);
        }
    });
    
    if (localStorage.getItem("follow")){

        console.log("local storage added?", localStorage.getItem("follow"));

        tokenURL = window.location.href;

        var URLArray = tokenURL.split("");
        var first = URLArray.indexOf("=") + 1;
        var last = URLArray.indexOf("&");
        var token = tokenURL.substring(first, last);
        var spotifyID = "";
        var artist = localStorage.getItem("follow");

        followArray.push(artist);

        console.log("followArray", followArray);

        $.ajax({
            url: 'https://api.spotify.com/v1/search?q=' + artist + '&type=artist',
            headers: {
            'Authorization': 'Bearer ' + token
            },

            success: function(response) {
                spotifyID = response.artists.items[0].id;
                console.log(spotifyID);

                $.ajax({
                    method: "PUT",
                    url: 'https://api.spotify.com/v1/me/following?type=artist&ids=' + spotifyID,
                    headers: {
                    'Authorization': 'Bearer ' + token
                    },
            
                    success: function(response) {
                        console.log(artist, "followed");

                        localStorage.removeItem("follow");

                        console.log("local storage cleared?", localStorage.getItem("follow"));

                        artistRender();

                    }
                });
            }
        });

    };
    
};


$("#followButton").on("click", function(){
    var artist = String($("#followArtist").val());
    localStorage.setItem("follow", artist);
    window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&scope=user-follow-modify&redirect_uri=https://codisteinborn.github.io/ConcertApp/");
});