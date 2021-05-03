import { getFullName } from '@/helpers/username.process'

export const SUCCESS_AUTH = 'Вы авторизованы!'
export const ERROR_MESSAGE = 'Произошла ошибка, попробуйте еще раз!'
export const ERROR_MEDIA_DEVICES =
  'Дайте доступ к медиаустройствам и перезагрузите страницу'
export const ERROR_MICRO = 'Нет доступа к микрофону или он не подключен'
export const ERROR_VIDEO = 'Нет доступа к камере или она не подключена'
export const CHECK_LISTENERS_STARTED = 'Проверка слушателей началась'
export const MEETING_WAS_CREATED = 'Собрание успешно создано'
export const ROOM_WAS_CREATED = 'Комната успешна создана'
export const ERROR_DATA_DOWNLOAD =
  'Произошла ошибка загрузки данных, перезагрузите страницу'
export const REGISTRATION_SUCCESS = 'Вы успешно зарегистрировались'
export const START_ALL_PREPARATIONS_TO_EXAM = 'Все начали подготовку!'
export const RESET_ALL_PREPARATIONS_TO_EXAM = 'Подготовка сброшена'
export const CURRENT_USER_START_PREPARATION_TO_EXAM = 'Ваше время пошло'
export const CURRENT_USER_RESET_PREPARATION_TO_EXAM =
  'Ваше время подготовки сброшено'
export const START_PREPARATIONS_TO_EXAM = (firstName, lastName) =>
  `${getFullName(firstName, lastName)} начал подготовку`
export const RESET_PREPARATIONS_TO_EXAM = (firstName, lastName) =>
  `Подготовка у ${getFullName(firstName, lastName)} сброшена`
