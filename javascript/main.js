$(window).on('load', function () {
    var loadURL = window.location.href;
    var loadURLArr = loadURL.split("");
    var loadURLTest = loadURLArr.indexOf("&");
    if (loadURLTest < 0) {
        $("#myNav").style.width = "100%";
    }
    else {$("#myNav").addClass("hidden");
    }
});

$("#login").on('click', function() {
    $("#myNav").addClass("hidden");
});

$(".closebtn").on('click', function() {
    $("#myNav").addClass("hidden");
});