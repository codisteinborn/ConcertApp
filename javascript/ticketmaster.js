var userCity = "";
var queryURL = "";
var concertInfo = {};
var allConcerts = [];
var time = moment.utc().format();
var searchTime = time.substring(0, 19) + "Z";
var rendering = false;

if (localStorage.getItem("city")) {
    userCity = localStorage.getItem("city");
    $("#city").val(userCity);
}``

var citySearch = function () {

    allConcerts = [];
    userCity = String($("#city").val());
    localStorage.setItem("city", userCity);
    var artistName = "";
    for (let i = 0; i < artistArr.length; i++) {
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&city=" + userCity + "&sort=date,asc&startDateTime=" + searchTime + "&radius=30&apikey=aEo9tgraRerkwjEgT4qifF3P6rJBXxd7";
        $.ajax({
            url: queryURL,
            type: "GET",
            dataType: "json",
            success: function (response) {
                if (response._embedded) {
                    for (k in response._embedded.events) {
                        concertInfo = {
                            name: artistArr[i],
                            date: response._embedded.events[k].dates.start.localDate,
                            venue: response._embedded.events[k]._embedded.venues[0].name,
                            venueCity: response._embedded.events[k]._embedded.venues[0].city.name,
                            url: response._embedded.events[k].url,
                            image: response._embedded.events[k].images
                        }
                        allConcerts.push(concertInfo);
                        console.log("city", allConcerts);
                    }
                    renderConcerts();
                }
                else {
                    if (allConcerts.length === 0) {
                        if ($(".concertError").length === 0 && $(".concertDiv").length === 0){
                            var errorDiv = $("<div>");
                            errorDiv.addClass("concertError");
                            errorDiv.text("Sorry, there are no upcoming shows for your selected artists.");
                            $("#concertList").append(errorDiv);
                        }
                        else if ($(".concertError").length === 0 && $(".concertDiv").length > 0){
                            $("#concertList").empty();
                            var errorDiv = $("<div>");
                            errorDiv.addClass("concertError");
                            errorDiv.text("Sorry, there are no upcoming shows for your selected artists.");
                            $("#concertList").append(errorDiv);
                        }
                    }
                }
            },
            error: function (response) {
                return response;
            }

        });
    };
};

var artistSearch = function () {

    if (userCity === "") {
        allConcerts = [];
        for (let i = 0; i < artistArr.length; i++) {
            // userCity = String($("#city").val());
            queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&sort=date,asc&startDateTime=" + searchTime + "&apikey=aEo9tgraRerkwjEgT4qifF3P6rJBXxd7";
            $.ajax({
                url: queryURL,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    if (response._embedded) {
                        for (k in response._embedded.events) {
                            concertInfo = {
                                name: artistArr[i],
                                date: response._embedded.events[k].dates.start.localDate,
                                venue: response._embedded.events[k]._embedded.venues[0].name,
                                venueCity: response._embedded.events[k]._embedded.venues[0].city.name,
                                url: response._embedded.events[k].url,
                                image: response._embedded.events[k].images
                            }
                            allConcerts.push(concertInfo);
                            console.log("no city", allConcerts);
                        }
                        renderConcerts();
                    }
                    else {
                        if (allConcerts.length === 0) {
                            if ($(".concertError").length === 0 && $(".concertDiv").length === 0){
                                var errorDiv = $("<div>");
                                errorDiv.addClass("concertError");
                                errorDiv.text("Sorry, there are no upcoming shows for your selected artists.");
                                $("#concertList").append(errorDiv);
                            }
                            else if ($(".concertError").length === 0 && $(".concertDiv").length > 0){
                                $("#concertList").empty();
                                var errorDiv = $("<div>");
                                errorDiv.addClass("concertError");
                                errorDiv.text("Sorry, there are no upcoming shows for your selected artists.");
                                $("#concertList").append(errorDiv);
                            }
                        }
                    }
                },
                error: function (response) {
                    return response;
                }
            });
        }
    }
    else {
        citySearch();
    }
};

var renderConcerts = function () {
    while (rendering) {
        console.log("function waiting for rendering to finish");
    }
    if (!rendering) {
        rendering = true;

        allConcerts.sort(function (a, b) {
            var dateA = new Date(a.date);
            var dateB = new Date(b.date);
            return dateA - dateB;
        });
        for (key in allConcerts) {
            allConcerts[key].image.sort(function (a, b) {
                var widthA = new Number(a.width);
                var widthB = new Number(b.width);
                return widthB - widthA;
            })
        };

        $("#concertList").empty();

        for (var j = 0; j < allConcerts.length; j++) {
            var newAnchor = $("<div>");
                newAnchor.addClass("col-md-6");
                newAnchor.addClass("concertDiv");

            var concertPicDiv = $("<div>");
                concertPicDiv.addClass("concertPic");
                concertPicDiv.css("background-image", "url('" + allConcerts[j].image[1].url + "')");
            newAnchor.append(concertPicDiv);

            var concertTextDate = $("<div>");
                concertTextDate.addClass("overlayConcertTextDate");
            var tmYear = allConcerts[j].date.substring(0, 4);
            var tmMonth = allConcerts[j].date.substring(5, 7);
                tmMonth = parseInt(tmMonth);
            var months = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
                tmMonth = months[tmMonth - 1];
            var tmDay = allConcerts[j].date.substring(8, 10);
            newAnchor.append($(concertTextDate).append(tmMonth));
            newAnchor.append($(concertTextDate).append("<p id='dayStyle'>" + tmDay + "</p>"));

            var concertTextName = $("<p>");
                concertTextName.addClass("overlayConcertTextName");
            newAnchor.append($(concertTextName).text(allConcerts[j].name));

            var concertTextVenue = $("<p>");
                concertTextVenue.addClass("overlayConcertTextVenue");
                console.log(userCity);
                if (userCity) {
                    newAnchor.append($(concertTextVenue).text(allConcerts[j].venue)); 
                } else {
                    newAnchor.append($(concertTextVenue).text(allConcerts[j].venueCity));
                }
            
            newAnchor.attr("href", allConcerts[j].url);
            newAnchor.on("click", function () {
                window.open($(this).attr("href"), '_blank');
            });
           
            $("#concertList").append(newAnchor);
        };
        rendering = false;

    };

};
var artistClick = function (event) {
    event.preventDefault();
    if (artistArr.length > 0) {
        artistSearch();
    }
    else {
        $("#concertList").empty();
    }
}

var cityClick = function (event) {
    event.preventDefault();
    citySearch();
}

$("#artistList").on("click", artistClick);
$("#citybtn").on("click", cityClick);
