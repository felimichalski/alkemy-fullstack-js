$('#username').focus(() => {
    $('#username-icon').addClass('completed');
    $('#username').parent().addClass('border-white');
});

$('#username').blur(() => {
    if($('#username').val() === "") {
        $('#username-icon').removeClass('completed');
        $('#username').parent().removeClass('border-white');
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