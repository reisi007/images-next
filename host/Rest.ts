const Rest = 'https://selfservice-backend.reisinger.pictures';

export async function sendPost<Body extends object>(internalUrl: string, body: Body) {
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

  if (!response.ok) throw Error(`Response failed with code ${response.status}`);
}

export async function submitToEmail(data: EmailSubmittable) {
  return sendPost('https://api.reisinger.pictures/email.php', data);
}

export type EmailSubmittable = {
  email: string,
  subject: string
  message: string
};
