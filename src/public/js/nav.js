$('#user').click(() => {
    if ($('.modal-card').css('display') === 'none') {
        $('.modal-card').css('display', 'flex');
        $('.modal-overlay').css('display', 'block');
    } else {
        $('.modal-card').css('display', 'none');
        $('.modal-overlay').css('display', 'none');
    }
});

$('.expand-nav-btn').click(() => {
    $('.nav').toggleClass('expand');
    if($('.nav-overlay').css('display') == 'none') {
        $('.nav-overlay').css('display', 'block');
    } else {
        $('.nav-overlay').css('display', 'none');
    }
});

$('.nav-overlay').click(() => {
    $('.nav').removeClass('expand');
    $('.nav-overlay').css('display', 'none');
})