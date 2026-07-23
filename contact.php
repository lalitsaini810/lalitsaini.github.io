<?php
/**
 * Contact Form Handler - Lalit Kumar Saini Portfolio
 * Handles AJAX form submission and sends email
 */

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// Only allow POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
    exit;
}

// Collect and sanitize inputs
$name    = isset($_POST['name'])    ? trim(htmlspecialchars($_POST['name']))    : '';
$email   = isset($_POST['email'])   ? trim(htmlspecialchars($_POST['email']))   : '';
$subject = isset($_POST['subject']) ? trim(htmlspecialchars($_POST['subject'])) : '';
$message = isset($_POST['message']) ? trim(htmlspecialchars($_POST['message'])) : '';

// Validate fields
if (empty($name) || empty($email) || empty($subject) || empty($message)) {
    echo json_encode(['success' => false, 'message' => 'All fields are required.']);
    exit;
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
    exit;
}

// Recipient
$to = 'lalitsaini810@gmail.com';

// Email subject with sender's subject
$mail_subject = "Portfolio Contact: " . $subject;

// HTML email body
$html_body = "
<!DOCTYPE html>
<html>
<head>
    <meta charset='UTF-8'>
    <style>
        body { font-family: 'Segoe UI', Arial, sans-serif; background: #0f0f14; color: #f5f5f7; margin: 0; padding: 0; }
        .container { max-width: 580px; margin: 0 auto; background: #1a1a2e; border-radius: 12px; overflow: hidden; }
        .header { background: linear-gradient(135deg, #ff4500, #ff6a00); padding: 30px; text-align: center; }
        .header h2 { color: #fff; margin: 0; font-size: 22px; }
        .body { padding: 30px; }
        .field { margin-bottom: 20px; }
        .label { font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8a9bb5; margin-bottom: 4px; }
        .value { background: #0f0f14; border-radius: 8px; padding: 12px 16px; color: #f5f5f7; font-size: 15px; border-left: 3px solid #ff4500; }
        .message-value { white-space: pre-wrap; line-height: 1.6; }
        .footer { text-align: center; padding: 20px; background: #0f0f14; font-size: 12px; color: #515156; }
    </style>
</head>
<body>
<div class='container'>
    <div class='header'>
        <h2>📩 New Portfolio Contact</h2>
        <p style='color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 13px;'>Someone reached out through your portfolio</p>
    </div>
    <div class='body'>
        <div class='field'>
            <div class='label'>From</div>
            <div class='value'>{$name}</div>
        </div>
        <div class='field'>
            <div class='label'>Email</div>
            <div class='value'><a href='mailto:{$email}' style='color: #ff6a00; text-decoration: none;'>{$email}</a></div>
        </div>
        <div class='field'>
            <div class='label'>Subject</div>
            <div class='value'>{$subject}</div>
        </div>
        <div class='field'>
            <div class='label'>Message</div>
            <div class='value message-value'>{$message}</div>
        </div>
    </div>
    <div class='footer'>
        Sent from Lalit.dev Portfolio &bull; Reply directly to {$email}
    </div>
</div>
</body>
</html>
";

// Mail headers
$headers  = "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: text/html; charset=UTF-8\r\n";
$headers .= "From: Portfolio Contact <noreply@lalit.dev>\r\n";
$headers .= "Reply-To: {$name} <{$email}>\r\n";
$headers .= "X-Mailer: PHP/" . phpversion();

// Send the email
$sent = mail($to, $mail_subject, $html_body, $headers);

if ($sent) {
    echo json_encode(['success' => true, 'message' => 'Message sent successfully! I will get back to you shortly.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to send message. Please email directly at lalitsaini810@gmail.com']);
}
exit;
