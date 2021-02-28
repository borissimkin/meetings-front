export const getFullName = (firstName, lastName) => {
  if (lastName) {
    return `${firstName} ${lastName}`
  }
  return firstName
}

export const getInitials = (firstName, lastName) => {
  return `${firstName[0]}${lastName[0]}`
}
