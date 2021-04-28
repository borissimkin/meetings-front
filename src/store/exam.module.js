import {
  SET_STUDENT_EXAM_STATES,
  SET_RESPONDED_USER_ID,
  SET_MINUTES_TO_PREPARE,
  SET_EXAM_INFO,
  UPDATE_STUDENT_EXAM_STATES,
  ADD_STUDENT_EXAM_STATE,
} from '@/store/mutations.type'
import meetingApi from '@/api/meeting.api'

const getDefaultState = () => {
  return {
    examInfo: {
      minutesToPrepare: 0,
      respondedUserId: 0,
    },
    /**
     * [{userId, prepareStart}, ]
     * **/
    studentExamStates: [],
  }
}
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
      state.studentExamStates = payload
    },
    [UPDATE_STUDENT_EXAM_STATES](state, payload) {
      payload.forEach((payloadExamState) => {
        const examState = state.studentExamStates.find(
          (examState) => examState.userId === payloadExamState.userId
        )
        Object.entries(examState).forEach(([key]) => {
          examState[key] = payloadExamState[key]
        })
      })
    },
    [ADD_STUDENT_EXAM_STATE](state, payload) {
      state.studentExamStates.push(payload)
    },
  },

  actions: {
    async fetchExamInfo({ commit }, meetingId) {
      const response = await meetingApi.getExamInfo(meetingId)
      commit(SET_EXAM_INFO, response.data)
    },

    async fetchStudentExamStates({ commit }, meetingId) {
      const response = await meetingApi.getStudentExamStates(meetingId)
      commit(SET_STUDENT_EXAM_STATES, response.data)
    },
  },
}
export default exam
