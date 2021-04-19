const { SET_STUDENT_EXAM_STATES } = require('@/store/mutations.type')
const { SET_RESPONDED_USER_ID } = require('@/store/mutations.type')
const { SET_MINUTES_TO_PREPARE } = require('@/store/mutations.type')
const { SET_EXAM_INFO } = require('@/store/mutations.type')
const getDefaultState = () => {
  return {
    examInfo: {
      minutesToPrepare: 0,
      respondedUserId: 0,
    },
    /**
     * {userId: {prepareStart: Date} , }
     * **/
    studentExamStates: {},
  }
}
//todo: свой стейт отдельно нужно хранить
const exam = {
  namespaced: true,
  state: getDefaultState(),

  mutations: {
    [SET_EXAM_INFO](state, examInfo) {
      state.examInfo = examInfo
    },
    [SET_MINUTES_TO_PREPARE](state, value) {
      state.examInfo.minutesToPrepare = value
    },
    [SET_RESPONDED_USER_ID](state, userId) {
      state.examInfo.respondedUserId = userId
    },
    [SET_STUDENT_EXAM_STATES](state, payload) {
      Object.assign(state.studentExamStates, payload)
    },
  },

  // actions: {
  //   fetchExamInfo({ commit }, payload) {},
  //
  //   fetchStudentExamStates({ commit }, payload) {},
  // },
}
export default exam
