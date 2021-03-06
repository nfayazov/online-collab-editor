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

   let description = $('#commit-msg').val();
   if (description == "") {
      alert("Please enter commit message");
      return;
   }

   $.post('/api/commit/', {
      workspace: workspaceId,
      text: editor.getValue(),
      description: description
   }, function(data) {
      var params = {
         workspaceId: workspaceId,
         commitId: data.commitId,
         text: data.text,
         description: description, 
      };

      $('#commit-msg').val('');

      socket.emit('commitChanges', params, function (data, err) {
         if (err) {
            alert(err);
            window.location.href = '/';
         }
      });
   });

});

$('.compile-btn').on('click', function(e) {
   e.preventDefault()

   $.post("http://localhost:8080",
         editor.getValue(), function(data) {
         $("#compiler-result").html(data);
      });
})

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
});

socket.on('updateCode', (data, callback) => {
   $('.committed-code').val(data.text);
   $('tbody').prepend('<tr id="' + data.commitId + '" class="commit"><td>' + data.description + '</td></tr>');
});

$('.commit').on('click', function(e){
   e.preventDefault();

   let commitId = $(this).attr('id');
   $.get('/api/commit/' + commitId, (commit) => {
      $('.committed-code').val(commit.text);
   });
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