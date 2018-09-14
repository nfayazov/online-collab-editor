$('#save-btn').click(function() {
   $.post('/new', {
      name: $('#ws-name').val(),
      filename: $('#ws-file').val(),
      description: $('#ws-desc').val()
   }, function(data) {
      console.log(data);
      $(location).attr('href', '/workspace/' + data);
   });
});