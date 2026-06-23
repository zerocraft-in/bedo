export const otpTemplate = (
  otp: string
) => `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>
<title>OTP Verification</title>
</head>

<body style="font-family:Arial,sans-serif;background:#f5f5f5;padding:20px;">

<div style="max-width:600px;background:#fff;padding:30px;margin:auto;border-radius:10px;">

<h2>Your Verification Code</h2>

<p>
Use the following OTP to continue.
</p>

<div style="
font-size:32px;
font-weight:bold;
letter-spacing:8px;
margin:20px 0;
">
${otp}
</div>

<p>
This OTP expires in 10 minutes.
</p>

<p>
If you didn't request this code,
please ignore this email.
</p>

</div>

</body>
</html>
`;