// Show/hide collapsable-navbar
$('.expand-nav-btn').click(() => {
    $('.nav').toggleClass('expand');
    if($('.nav-overlay').css('visibility') == 'hidden') {
        $('.nav-overlay').css('visibility', 'visible');
        $('.nav-overlay').css('background-color', 'rgba(0, 0, 0, .7)');
    } else {
        $('.nav-overlay').css('visibility', 'hidden');
        $('.nav-overlay').css('background-color', '');
    }
});

$('.nav-overlay').click(() => {
    $('.nav').removeClass('expand');
    $('.nav-overlay').css('visibility', 'hidden');
    $('.nav-overlay').css('background-color', '');
})