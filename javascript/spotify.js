var spotify = function () {
    var followArray = [];
    var artistArr = [];
    var tokenURL = "";

/**
 * Redirects user to Spotify authorization page
 */

    $("#login").on("click", function () {
        window.location.replace("https://accounts.spotify.com/en/authorize?client_id=84dbfb40bf444d6bb409195e34dcd32d&response_type=token&scope=user-follow-read&redirect_uri=https://codisteinborn.github.io/ConcertApp/");
    });

    tokenURL = window.location.href;

    var URLArray = tokenURL.split("");
    var first = URLArray.indexOf("=") + 1;
    var last = URLArray.indexOf("&");
    var token = tokenURL.substring(first, last);

/**
 * Renders artists the user follows on Spotify to the page, adds onclick that: adds to and removes from div the selectedArtist class; adds artists to and removes artists from and from artistArr; adds artist to and removes artists from localStorage.
 * @param {array} followArray - array of artist names and photos created from Spotify API call
 */

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
            searchFun();
        }
    };

/**
 * Checks for token and localStorage, makes ajax calls to Spotify for followed artist list and, if localStorage exists, follows a new artist. Adds artist names and photos to followArray, calls render function. 
 * @param {object} JSON response to ajax calls - includes artist name and photo.
 * 
 * @returns {array} followArray - array of artist names and photos.
 */

    if (last > 0) {
        if (!localStorage.getItem("follow")) {
            $.ajax({
                url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).done(function (response) {

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

            }).fail(function (response) {
                console.log("couldn't get follow list (1) error response", response);
            });
        }
        else {

            var spotifyID = "";
            var artist = localStorage.getItem("follow");
            localStorage.removeItem("follow");

            $.ajax({
                url: 'https://api.spotify.com/v1/search?q=' + artist + '&type=artist',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            }).done(function (response) {
                if (response.artists.items[0]) {
                    spotifyID = response.artists.items[0].id;

                    $.ajax({
                        method: "PUT",
                        url: 'https://api.spotify.com/v1/me/following?type=artist&ids=' + spotifyID,
                        headers: {
                            'Authorization': 'Bearer ' + token
                        }
                    }).done(function (response) {

                        $.ajax({
                            url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
                            headers: {
                                'Authorization': 'Bearer ' + token
                            },
                        }).done(function (response) {

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

                        }).fail(function (response) {
                            console.log("got ID, followed artist, couldn't get follow list (2) error", response);
                        });
                    }).fail(function (response) {
                        console.log("got ID, couldn't follow artist error", response);
                    });
                }

                else {
                    $.ajax({
                        url: 'https://api.spotify.com/v1/me/following?type=artist&limit=50',
                        headers: {
                            'Authorization': 'Bearer ' + token
                        },
                    }).done(function (response) {

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

                        var storedArtists = JSON.parse(localStorage.getItem("selectedArtistArray"));
                        storedArtists.splice(artistArr.indexOf(artist), 1);
                        localStorage.setItem("selectedArtistArray", JSON.stringify(storedArtists));
                        artistArr.splice(artistArr.indexOf(artist), 1);

                        artistRender();

                        var errorDiv = $("<div>");
                        errorDiv.addClass("artistError");
                        errorDiv.text("No results found for " + artist + ".");
                        $("#artistList").prepend(errorDiv);

                    }).fail(function (response) {
                        console.log("got ID, followed artist, couldn't get follow list (2) error", response);
                    });
                }
            });
        }
    }

/**
 * Saves artist to localStorage when user chooses to follow a new artist. Redirects user to Spotify to get new token.
 * @param {string} value of user input in the "follow" search box
 */

    $("#followButton").on("click", function () {
        if (String($("#followArtist").val()) !== "") {
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
        }
    });

/**
 * Clear button - clears selected artists from artistArr and localStorage
 */

    $("#clearButton").on("click", function () {
        artistArr.splice(0,artistArr.length);
        localStorage.removeItem("selectedArtistArray");
        $(".selectedArtist").removeClass("selectedArtist");
        $("#concertList").empty();

    });
    
    return artistArr;
}();
