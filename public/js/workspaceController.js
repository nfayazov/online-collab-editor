var socket = io();
var splitBySlash = window.location.pathname.split('/');
var workspaceId = splitBySlash[splitBySlash.length - 1];

var makingChanges = false;

$('.commit-btn').on('click', function(e) {
   e.preventDefault();

   $.post('/api/commit/', {
      workspace: workspaceId,
      text: $('.editor-box').val()
   }, function(text) {
      console.log(`Commited text: ${text}`);
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
      //console.log(data);
   });

});

// TODO: make sure you can only delete if no one else is working right now
$('.delete-workspace').on('click', function(e) {
   e.preventDefault();
   console.log('Deleting workspace');
   $.ajax({
      url: window.location.pathname,
      type: 'DELETE',
      success: function (_) {
         console.log('Workspace successfully deleted');
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

$('.invite-new-user').on('click', function() {
   var splitBySlash = window.location.pathname.split('/');
   $(location).attr('href', `/invite/${splitBySlash[splitBySlash.length-1]}`);
});