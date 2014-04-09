document.addEventListener("deviceready", onDeviceReady, false);

window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

var localStorage    =   window.localStorage;
var contactInfo;

$(document).on('touchend', '#contactList li.contact_list_item', function(){
    var selectedID = $(this).attr('id');
    getContactByID(selectedID);
});

$(document).bind("pagechange", onPageChange);

function onPageChange(event, data) {
    var toPageId = data.toPage.attr("id");
    switch (toPageId) {
        case 'contact-info':
            clearValues();
            $('#contact_header h1').html(contactInfo.name.formatted);
            $('#givenName').val(contactInfo.name.givenName);
            $('#familyName').val(contactInfo.name.familyName);
            $('#phone').val(contactInfo.phoneNumbers[0].value);
            $('#email').val(contactInfo.emails[0].value);
        break;
    }
}

function clearValues() {
    $('input[type=text]').each(function() {
        $('#' + this.id + '').val('');
    });
}

function onDeviceReady() {
    //ios 7 top bar
    //if (parseFloat(window.device.version) === 7.0) {
      //    document.body.style.marginTop = "20px";
    //}
    //obtem todos os contatos e popula lista
    getAllContacts();
}

function getContactByID(contactID) {
    contactInfo = JSON.parse(localStorage.getItem(contactID));
    $.mobile.changePage($('#contact-info'));
}

function getAllContacts() {
    var options = new ContactFindOptions();
    options.filter = "";
    options.multiple = true;
    var fields = ["name", "phoneNumbers", "birthday", "emails"];
    navigator.contacts.find(fields, onAllSuccess, onError, options);
}

function alphabeticalSort(a, b) {
     if (a.name.formatted < b.name.formatted){
        return -1;
     }else if (a.name.formatted > b.name.formatted){
       return  1;
     }else{
       return 0;
     }
}

function onAllSuccess(contacts) {
        
    if(contacts.length) {

        var arrContactDetails = new Array();
        for(var i=0; i<contacts.length; ++i){
              if(contacts[i].name){
                    arrContactDetails.push(contacts[i]);
              }
        }

        arrContactDetails.sort(alphabeticalSort);
        
        var alphaHeader = arrContactDetails[0].name.formatted[0];
        var list = '';

        for(var i=0; i<arrContactDetails.length; ++i) {
            var contactObject = arrContactDetails[i];
            if( alphaHeader != contactObject.name.formatted[0] ) {
                alphaHeader = contactObject.name.formatted[0];
                list += '<li data-role="list-divider">' + alphaHeader + '</li>';
                list += '<li class="contact_list_item" id="' + contactObject.id + '"><a href="#contact-info">' + contactObject.name.formatted + ' (' + contactObject.id + ')</a></li>';
            } else {
                if( i == 0 ) {
                    list += '<li data-role="list-divider">' + alphaHeader + '</li>';
                }
                list += '<li class="contact_list_item" id="' + contactObject.id + '"><a href="#contact-info">' + contactObject.name.formatted + ' (' + contactObject.id + ')</a></li>';
            }
            
            localStorage.setItem(contactObject.id,JSON.stringify(contactObject));
        }

        $('#contactList').append(list);
    
    } else {
        $('#contactList').append('<li><h3>Nenhum contato encontrado.</h3.></li>');
    }
    
    $('#contactList').listview("refresh");
}

function onError(error) {
    alert('Ocorreu um erro: ' + error.code);
}