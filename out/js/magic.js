// magic.js
$(document).ready(function() {

	// RSVP form process
	$('#rsvp-form').submit(function(event) {

		$('.form-group').removeClass('has-error'); // remove the error class
		$('.help-block').remove(); // remove the error text

		// get the form data
		// there are many ways to get this data using jQuery (you can use the class or id also)
		var formData = {
			'rsvp-guests' 	    	: $('input#rsvp-guests').val(),
			'rsvp-name' 	        : $('input#rsvp-name').val(),
			'rsvp-email' 	    	: $('input#rsvp-email').val(),
			'rsvp-phone' 	    	: $('input#rsvp-phone').val(),
			'rsvp-comments' 		: $('textarea#rsvp-comments').val()
		};

		// process the form
		$.ajax({
			type 		: 'POST', // define the type of HTTP verb we want to use (POST for our form)
			url 		: 'process-rsvp.php', // the url where we want to POST
			data 		: formData, // our data object
			dataType 	: 'json', // what type of data do we expect back from the server
			encode 		: true
		})
			// using the done promise callback
			.done(function(data) {

				// log data to the console so we can see
				console.log(data); 

				// here we will handle errors and validation messages
				if ( ! data.success) {
					
					// handle errors for guests ---------------
					if (data.errors.guests) {
						$('#rsvp-guests-group').addClass('has-error'); // add the error class to show red input
						$('#rsvp-guests-group label').append('<span class="help-block">' + data.errors.guests + '</span>'); // add the actual error message under our input
					}
					
					// handle errors for name ---------------
					if (data.errors.name) {
						$('#rsvp-name-group').addClass('has-error'); // add the error class to show red input
						$('#rsvp-name-group label').append('<span class="help-block">' + data.errors.name + '</span>'); // add the actual error message under our input
					}

					// handle errors for email ---------------
					if (data.errors.email) {
						$('#rsvp-email-group').addClass('has-error'); // add the error class to show red input
						$('#rsvp-email-group label').append('<span class="help-block">' + data.errors.email + '</span>'); // add the actual error message under our input
					}
					
					// handle errors for phone ---------------
					if (data.errors.phone) {
						$('#rsvp-phone-group').addClass('has-error'); // add the error class to show red input
						$('#rsvp-phone-group label').append('<span class="help-block">' + data.errors.phone + '</span>'); // add the actual error message under our input
					}
					
					// handle errors for comments ---------------
					if (data.errors.comments) {
						$('#rsvp-comments-group').addClass('has-error'); // add the error class to show red input
						$('#rsvp-comments-group label').append('<span class="help-block">' + data.errors.comments + '</span>'); // add the actual error message under our input
					}

				} else {

					// ALL GOOD! just show the success message!
					$('#rsvp-form').append('<div class="alert alert-success">' + data.message + '</div>');

					// usually after form submission, you'll want to redirect
					// window.location = '/thank-you'; // redirect a user to another page

				}
			})

			// using the fail promise callback
			.fail(function(data) {

				// show any errors
				// best to remove for production
				console.log(data);
			});

		// stop the form from submitting the normal way and refreshing the page
		event.preventDefault();
	});

	// Contact form process
	$('#contact-form').submit(function(event) {

		$('.form-group').removeClass('has-error'); // remove the error class
		$('.help-block').remove(); // remove the error text

		// get the form data
		// there are many ways to get this data using jQuery (you can use the class or id also)
		var formData = {
			'contact-name' 	        : $('input#contact-name').val(),
			'contact-email' 	    	: $('input#contact-email').val(),
			'contact-subject'	        : $('input#contact-subject').val(),
			'contact-message'	        : $('textarea#contact-message').val()
		};

		// process the form
		$.ajax({
			type 		: 'POST', // define the type of HTTP verb we want to use (POST for our form)
			url 		: 'process-contact.php', // the url where we want to POST
			data 		: formData, // our data object
			dataType 	: 'json', // what type of data do we expect back from the server
			encode 		: true
		})
			// using the done promise callback
			.done(function(data) {

				// log data to the console so we can see
				console.log(data); 

				// here we will handle errors and validation messages
				if ( ! data.success) {
					
					// handle errors for name ---------------
					if (data.errors.name) {
						$('#contact-name-group').addClass('has-error'); // add the error class to show red input
						$('#contact-name-group label').append('<span class="help-block">' + data.errors.name + '</span>'); // add the actual error message under our input
					}

					// handle errors for email ---------------
					if (data.errors.email) {
						$('#contact-email-group').addClass('has-error'); // add the error class to show red input
						$('#contact-email-group label').append('<span class="help-block">' + data.errors.email + '</span>'); // add the actual error message under our input
					}

					// handle errors for subject ---------------
					if (data.errors.subject) {
						$('#contact-subject-group').addClass('has-error'); // add the error class to show red input
						$('#contact-subject-group label').append('<span class="help-block">' + data.errors.subject + '</span>'); // add the actual error message under our input
					}

					// handle errors for message ---------------
					if (data.errors.message) {
						$('#contact-message-group').addClass('has-error'); // add the error class to show red input
						$('#contact-message-group label').append('<span class="help-block">' + data.errors.message + '</span>'); // add the actual error message under our input
					}

				} else {

					// ALL GOOD! just show the success message!
					$('#contact-form').append('<div class="alert alert-success">' + data.message + '</div>');

					// usually after form submission, you'll want to redirect
					// window.location = '/thank-you'; // redirect a user to another page

				}
			})

			// using the fail promise callback
			.fail(function(data) {

				// show any errors
				// best to remove for production
				console.log(data);
			});

		// stop the form from submitting the normal way and refreshing the page
		event.preventDefault();
	});

});
