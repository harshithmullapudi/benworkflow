/**
 * Created by harsh on 27-06-2017.
 */
$(document).ready(function () {


$('#login').click(function () {
var name = $('#email').val()
    var password = $('#password').val()
        $.ajax({
            url:'users/login',

            type:'post',
            data:{
                name:name,
                password:password
            },
            success:function (data) {
                console.log(data)
                if(data == 'OK')
                {

                    window.location = '/home'
                }
                else
                {
                    $('#errmess').css({
                        'display':'block'
                    })
                    setTimeout(function () {
                        $('#errmess').css({
                            'display':'none'
                        })
                    },5000)

                }

            }
        })
})



})