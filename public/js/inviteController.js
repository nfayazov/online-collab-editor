$('.invite-btn').click(function() {
   console.log($('#invite-email').val());
   $.get(`${window.location.pathname}/${$('#invite-email').val()}`);
});