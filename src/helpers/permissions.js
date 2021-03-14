export const canStartCheckListeners = (currentUserId, creatorMeetingId) => {
  return currentUserId === creatorMeetingId
}
