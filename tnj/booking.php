<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
require "vendor/autoload.php";

if ($_SERVER['REQUEST_METHOD'] == "POST") {
    // Sanitize and validate form data
    $name = isset($_POST["name"]) ? htmlspecialchars(trim($_POST["name"])) : '';
    $email = isset($_POST["email"]) ? filter_var($_POST["email"], FILTER_SANITIZE_EMAIL) : '';
    $phone = isset($_POST["phone"]) ? htmlspecialchars(trim($_POST["phone"])) : '';
    $date = isset($_POST["date"]) ? htmlspecialchars($_POST["date"]) : '';
    $time = isset($_POST["time"]) ? htmlspecialchars($_POST["time"]) : '';
    $service = isset($_POST["service"]) ? htmlspecialchars($_POST["service"]) : '';

    // Validate required fields
    if (empty($name) || empty($email) || empty($phone) || empty($date) || empty($time) || empty($service)) {
        echo "<script>alert('All fields are required!'); window.history.back();</script>";
        exit();
    }

    // Validate email format
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "<script>alert('Invalid email format!'); window.history.back();</script>";
        exit();
    }

    // Initialize PHPMailer
    $mail = new PHPMailer(true);
    try {
        // SMTP configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'grohairgloskintnj@gmail.com';  // Your email
        $mail->Password = 'pilu rrns jjse tgki';  // Use a secure app password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = 587;

        // Sender and recipient settings
        $mail->setFrom($email, $name);
        $mail->addAddress('grohairgloskintnj@gmail.com', 'Ara Discoveries Pvt Ltd');

        // Email content
        $mail->Subject = 'New Appointment Request';
        $mail->Body = "Name: $name\n" .
                      "Email: $email\n" .
                      "Phone: $phone\n" .
                      "Date: $date\n" .
                      "Time: $time\n" .
                      "Service: $service\n";

        // Send email
        if ($mail->send()) {
            echo "<script>alert('Appointment request sent successfully!'); window.location.href='index.html';</script>";
        } else {
            echo "<script>alert('Error sending appointment request. Please try again later.'); window.history.back();</script>";
        }
    } catch (Exception $e) {
        echo "<script>alert('Error: " . $e->getMessage() . "'); window.history.back();</script>";
    }
}
?>