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