var city = "";
var queryURL = "";
var concertInfo = {};
var allConcerts = [];
var time = moment.utc().format();
var searchTime = time.substring(0, 19) + "Z";
var rendering = false;

if (localStorage.getItem("city")) {
    city = localStorage.getItem("city");
    $("#city").val(city);
}

var citySearch = function () {

    allConcerts = [];
    city = String($("#city").val());
    localStorage.setItem("city", city);
    for (var i = 0; i < artistArr.length; i++) {
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&city=" + city + "&sort=date,asc&startDateTime=" + searchTime + "&radius=30&apikey=aEo9tgraRerkwjEgT4qifF3P6rJBXxd7";
        console.log("citySearch queryURL", queryURL);
        $.ajax({
            url: queryURL,
            type: "GET",
            dataType: "json",
            success: function (response) {
                console.log("success", response)
                for (k in response._embedded.events) {
                    concertInfo = {
                        name: response._embedded.events[k].name,
                        date: response._embedded.events[k].dates.start.localDate,
                        venue: response._embedded.events[k]._embedded.venues[0].name,
                        venueCity: response._embedded.events[k]._embedded.venues[0].city.name,
                        url: response._embedded.events[k].url,
                        image: response._embedded.events[k].images
                    }

                    allConcerts.push(concertInfo);
                    console.log(concertInfo)
                }
                renderConcerts();
            },
            error: function (response) {
                console.log("error", response);
                return response;
            }

        });
    };
};

var artistSearch = function () {

    if (city === "") {

        allConcerts = [];
        for (var i = 0; i < artistArr.length; i++) {
            city = String($("#city").val());
            queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&sort=date,asc&startDateTime=" + searchTime + "&apikey=aEo9tgraRerkwjEgT4qifF3P6rJBXxd7";
            console.log("artistSearch queryURL", queryURL);
            $.ajax({
                url: queryURL,
                type: "GET",
                dataType: "json",
                success: function (response) {
                    console.log("success", response)
                    for (k in response._embedded.events) {
                        concertInfo = {
                            name: response._embedded.events[k].name,
                            date: response._embedded.events[k].dates.start.localDate,
                            venue: response._embedded.events[k]._embedded.venues[0].name,
                            venueCity: response._embedded.events[k]._embedded.venues[0].city.name,
                            url: response._embedded.events[k].url,
                            image: response._embedded.events[k].images
                        }
                        allConcerts.push(concertInfo);
                        console.log(concertInfo)
                    }
                    renderConcerts();
                },
                error: function (response) {
                    console.log("error", response);
                    return response;
                }
            });
        };
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
        // var dates = []
        // for (i in allConcerts) {
        //     dates.push(allConcerts[i].date)
        // }

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
            var months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
            tmMonth = months[tmMonth - 1];
            var tmDay = allConcerts[j].date.substring(8, 10);
            newAnchor.append($(concertTextDate).append(tmMonth));
            newAnchor.append($(concertTextDate).append("<p id='dayStyle'>" + tmDay + "</p>"));
            var concertTextName = $("<p>");
            concertTextName.addClass("overlayConcertTextName");
            newAnchor.append($(concertTextName).text(allConcerts[j].name));
            var concertTextVenue = $("<p>");
            concertTextVenue.addClass("overlayConcertTextVenue");
            newAnchor.append($(concertTextVenue).text(allConcerts[j].venue + ", " + allConcerts[j].venueCity));
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
    artistSearch();
}

var cityClick = function (event) {
    event.preventDefault();
    citySearch();
}


$("#artistList").on("click", artistClick);
$("#citybtn").on("click", cityClick);
