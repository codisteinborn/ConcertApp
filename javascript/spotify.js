var followArray = [];
var artistArr = [];
var tokenURL = "";

$("#login").on("click", function () {
    window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&scope=user-follow-read&redirect_uri=https://codisteinborn.github.io/ConcertApp/");
});

tokenURL = window.location.href;

var URLArray = tokenURL.split("");
var first = URLArray.indexOf("=") + 1;
var last = URLArray.indexOf("&");
var token = tokenURL.substring(first, last);

var artistRender = function () {
    $("#artistList").empty();
    if (followArray.length > 0) {
        for (i = 0; i < followArray.length; i++) {
            var newDiv = $("<div>");
            newDiv.addClass("artistDiv");
            newDiv.attr("data-artist", followArray[i].name);
            newDiv.html("<p class='artistText'>" + followArray[i].name + "</p>");

            var photoDiv = $("<div>");
            photoDiv.addClass("photoDiv");
            photoDiv.css("background-image", "url('" + followArray[i].photo + "')");


            newDiv.prepend(photoDiv);

            newDiv.on("click", function () {
                if (artistArr.indexOf($(this).attr("data-artist")) < 0) {
                    artistArr.push($(this).attr("data-artist"));
                    if (localStorage.getItem("selectedArtistArray")) {
                        var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
                        storedArtists.push($(this).attr("data-artist"));
                        localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
                    }
                    else {
                        var storedArtists = [];
                        storedArtists.push($(this).attr("data-artist"));
                        localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
                    }
                    $(this).addClass("selectedArtist");
                }
                else {
                    var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
                    storedArtists.splice(artistArr.indexOf($(this).attr("data-artist")), 1);
                    localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
                    artistArr.splice(artistArr.indexOf($(this).attr("data-artist")), 1);
                    $(this).removeClass("selectedArtist");
                }
            });
            $("#artistList").append(newDiv);
        }
    }
    else {
        var errorDiv = $("<div>");
        errorDiv.addClass("artistError");
        errorDiv.text("You don't follow any Artists! Type a name in the space above and click the magnifying glass icon to start.");
        $("#artistList").append(errorDiv);
    }
    if (localStorage.getItem("selectedArtistArray")) {
        var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
        for (j = 0; j < storedArtists.length; j++) {
            if (artistArr.indexOf(storedArtists[j]) < 0) {
                artistArr.push(storedArtists[j]);
                $("div[data-artist='" + storedArtists[j] + "']").addClass("selectedArtist");
            }
        }
        artistSearch();
    }
}

if (last > 0) {
    if (!localStorage.getItem("follow")) {
        $.ajax({
            url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
            headers: {
                'Authorization': 'Bearer ' + token
            },

            success: function (response) {

                var followList = function () {
                    followArray = [];
                    for (i = 0; i < response.artists.items.length; i++) {
                        var newArtist = {
                            name: "",
                            photo: ""
                        };
                        newArtist.name = response.artists.items[i].name;
                        newArtist.photo = response.artists.items[i].images[0].url;
                        followArray.push(newArtist);
                    };
                };
                followList();
                function compare(a, b) {
                    if (a.name < b.name)
                        return -1;
                    if (a.name > b.name)
                        return 1;
                    return 0;
                }
                followArray.sort(compare);
                artistRender();
            },
            error: function (response) {
                console.log("couldn't get follow list (1) error response", response);
            }
        });
    }
    else {

        tokenURL = window.location.href;

        var URLArray = tokenURL.split("");
        var first = URLArray.indexOf("=") + 1;
        var last = URLArray.indexOf("&");
        var token = tokenURL.substring(first, last);
        var spotifyID = "";
        var artist = localStorage.getItem("follow");
        localStorage.removeItem("follow");

        $.ajax({
            url: 'https://api.spotify.com/v1/search?q=' + artist + '&type=artist',
            headers: {
                'Authorization': 'Bearer ' + token
            },

            success: function (response) {
                if (response.artists.items[0].id) {
                    spotifyID = response.artists.items[0].id;

                    $.ajax({
                        method: "PUT",
                        url: 'https://api.spotify.com/v1/me/following?type=artist&ids=' + spotifyID,
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },

                        success: function (response) {

                            $.ajax({
                                url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
                                headers: {
                                    'Authorization': 'Bearer ' + token
                                },

                                success: function (response) {

                                    var followList = function () {
                                        followArray = [];
                                        for (i = 0; i < response.artists.items.length; i++) {
                                            var newArtist = {
                                                name: "",
                                                photo: ""
                                            };
                                            newArtist.name = response.artists.items[i].name;
                                            newArtist.photo = response.artists.items[i].images[0].url;
                                            followArray.push(newArtist);
                                        }
                                    };
                                    followList();
                                    
                                    function compare(a, b) {
                                        if (a.name < b.name)
                                            return -1;
                                        if (a.name > b.name)
                                            return 1;
                                        return 0;
                                    }
                                    followArray.sort(compare);

                                    artistRender();

                                },
                                error: function (response) {
                                    console.log("got ID, followed artist, couldn't get follow list (2) error", response);
                                }
                            });
                        },
                        error: function (response) {
                            console.log("got ID, couldn't follow artist error", response);
                        }
                    });
                }

                else {
                    $.ajax({
                        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },

                        success: function (response) {

                            var followList = function () {
                                followArray = [];
                                for (i = 0; i < response.artists.items.length; i++) {
                                    var newArtist = {
                                        name: "",
                                        photo: ""
                                    };
                                    newArtist.name = response.artists.items[i].name;
                                    newArtist.photo = response.artists.items[i].images[0].url;
                                    followArray.push(newArtist);
                                }
                            };

                            followList();

                            function compare(a, b) {
                                if (a.name < b.name)
                                    return -1;
                                if (a.name > b.name)
                                    return 1;
                                return 0;
                            }

                            followArray.sort(compare);

                            artistRender();

                            var errorDiv = $("<div>");
                            errorDiv.addClass("artistError");
                            errorDiv.text("No results found for " + artist + ".");
                            $("#artistList").prepend(errorDiv);

                        },
                        error: function (response) {
                            console.log("got ID, followed artist, couldn't get follow list (2) error", response);
                        }
                    });
                }
            }
        });
    }
}


$("#followButton").on("click", function () {
    var artist = String($("#followArtist").val());
    localStorage.setItem("follow", artist);
    if (localStorage.getItem("selectedArtistArray")) {
        var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
        storedArtists.push(artist);
        localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
    }
    else {
        var storedArtists = [];
        storedArtists.push(artist);
        localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
    }
    window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&scope=user-follow-modify&redirect_uri=https://codisteinborn.github.io/ConcertApp/");
});

$("#clearButton").on("click", function () {
    artistArr = [];
    localStorage.removeItem("selectedArtistArray");
    $(".selectedArtist").removeClass("selectedArtist");
    $("#concertList").empty();
});