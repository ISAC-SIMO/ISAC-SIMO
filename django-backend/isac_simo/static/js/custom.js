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
                _globalevent = event
                toast.addEventListener('keydown', leftRightHandle);
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

// Simple Ok confirm
function simpleConfirm(event, to, text, download){
    event.preventDefault();
    Swal.fire({
        title: "Please Confirm this Action ?",
        text: text?text:'Proceed to action',
        type: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        confirmButtonColor: '#ad2424',
        reverseButtons: true,
        cancelButtonText: 'No, cancel!',
        }).then((result) => {
        if (result.value) {
          Pace.restart();
          if(download){
            window.location.assign(to);
          }else{
            location.href = to;
          }
        }
    })
    $('.swal2-cancel').focus();
}

// TO TIGGER SWAL INPUT FOR go/nogo verify and type
function verifyImage(event, id, result, score, object_type, verified, url, retrained, csrf){
    Swal.fire({
        title: 'Verify Test Results - '+id,
        showCancelButton: true,
        confirmButtonText: 'Update',
        cancelButtonText: 'Close',
        html:
            '<form action="'+url+'" id="image_file_verify" method="POST">'+
            '<input type="hidden" name="csrfmiddlewaretoken" value="'+csrf+'" />'+
            '<label class="swal2-label">Result:</label>'+
            '<input id="test-result" name="test-result" placeholder="No Result" class="swal2-input" style="margin: 0.5em auto;" value="'+result+'">' +
            '<label class="swal2-label">Score:</label>'+
            '<input id="test-score" name="test-score" placeholder="No Score" class="swal2-input" disabled style="background: #c7c7c7;margin: 0.5em auto;" value="'+score+'">'+
            '<label class="swal2-label">Object Type:</label>'+
            '<input id="test-object-type" name="test-object-type" placeholder="Object Not Detected" class="swal2-input" style="margin: 0.5em auto;" value="'+object_type+'">'+
            '<label class="swal2-label" style="display: inline-block;float: left;">Verified:'+
            '<input type="checkbox" id="test-verified" name="test-verified" class="swal2-checkbox" style="margin: 0.5em;transform: scale(1.4);display: inline;"'+ (verified?'checked':'') +'>'+
            '</label>'+
            '<label class="swal2-label" style="display: inline-block;float: right;margin: 0.5em;">Retrained: '+(retrained?'Yes':'No')+'</label>'+
            '</form>',
        focusConfirm: false,
        preConfirm: function(){
            Pace.restart();
            if(retrained && !document.getElementById('test-verified').checked){
                $('#swal2-validation-message').css({'float':'left','width':'100%'});
                Swal.showValidationMessage('Note: Image was already used to "Re-Train" <br/> & now is "Un-Verified"<br/>Click "Update" again to confirm.');
                retrained = false;
            }else{
                $('#image_file_verify').submit();
            }
        }
    })
}

// Tooltip resets (kinda needed)
$(function () {
    $(".table-options a").tooltip();
    $("[data-toggle='tooltip']").tooltip();
});