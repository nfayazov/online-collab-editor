var socket = io();
var splitBySlash = window.location.pathname.split('/');
var workspaceId = splitBySlash[splitBySlash.length - 1];

var makingChanges = false;
var username;
var editor;

$(function () {
   editor = CodeMirror.fromTextArea(document.getElementById('editor-box'), {
      lineNumbers: true,
      mode: 'javascript',
      value: $('.committed-code').text(),
      theme: "darcula"
   });

   $.get('/username', function (username) {
      username = username; // make global
      var params = {workspaceId: workspaceId, username: username};
      socket.emit('join', params, function (data, err) {
         if (err) {
            alert(err);
            window.location.href = '/';
         }
      });
      $('.sidenav').append('<p>' + username + '</p>');
   });
});

socket.on('update_users', (users, callback) => {
   $('.sidenav').empty();
   users.map(function (username) {
      $('.sidenav').append('<p>' + username  + '</p>');
   });
});

$('.commit-btn').on('click', function(e) {
   e.preventDefault();

   $.post('/api/commit/', {
      workspace: workspaceId,
      text: editor.getValue()
   }, function(text) {
      var params = {
         workspaceId: workspaceId,
         text: text
      };

      socket.emit('commitChanges', params, function (data, err) {
         if (err) {
            alert(err);
            window.location.href = '/';
         }
      });
   });

});

// TODO: make sure you can only delete if no one else is working right now
$('.delete-workspace').on('click', function(e) {
   e.preventDefault();
   $.ajax({
      url: window.location.pathname,
      type: 'DELETE',
      success: function (_) {
         $(location).attr('href', '/delete/workspace');
      },
      error: function(err) {
         console.log(err);
         // Redirect to error page
      }
   });
})

socket.on('updateCode', (data, callback) => {
   $('.committed-code').val(data.text);
});

// $('.changes-btn').on('click', function(e) {
//    e.preventDefault();
//    if (!makingChanges) {
//       makingChanges = true;
//       $('.changes').css('display', 'block');
//       $(this).text("Discard changes");
//       //myCodeMirror.refresh();
//    } else {
//       makingChanges = false;
//       $('.changes').css('display', 'none');
//       $(this).text("Add changes");
//    }
// });

$('.pull-changes-btn').on('click', function(e) {
   e.preventDefault();

   let pullText = $('.committed-code').val();
   editor.setValue(pullText);
})

$('.invite-new-user').on('click', function() {
   var splitBySlash = window.location.pathname.split('/');
   $(location).attr('href', `/invite/${splitBySlash[splitBySlash.length-1]}`);
});