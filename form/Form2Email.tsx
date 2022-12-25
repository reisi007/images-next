import React from 'react';

export async function submitToEmail(data: object, event?: React.BaseSyntheticEvent): Promise<boolean> {
  event?.preventDefault();

  const response = await fetch(
    'https://api.reisinger.pictures/email.php',
    {
      method: 'post',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.ok;
}
