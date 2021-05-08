import dayjs from 'dayjs'

export const toFormatTimeOrDatetime = (date) => {
  const dateDayjs = dayjs(new Date(date))
  if (!dateDayjs.isSame(dayjs(), 'days')) {
    return dateDayjs.format('D MMM YYYY HH:mm')
  }
  return dateDayjs.format('HH:mm')
}

export const fromTimeToDayjs = (time) => {
  return dayjs(`${dayjs().format('YYYY-MM-dd')} ${time}`)
}

export const fromSecondsToTime = (seconds) => {
  const hours = Math.floor(seconds / 3600)
  const secondsWithoutHours = seconds % 3600
  const minutes = Math.floor(secondsWithoutHours / 60)
  const remainingSeconds = secondsWithoutHours % 60
  return {
    hours,
    minutes,
    seconds: remainingSeconds,
  }
}

export const fromTimeToSeconds = (hours, minutes, seconds) => {
  let totalSeconds = 0
  const totalMinutes = hours * 60 + minutes
  totalSeconds += totalMinutes * 60 + seconds
  return totalSeconds
}
