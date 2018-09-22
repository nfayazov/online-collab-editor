var socket = io();
var splitBySlash = window.location.pathname.split('/');
var workspaceId = splitBySlash[splitBySlash.length - 1];

var makingChanges = false;

$(function () {
   $.get('/username', function (username) {
      console.log('Username: ' + username);
      var params = {workspaceId: workspaceId, username: username};
      socket.emit('join', params, function (data, err) {

         if (err) {
            alert(err);
            window.location.href = '/';
         }
      })
      $('.sidenav').append('<p>' + username + '</p>');
   });
});

socket.on('user_joined', (users, callback) => {
   console.log('Users joined: ' + users);
   $('.sidenav').empty();
   users.map(function (username) {
      $('.sidenav').append('<p>' + username  + '</p>');
   });
});

$('.commit-btn').on('click', function(e) {
   e.preventDefault();

   $.post('/api/commit/', {
      workspace: workspaceId,
      text: $('.editor-box').val()
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
   $('.commited-code').val(data.text);
});

$('.changes-btn').on('click', function(e) {
   e.preventDefault();
   if (!makingChanges) {
      makingChanges = true;
      $('.changes').css('display', 'block');
      $(this).text("Discard changes");
   } else {
      makingChanges = false;
      $('.changes').css('display', 'none');
      $(this).text("Add changes");
   }
});

$('.pull-changes-btn').on('click', function(e) {
   e.preventDefault();

   $.get('/api/pull/' + workspaceId, function(data) {
      $('.editor-box').val(data);
   });
})

$('.invite-new-user').on('click', function() {
   var splitBySlash = window.location.pathname.split('/');
   $(location).attr('href', `/invite/${splitBySlash[splitBySlash.length-1]}`);
});