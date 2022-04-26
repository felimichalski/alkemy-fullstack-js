if($('.modify-box').outerHeight() < $(window).height()) {
    $('.modify-box').css('justify-content', 'center');
} else {
    $('.modify-box').css('justify-content', 'start');
}

$(window).resize(() => {
    if($('.modify-box').outerHeight() < $(window).height()) {
        $('.modify-box').css('justify-content', 'center');
    } else {
        $('.modify-box').css('justify-content', 'start');
    }
});

$('.category-select').change((e) => {
    if(e.target.value === 'other') {
        $('.new-category').css('display', 'block');
    } else {
        $('.new-category').val('');
        $('.new-category').css('display', 'none');
    }
});