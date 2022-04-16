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