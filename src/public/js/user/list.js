if($('.list-box').outerHeight() < $(window).height()) {
    $('.list-box').css('justify-content', 'center');
} else {
    $('.list-box').css('justify-content', 'start');
}

const submitPaginationForm = (target) => {
    target.parentNode.submit();
}

$('.category').click((e) => {

    e.preventDefault();
    
    if ($('#activeFilters').val()) {
        $('#activeFilters').val($('#activeFilters').val() + `,${e.target.value}`); // If there are already filters set, add the new one
        console.log($('#activeFilters').val())
    } else {
        $('#activeFilters').val(e.target.value); // Set a new filter
    }
    
    $('#categoryForm').submit(); // Submit the form with the new filter
})