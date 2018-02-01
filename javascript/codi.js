var artist = "Slayer";
var city = "";
var queryURL = "";
var concertInfo = {};

$(".btn").on("click", function (event) {
    city = String($("#city").val());
    queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artist + "&city=" + city + "&radius=30&apikey=f4oDs35w3TxVEHx3jnVKhKSCH7IW63g7";
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
        console.log(response);
        console.log(queryURL);
        console.log(concertInfo)
    });
});