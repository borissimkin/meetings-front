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
