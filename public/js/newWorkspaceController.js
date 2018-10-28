$('#save-btn').click(function() {
   $.post('/new', {
      name: $('#ws-name').val(),
      description: $('#ws-desc').val()
   }, function(data) {
      $(location).attr('href', '/workspace/' + data);
   });
});