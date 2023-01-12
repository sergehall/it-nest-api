export const messageHeaderJwt = {
  message: [
    {
      message:
        'JWT refreshToken inside headers.authorization is missing, expired or incorrect',
      field: 'headers.authorization',
    },
  ],
};

export const messageConfCodeInc = {
  message: [
    {
      message:
        'Confirmation code is incorrect, expired or already been applied',
      field: 'code',
    },
  ],
};
