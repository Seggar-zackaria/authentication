import * as React from 'react';

interface EmailTemplateProps {
  email: string;
  token: string;
}

export const EmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({
  email,
  token,
}) => {
    const confirmationLink = `${process.env.NEXTAUTH_URL}/confirm/${token}`;
return (
  <div>
    <h1>Welcome, {email}!</h1>
    <p>Please click the link below to confirm your email address:</p>
    <a href={confirmationLink}>Confirm email</a>
  </div>
)
}