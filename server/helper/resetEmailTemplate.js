const mjml2html = require('mjml');

module.exports = function(frontEndUrl, token) {
  return mjml2html(`
  <mjml>
    <mj-head>
      <mj-font name="Lato" href="https://fonts.googleapis.com/css?family=Lato:400,900" />
      <mj-font name="OpenSans" href="https://fonts.googleapis.com/css?family=Open+Sans" />
      <mj-attributes>
        <mj-all font-family="OpenSans, Arial" align="center" />
      </mj-attributes>
      <mj-preview>
        Password Reset
      </mj-preview>
      <mj-title>
        Password Reset
      </mj-title>
    </mj-head>
    <mj-body background-color="#F7F7F7">
      <mj-section background-color="#333333" padding="0 15px">
        <mj-column>
          <mj-navbar align="left">
            <mj-navbar-link href="${frontEndUrl}" font-family="Lato, Roboto" font-weight="900" font-size="25px" color="white" padding="15px 0">
              SKATES & STATS
            </mj-navbar-link>
          </mj-navbar>
        </mj-column>
      </mj-section>
      <mj-section background-color="white">
        <mj-column>
          <mj-text align="center" font-weight="1000" font-size="25px" font-family="Lato, Roboto">
            Oops!
          </mj-text>
          <mj-image width="200px" src="https://res.cloudinary.com/dbeqp2lyo/image/upload/v1557180932/Hockey%20stats/forgotpassword.png" alt="Forgot Password" padding="30px" />
          <mj-text align="center" padding="0 40px 50px" line-height="25px" font-size="17px">
            This email was sent because a request was made from your account to reset the password. Please follow the link below to reset your password within 1 hour, at which point the link will expire.
          </mj-text>
          <mj-button href="${frontEndUrl}/app/passwordreset/${token}" background-color="#4169e1" padding-bottom="40px" font-size="20px">
            Reset Password
          </mj-button>
          <mj-text align="center" padding="30px 80px" font-size="14px">
            If you did not request this, please ignore this message and your password will remain the same.
          </mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>
  `);
};
