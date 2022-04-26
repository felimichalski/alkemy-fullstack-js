$('#email').focus(() => {
    $('#email-icon').addClass('completed');
    $('#email').parent().addClass('border-white');
});

$('#email').blur(() => {
    if($('#email').val() === "") {
        $('#email-icon').removeClass('completed');
        $('#email').parent().removeClass('border-white');
    }
});

$('#fullname').focus(() => {
    $('#fullname-icon').addClass('completed');
    $('#fullname').parent().addClass('border-white');
});

$('#fullname').blur(() => {
    if($('#fullname').val() === "") {
        $('#fullname-icon').removeClass('completed');
        $('#fullname').parent().removeClass('border-white');
    }
});

$('#password').focus(() => {
    $('#password-icon').addClass('completed');
    $('#password').parent().addClass('border-white');
});

$('#password').blur(() => {
    if($('#password').val() === "") {
        $('#password-icon').removeClass('completed');
        $('#password').parent().removeClass('border-white');
    }
});

$('#password-eye').click(() => {
    if($('#password-eye').siblings('input').attr('type') === 'password') {
        $('#password-eye').siblings('input').attr('type', 'text');
        $('#password-eye').attr('name', 'eye-off')
    } else {
        $('#password-eye').siblings('input').attr('type', 'password');
        $('#password-eye').attr('name', 'eye')
    }
})

// Password validation
$('#send-form').click((e) => {
    e.preventDefault();

    let errors = [
        {code: 'Password must contain between 7 and 20 characters', bool: false},
        {code: 'Password must contain a capital letter', bool: false},
        {code: 'Password must contain a lowercase letter', bool: false},
        {code: 'Password must contain a numer', bool: false}
    ];

    let valid = true;

    $password = $('#password').val().split('');

    if(!($password.length >= 7) || !($password.length <= 20)) {
        errors[0].bool = true;
    }

    for(char of $password) {
        if(char.match(/[a-z]/)) {
            errors[2].bool = false;
            break;
        }
        errors[2].bool = true;
    }
    
    for(char of $password) {
        if(char.match(/[0-9]/)) {
            errors[3].bool = false;
            break;
        }
        errors[3].bool = true;
    }

    for(char of $password) {
        if(char.match(/[A-Z]/)) {
            errors[1].bool = false;
            break;
        }
        errors[1].bool = true;
    }

    for(let i in errors) {
        if(errors[i].bool === true) {
            valid = false;
            $('.validation').text(errors[i].code)
            return;
        }
    }

    if(valid) {
        $('.login-form').submit();
    }
})