$(window).on('load',function openNav() {
    $("#myNav").style.width = "100%";
});

$(".closebtn").on('click',function closeNav() {
    $("#myNav").addClass("hidden");
});