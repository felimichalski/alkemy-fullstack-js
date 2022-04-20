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
    let counter = 0;

    let errors = [
        {code: 'Password must contain between 7 and 20 characters', bool: false},
        {code: 'Password must contain a capital letter', bool: false},
        {code: 'Password must contain a lowercase letter', bool: false},
        {code: 'Password must contain a numer', bool: false}
    ];

    let valid = true;

    $password = $('#password').val().split('');

    if($password.length >= 7 && $password.length <= 20) {
        counter += 1;
    } else {
        errors[0].bool = true;
    }
    
    for(char of $password) {
        if(char.match(/[a-z]/)) {
            counter += 1;
            errors[2].bool = false;
            break;
        }
        errors[2].bool = true;
    }
    
    for(char of $password) {
        if(char.match(/[0-9]/)) {
            counter += 1;
            errors[3].bool = false;
            break;
        }
        errors[3].bool = true;
    }

    for(char of $password) {
        if(char.match(/[A-Z]/)) {
            counter += 1;
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