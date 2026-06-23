export const resetPasswordTemplate = (
  url: string
) => `
<!DOCTYPE html>
<html>

<body>

<h2>
Reset Password
</h2>

<p>
Click the button below.
</p>

<a href="${url}">
Reset Password
</a>

</body>

</html>
`;