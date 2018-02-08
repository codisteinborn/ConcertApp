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

$("#login").on('click', function () {
    $("#myNav").addClass("hidden");
    window.scrollTo(0, 0);
});

$(".closebtn").on('click', function () {
    window.scrollTo(0, 0);
    $("#myNav").addClass("hidden");
});

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