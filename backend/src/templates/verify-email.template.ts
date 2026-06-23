export const verifyEmailTemplate = (
  url: string
) => `
<!DOCTYPE html>
<html>

<body>

<h2>
Verify Your Email
</h2>

<p>
Click below to verify.
</p>

<a href="${url}">
Verify Email
</a>

</body>

</html>
`;