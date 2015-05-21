<?php

$send_to = 'youremail@gmail.com';

$errors         = array();  	// array to hold validation errors
$data 			= array(); 		// array to pass back data

// validate the variables ======================================================
	// if any of these variables don't exist, add an error to our $errors array

	if (empty($_POST['rsvp-guests']))
		$errors['guests'] = 'No. of guests is required.';

	if (empty($_POST['rsvp-name']))
		$errors['name'] = 'Name is required.';

	if (empty($_POST['rsvp-email']))
		$errors['email'] = 'Email is required.';

	if (empty($_POST['rsvp-phone']))
		$errors['phone'] = 'Phone is required.';

// return a response ===========================================================

	// if there are any errors in our errors array, return a success boolean of false
	if ( ! empty($errors)) {

		// if there are items in our errors array, return those errors
		$data['success'] = false;
		$data['errors']  = $errors;
	} else {

	// if there are no errors process our form, then return a message

	//If there is no errors, send the email
	if( empty($errors) ) {

		$subject = 'Wedding RSVP';
		$headers = 'From: ' . $send_to . "\r\n" .
		    'Reply-To: ' . $send_to . "\r\n" .
		    'X-Mailer: PHP/' . phpversion();

    	$message = 'Guests: ' . $_POST['rsvp-guests'] . '

Name: ' . $_POST['rsvp-name'] . '

Email: ' . $_POST['rsvp-email'] . '

Phone: ' . $_POST['rsvp-phone'] . '

Comments: ' . $_POST['rsvp-comments'];

        	$headers = 'From: Wedding RSVP' . '<' . $send_to . '>' . "\r\n" . 'Reply-To: ' . $_POST['rsvp-name'];

        	mail($send_to, $subject, $message, $headers);

    	}

		// show a message of success and provide a true success variable
		$data['success'] = true;
		$data['message'] = 'Thank you!';
	}

	// return all our data to an AJAX call
	echo json_encode($data);