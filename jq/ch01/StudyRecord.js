function stringtonum(){
    var _string='1234px';
    //use fucntion parseFloat units 
    var num=parseFloat(_string);
    console.log(num);
    return num;
}
function displayChange(){
    $('#display button').on('click',function(){
        switch(this.id){
            case '_hideDiv':
            $('#record').hide(1000);
            break;
            case '_showDiv':
            $('#record').show();
            break;
            case '_fadeInDiv':
            $('#record').fadeIn(1000);
            break;
            case '_fadeOutDiv':
            $('#record').fadeOut();
            break;
            case '_slideDown':
            $('#record').slideDown();
            break;
            case '_slideUp':
            $('#record').slideUp();
            break;
            default:
            console.log('default');
            //toggle() slideToggle
        }
    })
    /*
     *you also can set the speed of show or hide ,if give 'fast' it means 200ms,
     * if give 'slow' ,means 600ms, if you give a string it means 400ms,or you can give a 
     * number of the speed. attention to diff the string '500' and the number 500.
     */
}
function dis_init(){
    $("#display_animate").attr('style',this._style);
}
function dis_annimate(){
    $("#record").animate({marginLeft:'toggle',height:'toggle'},2000);
}
function dis_annimate_my(){
    var co_width=parseFloat($('#display_animate_co').css('width'));
    var ca_width=parseFloat($('#display_animate').css('width'))+20;
    var x_offset=co_width-ca_width;
    $('#display_animate').animate({marginLeft:x_offset+'px',marginTop:'20px',borderWidth:'10px'},2000);
}
function dis_annimate_my2(){
    var co_width=parseFloat($('#display_animate_co').css('width'));
    var ca_width=parseFloat($('#display_animate').css('width'))+20;
    var x_offset=co_width-ca_width;
    $('#display_animate')
    .animate({marginLeft:x_offset+'px'},2000)
    .animate({marginTop:'20px'},2000)
    .animate({borderWidth:'10px'},2000);
}
function dis_annimate_my3(){
    var co_width=parseFloat($('#display_animate_co').css('width'));
    var ca_width=parseFloat($('#display_animate').css('width'))+20;
    var x_offset=co_width-ca_width;
    $('#display_animate')
    .fadeTo(2000,0.5)
    .animate({marginLeft:x_offset+'px'
    },{
        duration:3000,
        queue:false,
        complete:function(){
            console.log('complete');
        }
    })
    .fadeTo(1000,1.0);
}

function textInit(){
    $("#alink").on('click',function(){
        $('p').eq(3).show();
        return false; 
    });
}



var _style=null;
$(document).ready(function(){
    _style=$("#display_animate").attr('style');
    $('#display_animate_max p').eq(2).css('border','solid 1px #333')
    .on('click',function(){
        $(this).slideUp(1500).next().slideDown(1500);
    });
    $('#display_animate_max p').eq(3).css('backgroundColor','#ccc').hide();
    textInit();
});
