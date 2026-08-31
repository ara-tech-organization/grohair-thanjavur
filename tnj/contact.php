<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require "vendor/autoload.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Sanitize and validate form data
    $name = !empty($_POST["name"]) ? htmlspecialchars($_POST["name"]) : '';
    $phone = !empty($_POST["phone"]) ? htmlspecialchars($_POST["phone"]) : '';
    $subject = !empty($_POST["subject"]) ? htmlspecialchars($_POST["subject"]) : '';
    $message = !empty($_POST["message"]) ? htmlspecialchars($_POST["message"]) : '';

    // Check if all required fields are present
    if ($name == '' || $phone == '' || $subject == '' || $message == '') {
        echo "<script>alert('All fields are required!'); window.location.href='index.html';</script>";
        exit();
    }

    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'grohairgloskintnj@gmail.com';  // Your email
        $mail->Password = 'pilu rrns jjse tgki';  // Use a secure app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Sender and recipient settings
        $mail->setFrom('grohairgloskintnj@gmail.com', $name);
        $mail->addAddress('grohairgloskintnj@gmail.com', 'Ara Discoveries Pvt Ltd');

        // Email content
        $mail->Subject = "New Contact Form Submission: $subject";
        $mail->Body = "Name: $name\n" .
            "Phone: $phone\n" .
            "Subject: $subject\n" .
            "Message: $message\n";

        // Send the email
        if ($mail->send()) {
            echo "<script>alert('Message sent successfully!'); window.location.href='index.html';</script>";
        } else {
            echo "<script>alert('Error sending message.'); window.location.href='index.html';</script>";
        }
    } catch (Exception $e) {
        echo "<script>alert('Error: " . $e->getMessage() . "'); window.location.href='index.html';</script>";
    }
}
?>