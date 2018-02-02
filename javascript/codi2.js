var city = "";
var queryURL = "";
var concertInfo = {};
var allConcerts = [];
var artistArr = ["Taylor Swift", "Kenny Chesney", "Kygo", "Hamilton"]

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
                venueCity: response._embedded.events[0]._embedded.venues[0].city.name,
                url: response._embedded.events[0].url,
                image: response._embedded.events[0].images[0].url
            }
            allConcerts.push(concertInfo);

            allConcerts.sort(function (a, b) {
                var dateA = new Date(a.date);
                var dateB = new Date(b.date);
                return dateA - dateB;
            });
        });
    };
    // renderConcerts(); 
    setTimeout(function () { renderConcerts(); }, 1500);
});

var renderConcerts = function () {
        for (var j = 0; j < allConcerts.length; j++) {
            //newAnchor.append("<link>");
            var newAnchor = $("<div>");
            newAnchor.addClass("concertDiv");
            newAnchor.append("<p>" + allConcerts[j].name + "</p>");
            newAnchor.append("<p>" + allConcerts[j].date + "</p>");
            newAnchor.append("<p>" + allConcerts[j].venueCity + "</p>");
            newAnchor.append("<p>" + allConcerts[j].venue + "</p>");
            // newAnchor.append("<link>")
            newAnchor.attr("href", allConcerts[j].url);
            //newAnchor.attr("target", "_blank");
            newAnchor.click(function () {
                window.open(allConcerts[j].url, '_blank');
            });
            $("#list").append(newAnchor);
        };
};
