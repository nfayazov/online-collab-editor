var socket = io();

makingChanges = false;

$('.commit-btn').on('click', function(e) {
   e.preventDefault();

   socket.emit('commitChanges', {
      text: $('.editor-box').val()
   }, function() {
      console.log('Changes successfully submitted');
   });
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