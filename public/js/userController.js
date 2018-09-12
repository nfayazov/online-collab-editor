'use strict';

(function () {
   let username = document.querySelector('#username') || null;
   let displayName = document.querySelector('#displayName');
   let id = document.querySelector('#id') || null;
   let apiUrl = appUrl + '/api/:id';

   function updateHtmlElement (data, element, userProperty) {
   	element.innerHTML = data[userProperty];
   };

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, null, function (data) {
		var userObject = JSON.parse(data);
      console.log(userObject);
      if (username != null ) updateHtmlElement(userObject, username, 'username');
      if (displayName != null ) updateHtmlElement(userObject, displayName, 'displayName');
      if (id != null) updateHtmlElement(userObject, id, 'id');
   }));

})();