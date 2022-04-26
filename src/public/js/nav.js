// Show/hide collapsable-navbar
$('.expand-nav-btn').click(() => {
    $('body').addClass('non-touchable');
    setTimeout(() => {
        $('body').removeClass('non-touchable');
    }, 700)
    $('.nav').toggleClass('expand');
    if($('.nav-overlay').css('visibility') == 'hidden') {
        $('.expand-nav-btn ion-icon').attr('name', 'close')
        $('.nav-overlay').css('visibility', 'visible');
        $('.nav-overlay').css('background-color', 'rgba(0, 0, 0, .7)');
    } else {
        $('.expand-nav-btn ion-icon').attr('name', 'menu')
        $('.nav-overlay').css('visibility', 'hidden');
        $('.nav-overlay').css('background-color', '');
    }
});

$('.nav-overlay').click(() => {
    $('body').addClass('non-touchable');
    setTimeout(() => {
        $('body').removeClass('non-touchable');
    }, 700)
    $('.nav').removeClass('expand');
    $('.expand-nav-btn ion-icon').attr('name', 'menu')
    $('.nav-overlay').css('visibility', 'hidden');
    $('.nav-overlay').css('background-color', '');
})