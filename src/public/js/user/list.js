if($('.list-box').outerHeight() < $(window).height()) {
    $('.list-box').css('justify-content', 'center');
} else {
    $('.list-box').css('justify-content', 'start');
}

const submitPaginationForm = (target) => {
    target.parentNode.submit();
}

const filterList = (target) => {
    target.parentNode.action = '/dashboard/list/' + target.value;
    target.parentNode.submit();
}