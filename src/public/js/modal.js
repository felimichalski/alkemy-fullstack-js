if($('.modal-card').outerHeight() > $(window).height()) {
    $('.modal-card').css('position', 'absolute');
    $('.modal-card').css('top', '1rem');
    $('.modal-card').css('transform', 'translate(-50%, 0)');
} else {
    $('.modal-card').css('position', 'fixed');
    $('.modal-card').css('top', '50%');
    $('.modal-card').css('transform', 'translate(-50%, -50%)');
}

$(window).resize(() => {
    if($('.modal-card').outerHeight() > $(window).height()) {
        $('.modal-card').css('position', 'absolute');
        $('.modal-card').css('top', '2rem');
        $('.modal-card').css('transform', 'translate(-50%, 0)');
    } else {
        $('.modal-card').css('position', 'fixed');
        $('.modal-card').css('top', '50%');
        $('.modal-card').css('transform', 'translate(-50%, -50%)');
    }
})

$('#user').click(() => {
    if ($('.modal-card').css('display') === 'none') {
        $('.modal-card').css('display', 'flex');
        $('.modal-overlay').css('display', 'block');
    } else {
        $('.modal-card').css('display', 'none');
        $('.modal-overlay').css('display', 'none');
    }
});

$('.modal-overlay').click(() => {
    $('.modal-overlay').css('display', 'none');
    $('.modal-card').css('display', 'none');
});

$('.close-modal').click(() => {
    $('.modal-overlay').css('display', 'none');
    $('.modal-card').css('display', 'none');
});