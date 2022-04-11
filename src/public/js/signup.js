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