import React from 'react';

const Rest = 'https://selfservice-backend.reisinger.pictures';

export async function sendPost<Body extends object>(internalUrl: string, body: Body): Promise<boolean> {
  let url: string;
  if (internalUrl.startsWith('http')) {
    url = internalUrl;
  } else {
    url = `${Rest}/${internalUrl}`;
  }
  const response = await fetch(
    url,
    {
      method: 'post',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.ok;
}

export async function submitToEmail(data: EmailSubmittable, event?: React.BaseSyntheticEvent): Promise<boolean> {
  event?.preventDefault();
  return sendPost('https://api.reisinger.pictures/email.php', data);
}

export type EmailSubmittable = {
  email: string,
  subject: string
};
