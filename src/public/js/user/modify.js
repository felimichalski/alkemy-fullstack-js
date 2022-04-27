$('document').ready(() => {
    const id = window.location.pathname.split('/')[4] // Getting the operation id from the url
    $('.modify-form').attr('action', `/dashboard/list/modify/${id}`);
    $.ajax({
        url: `/data/operations/${id}`,
        dataType: 'json',
        type: 'POST',
    })
    .done((result) => {
        $('#date').val(result.CREATED_AT.slice(0, -1));
        $('#concept').val(result.CONCEPT);
        if(result.E_VALUE) { // Checking if are expenses or income
            $('#amount').val(result.E_VALUE);
        } else {
            $('#amount').val(result.I_VALUE);
        }
        $.ajax({
            url: "/data/categories",
            dataType: 'json',
            type: 'POST',
        })
        .done((categories) => {
            if(categories.length > 0) {
                $('.hide-category').remove();
                for(cat of categories) {
                    if(cat == result.CATEGORY) {
                        $('.category-select').append(`
                            <option value="${cat}" selected>${cat}</option>
                        `)
                    } else {
                        $('.category-select').append(`
                            <option value="${cat}">${cat}</option>
                        `)
                    }
                }
                $('.category-select').append("<option value='other'>Other</option>")
            } else {
                $('.show-category').remove();
            }

            $('.category-select').change((e) => {
                if(e.target.value === 'other') {
                    $('.new-category').css('display', 'block');
                } else {
                    $('.new-category').val('');
                    $('.new-category').css('display', 'none');
                }
            });
        })
    })
})

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

$('.btn-update').click((e) => {
    e.preventDefault();

    // Checking all the form fields are valid
    let errors = [
        {code: 'Invalid amount', bool: false},
        {code: "Category cannot contain numbers", bool: false},
        {code: "Option 'other' cannot be empty", bool: false},
        {code: 'Amount cannot be 0', bool: false},
        {code: "Concept cannot be empty", bool: false},
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

    if($('#concept').val().trim() == '') {
        errors[4].bool = true;
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