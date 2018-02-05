var city = "";
var queryURL = "";
var concertInfo = {};
var allConcerts = [];
var time = moment.utc().format();
var searchTime = time.substring(0, 19) + "Z";

var cityClick = function () {
    event.preventDefault();
    $("#list").empty();
    allConcerts = [];
    for (var i = 0; i < artistArr.length; i++) {
        city = String($("#city").val());
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&city=" + city + "&sort=date,asc&startDateTime=" + searchTime + "&radius=30&apikey=f4oDs35w3TxVEHx3jnVKhKSCH7IW63g7";
        $.ajax({
            url: queryURL,
            type: "GET",
            dataType: "json",
        }).then(function (response) {
            for (k in response._embedded.events) {
                concertInfo = {
                    name: response._embedded.events[k].name,
                    date: response._embedded.events[k].dates.start.localDate,
                    venue: response._embedded.events[k]._embedded.venues[0].name,
                    venueCity: response._embedded.events[k]._embedded.venues[0].city.name,
                    url: response._embedded.events[k].url,
                    image: response._embedded.events[k].images[0].url
                }
                allConcerts.push(concertInfo);
            }
            allConcerts.sort(function (a, b) {
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                return dateA - dateB;
            });
        });
    };
    setTimeout(function () { renderConcerts(); }, 2000);
};

var artistClick = function () {
    event.preventDefault();
    $("#list").empty();
    allConcerts = [];
    for (var i = 0; i < artistArr.length; i++) {
        city = String($("#city").val());
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&sort=date,asc&startDateTime=" + searchTime + "&apikey=f4oDs35w3TxVEHx3jnVKhKSCH7IW63g7";
        $.ajax({
            url: queryURL,
            type: "GET",
            dataType: "json",
        }).then(function (response) {
            for (var k = 0; k < 20; k++) {
                concertInfo = {
                    name: response._embedded.events[k].name,
                    date: response._embedded.events[k].dates.start.localDate,
                    venue: response._embedded.events[k]._embedded.venues[0].name,
                    venueCity: response._embedded.events[k]._embedded.venues[0].city.name,
                    url: response._embedded.events[k].url,
                    image: response._embedded.events[k].images[0].url
                }
                allConcerts.push(concertInfo);
            }

            allConcerts.sort(function (a, b) {
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                return dateA - dateB;
            });
        });
    };
    setTimeout(function () { renderConcerts(); }, 2000);
};

var renderConcerts = function () {
    for (var j = 0; j < allConcerts.length; j++) {
        var newAnchor = $("<div>");
        newAnchor.addClass("concertDiv");
        newAnchor.append("<img src='" + allConcerts[j].image + "' alt='Concert Poster Image' height='56' width='100' />");
        newAnchor.append("<p>" + allConcerts[j].name + "</p>");
        newAnchor.append("<p>" + allConcerts[j].date + "</p>");
        //newAnchor.append("<p>" + allConcerts[j].venueCity + "</p>");
        newAnchor.append("<p>" + allConcerts[j].venue + ", " + allConcerts[j].venueCity + "</p>");
        newAnchor.attr("href", allConcerts[j].url);
        newAnchor.click(function () {
            window.open($(this).attr("href"), '_blank');
        });
        $("#list").append(newAnchor);
    };
};

$("#artistList").on("click", artistClick)
$("#citybtn").on("click", cityClick)