ajaxFormRequest = (btn_id,form,url,data_type,the_status,btn_title,file_upload) => {
    let btn = $(btn_id);
    let status = $(the_status);
    btn.attr("disabled",true);
    btn.html("Please wait ...");
    let data = $(form).serialize();

    if(data_type == "POST") {
        
        $.ajax(
        {
            type: data_type,
            url: url,
            data: data,
            
            headers:
            {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },

            beforeSend: function(xhr,type) {
                if(!type.crossDomain) {
                    xhr.setRequestHeader('X-CSRF-TOKEN', $('meta[name="csrf-token"]').attr('content'));
                }
            }, 

            success:function(msg) {

                if (msg == 'Password changed') {
                    status.fadeIn("fast");
                    status.html("<br/><p style='color:green'>"+msg+"</p>");
                    btn.attr("disabled",false);
                    btn.html(btn_title);
                    
                    setTimeout(function() {
                        window.location = '/'
                    }, 1000);
                    
                } else if (msg == 'Registration successful' || msg == 'Login successful' || msg == 'Password changed'  || msg == 'Profile updated') {
                    status.fadeIn("fast");
                    status.html("<br/><p style='color:green'>"+msg+"</p>");
                    btn.attr("disabled",false);
                    btn.html(btn_title);
                    
                    setTimeout(function() {
                        window.location = '/dashboard'
                    }, 1000);
                    
                } else if (msg == 'Contact added' || msg == 'Contact updated') {
                    status.fadeIn("fast");
                    status.html("<br/><p style='color:green'>"+msg+"</p>");
                    btn.attr("disabled",false);
                    btn.html(btn_title);
                    
                    setTimeout(function() {
                        window.location = '/contacts'
                    }, 1000);
                    
                } else {
                    status.fadeIn("fast");
                    status.html(msg);
                    btn.attr("disabled",false);
                    btn.html(btn_title);
                }
            },
            error: function(error) {
                btn.attr("disabled",false);
                btn.html(btn_title);
                status.fadeIn("fast");
                status.html("<p style='color:red'>Invalid request</p>");
            }
        });
    } else if(data_type == "GET") {

        $.ajax(
        {
            type: data_type,
            url: url,
            
            headers:
            {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
            },
            success:function(msg) {

                status.fadeIn("fast");
                status.html(msg);
                btn.attr("disabled",false);
                btn.html(btn_title);
            },
            error: function(the_error) {
                btn.attr("disabled",false);
                btn.html(btn_title);
                status.fadeIn("fast");
                status.html("<p style='color:red'>Invalid request</p>");
            }
        });
    }

}
