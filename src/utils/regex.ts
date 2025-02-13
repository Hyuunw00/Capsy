export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,16}$/;
export const idRegex = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{4,12}$/;

export const testEmail = (email: string) => {
  if (emailRegex.test(email)) return true;
  return false;
};
export const testId = (id: string) => {
  if (idRegex.test(id)) return true;
  return false;
};

export const testPassword = (password: string) => {
  if (passwordRegex.test(password)) return true;
  return false;
};

export const testPasswordConfirm = (password: string, passwordConfirm: string) => {
  if (passwordConfirm === password) return true;
  return false;
};
