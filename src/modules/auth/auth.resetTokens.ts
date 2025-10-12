interface ResetToken {
  token: string;       // одноразовый токен
  userId: string;      // ID пользователя
  expires: number;     // timestamp истечения
}

export const resetTokens: ResetToken[] = [];
