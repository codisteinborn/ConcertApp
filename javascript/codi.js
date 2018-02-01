var artist = "Taylor Swift";
var artistArr = ["Taylor Swift", "Hamilton", "Disney", "Hairball", "Keith Urban", "Thomas Rhett"];
var city = "";
var queryURL = "";
var concertInfo = {};
var allConcerts = [];

$(".btn").on("click", function (event) {
    $("#list").empty();
    allConcerts = [];
    for (var i = 0; i < artistArr.length; i++) {
        city = String($("#city").val());
        queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artistArr[i] + "&city=" + city + "&radius=30&apikey=f4oDs35w3TxVEHx3jnVKhKSCH7IW63g7";
        $.ajax({
            url: queryURL,
            type: "GET",
            dataType: "json",
        }).then(function (response) {
            concertInfo = {
                name: response._embedded.events[0].name,
                date: response._embedded.events[0].dates.start.localDate,
                venue: response._embedded.events[0]._embedded.venues[0].name,
                url: response._embedded.events[0].url
            }
            allConcerts.push(concertInfo);
            var renderConcerts = function () {
                var j = allConcerts.length - 1;
                    $("#list").append("<p>" + allConcerts[j].name + "</p>");
                    $("#list").append("<p>" + allConcerts[j].date + "</p>");
                    $("#list").append("<p>" + allConcerts[j].venue + "</p>");
                };
            
            renderConcerts();
        });
    }
    console.log(concertInfo);
    console.log(allConcerts);
});

