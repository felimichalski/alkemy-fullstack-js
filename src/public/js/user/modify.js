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

$('.btn-update').click((e) => {
    e.preventDefault();

    // Checking all the form fields are valid
    let errors = [
        {code: 'Invalid amount', bool: false},
        {code: "Category cannot contain numbers", bool: false},
        {code: "Option 'other' cannot be empty", bool: false},
        {code: 'Amount cannot be 0', bool: false},
    ];

    let valid = true;

    if(isNaN(parseInt($('#amount').val()))) {
        errors[0].bool = true;
    }

    if($('.new-category').css('display') == 'block') {
        for(char of $('.new-category').val()) {
            if(!isNaN(char) && char != ' ') {
                errors[1].bool = true;
            }
        }
        if($('.new-category').val().trim() == '') {
            errors[2].bool = true;
        }
    }

    if(parseInt($('#amount').val()) == 0) {
        errors[3].bool = true;
    }

    for(let i in errors) {
        if(errors[i].bool === true) {
            valid = false;
            $('.validation').text(errors[i].code)
            $('.validation').css('display', 'block')
            return;
        }
    }

    if(valid) {
        $('.modify-form').submit();
    }
});