$('.invite-btn').click(function() {
   console.log($('#invite-email').val());
   $(location).attr('href', `${window.location.pathname}/${$('#invite-email').val()}`);
});