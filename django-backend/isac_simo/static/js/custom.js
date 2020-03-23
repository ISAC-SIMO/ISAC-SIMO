_globalevent = null
_popDirection = 'fadeInLeft'

function leftRightHandle(e){
    if (Swal.isVisible() && _globalevent) {
        switch (e.keyCode) {
            case 37:
                if(_globalevent.target.previousElementSibling){
                    _popDirection = 'fadeInRight';
                    _globalevent.target.previousElementSibling.click();
                }else{
                    $('.swal2-container.swal2-shown').css('background-color','rgba(0, 0, 0, 0.84)');
                }
                break;
            case 39:
                if(_globalevent.target.nextElementSibling){
                    _popDirection = 'fadeInLeft';
                    _globalevent.target.nextElementSibling.click();
                }else{
                    $('.swal2-container.swal2-shown').css('background-color','rgba(0, 0, 0, 0.84)');
                }
                break;
        }
    }
}

// IMAGE POP show
function showImagePop(event, img, alt, title, slide){
    event.preventDefault();
    Pace.restart();

    if(event.target.tagName.toLowerCase() == 'a' || slide){
        Swal.fire({
            imageUrl: img,
            imageAlt: alt?alt:'Image Failed to Load',
            title: title?title:'',
            confirmButtonText: '<i class="fa fa-times" aria-hidden="true"></i>',
            animation: false,
            customClass: "animated faster "+_popDirection,
            onOpen: function(toast){
                if(event.target.tagName.toLowerCase() == 'a'){
                    _globalevent = event
                    toast.addEventListener('keydown', leftRightHandle);
                }
            },
            onClose: function(toast){
                _globalevent = null
                toast.removeEventListener('keydown', leftRightHandle);
            }
        })
    }else{
        Swal.fire({
            imageUrl: img,
            imageAlt: alt?alt:'Image Failed to Load',
            title: title?title:'',
            confirmButtonText: '<i class="fa fa-times" aria-hidden="true"></i>',
            onClose: function(toast){
                _globalevent = null
                toast.removeEventListener('keydown', leftRightHandle);
            }
        })
    }
}

// Simple Delete Confirm Alert
function deleteData(event, element, name){
    event.preventDefault();
    var title = 'Delete This '+(name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g,' ')+'?')
    Swal.fire({
        title: title,
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#ad2424',
        reverseButtons: true,
        cancelButtonText: 'No, cancel!',
        }).then((result) => {
        if (result.value) {
          Pace.restart();
          $('#'+element).submit();
        }
    })
    $('.swal2-cancel').focus();
}

// TO DELETE WITH TYPING CONFIRM MESSAGE (NO DRAG/DROP/COPY/PASTE Allowed)
function deleteDataWriteConfirm(event, element, name){
    var toType = 'CONFIRM';
    event.preventDefault();
    var title = 'Delete This '+(name.charAt(0).toUpperCase() + name.slice(1).replace(/_/g,' ')+'?')
    Swal.fire({
        title: title,
        html: "You won't be able to revert this!<br/>Type <b>'"+toType+"'</b> below to delete it.",
        type: 'warning',
        input: 'text',
        inputPlaceholder: '. . .',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        confirmButtonColor: '#ad2424',
        reverseButtons: true,
        cancelButtonText: 'No, cancel!',
        inputValidator: (value) => {
          if (!value || value != toType) {
            return "Write '"+toType+"' in all caps."
          }
        },
    }).then((result) => {
        if (result.value) {
            if (result.value == toType) {
                Pace.restart();
                $('#'+element).attr('method','POST');
                $('#'+element).submit();
            }
        }
    })

    // On drag copy etc disable for CONFIRM text (toType var)
    // (if allowdrop is set - in debug do nothing)
    $('.swal2-input').css('text-align','center');
    if(typeof allowdrop === 'undefined' || allowdrop != true){
        $('.swal2-input').bind('copy paste drop', function (e) {
            e.preventDefault();
            $('.swal2-input').val('');
            Swal.showValidationMessage('Please Type (Copy/Paste/Drag no allowed)');
        });
    }else{
        $('.swal2-input').val(toType);
    }
}

// Tooltip resets (kinda needed)
$(function () {
    $(".table-options a").tooltip();
    $("[data-toggle='tooltip']").tooltip();
});