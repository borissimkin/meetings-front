import dayjs from 'dayjs'

export const toFormatTimeOrDatetime = (date) => {
  const dateDayjs = dayjs(new Date(date))
  if (!dateDayjs.isSame(dayjs(), 'days')) {
    return dateDayjs.format('DD.MM.YYYY HH:mm')
  }
  return dateDayjs.format('HH:mm')
}
