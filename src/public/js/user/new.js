$('.category-select').change((e) => {
    if(e.target.value === 'other') {
        $('.new-category').css('display', 'block')
    } else {
        $('.new-category').css('display', 'none')
    }
});