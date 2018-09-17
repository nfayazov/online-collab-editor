$('.invite-btn').click(function() {
   $(location).attr('href', `${window.location.pathname}/${$('#invite-email').val()}`);
});