/**
 * This function decides whether to hide or display the overlay login screen once a user opens the page
 * @param {string} loadURL - the url of the application when the user loads the page
 * @param {array} loadURLArr - splits the loadURL into an array of substrings if there are any spaces in it
 * @param {string} loadURLTest - function uses this variable to decide whether or not the user is already logged in- if they are hide the overlay login screen
 * 
 */
$(window).on('load', function () {
    var loadURL = window.location.href;
    var loadURLArr = loadURL.split("");
    var loadURLTest = loadURLArr.indexOf("&");
    if (loadURLTest < 0) {
        window.scrollTo(0, 0);
        $("#myNav").removeClass("hidden");
    }
    else {
        $("#myNav").addClass("hidden");
    }
});

var overlayHide = function () {
    window.scrollTo(0, 0);
    $("#myNav").addClass("hidden");
};
/**
 * These click functions hide the overlay login screen
 * @param {event} click
 * @param {function} overlayHide
 */
$(".closebtn").on('click', overlayHide)
$("#login").on('click', overlayHide)

/**
 * This function scrolls to the top of the page once you have logged in and then scrolls the user down below the jumbotron once they click the down arrow button
 * @param {event} click
 */
$(document).ready(function () {
    window.scrollTo(0, 0);
    $("a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            var hash = this.hash;
            $('html, body').animate({
                scrollTop: $(hash).offset().top
            }, 900, function () {
                window.location.hash = hash;
            });
        }
    });
});
/**
 * This enables the tooltip over the arrow down button
 */
$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip(); 
});