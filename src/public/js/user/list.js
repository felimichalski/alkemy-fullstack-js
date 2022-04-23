if($('.list-box').outerHeight() < $(window).height()) {
    $('.list-box').css('justify-content', 'center');
} else {
    $('.list-box').css('justify-content', 'start');
}

const submitPaginationForm = (target) => {
    target.parentNode.submit();
}

$('.category').click((e) => {   
    if ($('#activeFilters').val()) {
        $('#activeFilters').val($('#activeFilters').val() + `,${e.target.value}`); // If there are already filters set, add the new one
        console.log($('#activeFilters').val())
    } else {
        $('#activeFilters').val(e.target.value); // Set a new filter
    }
    
    $('#categoryForm').submit(); // Submit the form with the new filter
});

$('.category-selected').click((e) => {
    let categories = $('#activeFilters').val().split(','); // Turning categories into an array

    categories = categories.filter(f => f != e.target.value).toString(); // Removing the clicked category and converting array back to string 

    $('#activeFilters').val(categories); // Set filters without the clicked filter
    
    $('#categoryForm').submit(); // Submit the form

})