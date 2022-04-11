$('.arrow-down').click(() => {
    if($(window).scrollTop() < $(".auth-links").innerHeight()) {
        $('html, body').animate({
            scrollTop: $(".auth-links").innerHeight()
        }, 800);
    }
    $('html, body').on("scroll mousedown wheel DOMMouseScroll mousewheel keyup touchmove", function(){
        $('html, body').stop();
    });
});
