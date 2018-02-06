$(window).on('load', function () {
    var loadURL = window.location.href;
    var loadURLArr = loadURL.split("");
    var loadURLTest = loadURLArr.indexOf("&");
    if (loadURLTest < 0) {
        $("#myNav").style.width = "100%";
    }
    else { $("#myNav").style.width = "0%";
}
});

$("#login").on('click', function closeNav() {
    $("#myNav").addClass("hidden");
});

$(".closebtn").on('click', function closeNav() {
    $("#myNav").addClass("hidden");
});
