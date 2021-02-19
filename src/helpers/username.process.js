
export const getFullName = (firstName, lastName) => {
  if (lastName) {
    return `${firstName} ${lastName}`;
  }
  return firstName
}