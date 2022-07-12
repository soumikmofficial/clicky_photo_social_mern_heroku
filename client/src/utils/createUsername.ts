export const createUsername = (email: string) => {
  const regex = /(\S+)@/i;
  const matches = email.match(regex);
  if (!matches) return email.slice(0, 5);
  return matches[1];
};
