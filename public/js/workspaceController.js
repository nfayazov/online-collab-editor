var socket = io();
var splitBySlash = window.location.pathname.split('/');
var workspaceId = splitBySlash[splitBySlash.length - 1];

var hidden = false;
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
      $('.online-user-list').append('<p>' + username + '</p>');
   });
});

socket.on('update_users', (users, callback) => {
   $('.online-user-list').empty();
   users.map(function (username) {
      $('.online-user-list').append('<p>' + username  + '</p>');
   });
});

$('.commit-btn').on('click', function(e) {
   e.preventDefault();

   $.post('/api/commit/', {
      workspace: workspaceId,
      text: editor.getValue(),
      description: $('#commit-msg').val()
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

$('.pull-changes-btn').on('click', function(e) {
   e.preventDefault();

   let pullText = $('.committed-code').val();
   editor.setValue(pullText);
});

$('.hide-btn').on('click', e => {
   e.preventDefault();
   var state, btn_txt;
   if (!hidden) {
      state = 'none';
      btn_txt = 'Show committed code';
      hidden = true;
   } else {
      state = 'block';
      btn_txt = 'Hide';
      hidden = false;
   }
   $('#hide-text').text(btn_txt);
   $('.committed-title').css('display', state);
   $('.committed-code').css('display', state);
});

$('.invite-new-user').on('click', function() {
   var splitBySlash = window.location.pathname.split('/');
   $(location).attr('href', `/invite/${splitBySlash[splitBySlash.length-1]}`);
});