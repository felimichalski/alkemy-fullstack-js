$('.category-select').change((e) => {
    if(e.target.value === 'other') {
        $('.new-category').css('display', 'block');
    } else {
        $('.new-category').val('');
        $('.new-category').css('display', 'none');
    }
});

$('.income').click(() => {
    $('.income').addClass('active');
    $('.expenses').removeClass('active');
    $('#concept').val('income');
})

$('.expenses').click(() => {
    $('.expenses').addClass('active');
    $('.income').removeClass('active');
    $('#concept').val('expenses');
});

$('.btn-send').click((e) => {
    e.preventDefault();

    // Checking all the form fields are valid
    let errors = [
        {code: 'You must select a type of operation', bool: false},
        {code: 'Invalid amount', bool: false},
    ];

    let valid = true;

    if($('#concept').val() === '') {
        errors[0].bool = true;
    };

    if(isNaN(parseInt($('.field-value').val()))) {
        console.log(parseInt($('.field-value').val()))
        errors[1].bool = true;
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
        $('.register-form').submit();
    }
})