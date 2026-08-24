export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000);
}

export function getOTPHtml(otp) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <title>Verify your email - PrepFlow</title>

  <style>
    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      padding: 0;
      background-color: #fafafa;
      font-family: Arial, Helvetica, sans-serif;
      color: #262626;
    }

    .email-wrapper {
      width: 100%;
      padding: 40px 16px;
    }

    .email-container {
      max-width: 480px;
      margin: 0 auto;
      background-color: #ffffff;
      border: 1px solid #dbdbdb;
      border-radius: 12px;
      overflow: hidden;
    }

    /* Header */

    .header {
      text-align: center;
      padding: 32px 20px 20px;
    }

    .logo {
      font-size: 32px;
      font-weight: 700;
      letter-spacing: -1px;
      color: #111111;
      margin: 0;
    }

    .tagline {
      margin-top: 6px;
      font-size: 13px;
      color: #8e8e8e;
    }

    /* Main content */

    .content {
      padding: 10px 40px 35px;
      text-align: center;
    }

    .icon {
      width: 64px;
      height: 64px;
      margin: 10px auto 22px;
      border-radius: 50%;
      background: linear-gradient(
        135deg,
        #833ab4,
        #fd1d1d,
        #fcb045
      );

      display: flex;
      align-items: center;
      justify-content: center;

      color: white;
      font-size: 28px;
    }

    .title {
      margin: 0;
      font-size: 24px;
      font-weight: 600;
      color: #262626;
    }

    .description {
      margin: 12px 0 28px;
      font-size: 14px;
      line-height: 1.6;
      color: #737373;
    }

    /* OTP */

    .otp-box {
      display: inline-block;
      padding: 16px 28px;
      background-color: #f7f7f7;
      border: 1px solid #e5e5e5;
      border-radius: 10px;

      font-size: 30px;
      font-weight: 700;
      letter-spacing: 8px;
      color: #111111;

      margin-bottom: 20px;
    }

    .expiry {
      font-size: 13px;
      color: #8e8e8e;
      margin-bottom: 28px;
    }

    /* Security message */

    .security-box {
      background-color: #fafafa;
      border-radius: 8px;
      padding: 14px 16px;
      text-align: left;
      font-size: 12px;
      line-height: 1.5;
      color: #737373;
    }

    .security-box strong {
      color: #555555;
    }

    /* Footer */

    .footer {
      border-top: 1px solid #eeeeee;
      padding: 22px 20px;
      text-align: center;
    }

    .footer-text {
      margin: 0;
      font-size: 12px;
      line-height: 1.6;
      color: #999999;
    }

    .brand {
      margin-top: 10px;
      font-size: 13px;
      font-weight: 600;
      color: #555555;
    }

    /* Mobile */

    @media only screen and (max-width: 520px) {
      .email-wrapper {
        padding: 20px 10px;
      }

      .content {
        padding: 10px 24px 30px;
      }

      .otp-box {
        font-size: 26px;
        letter-spacing: 6px;
        padding: 14px 20px;
      }

      .title {
        font-size: 21px;
      }
    }
  </style>
</head>

<body>

  <div class="email-wrapper">

    <div class="email-container">

      <!-- Header -->

      <div class="header">

        <h1 class="logo">
          PrepFlow
        </h1>

        <div class="tagline">
          Prepare smarter. Perform better.
        </div>

      </div>


      <!-- Main Content -->

      <div class="content">

        <div class="icon">
          ✓
        </div>

        <h2 class="title">
          Verify your email
        </h2>

        <p class="description">
          Use the verification code below to confirm your email
          address and continue setting up your PrepFlow account.
        </p>


        <!-- OTP -->

        <div class="otp-box">
          ${otp}
        </div>


        <div class="expiry">
          This code will expire in <strong>10 minutes</strong>.
        </div>


        <!-- Security Notice -->

        <div class="security-box">

          <strong>Didn't request this code?</strong>

          <br />

          You can safely ignore this email. Someone may have
          entered your email address by mistake.

        </div>

      </div>


      <!-- Footer -->

      <div class="footer">

        <p class="footer-text">
          For your security, never share this verification code
          with anyone.
        </p>

        <div class="brand">
          © 2026 PrepFlow
        </div>

      </div>

    </div>

  </div>

</body>
</html>
  `;
}
