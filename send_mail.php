<?php
if($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = "bookings@debbietours.com"; // Your email here
    $subject = "New Newsletter Subscription";
    $email = $_POST['EMAIL'];
    $body = "New email signup: " . $email;
    $headers = "From: webmaster@debbietours.com";

    if(mail($to, $subject, $body, $headers)) {
        echo "Thank you for subscribing!";
    } else {
        echo "Error sending mail.";
    }
}
?>