var artist = "Taylor Swift";
var city = "Chicago";
var queryURL = "https://app.ticketmaster.com/discovery/v2/events.json?keyword=" + artist + "&city=" + city + "&apikey=f4oDs35w3TxVEHx3jnVKhKSCH7IW63g7";


$.ajax({
    url: queryURL,
    type: "GET",
    dataType: "json",
}).then(function (response) {
    console.log("name", response._embedded.events[0].name);
    console.log("date", response._embedded.events[0].dates.start.localDate);
    console.log("name", response._embedded.events[0]._embedded.venues[0].name);
    console.log("url", response._embedded.events[0].url);
});