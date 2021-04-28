import {
  SET_STUDENT_EXAM_STATES,
  SET_RESPONDED_USER_ID,
  SET_MINUTES_TO_PREPARE,
  SET_EXAM_INFO,
  UPDATE_STUDENT_EXAM_STATES,
} from '@/store/mutations.type'
import meetingApi from '@/api/meeting.api'

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
    [UPDATE_STUDENT_EXAM_STATES](state, payload) {
      Object.entries(payload).forEach(([key]) => {
        console.log(state.studentExamStates[key])
        console.log(payload[key])
        const examState1 = state.studentExamStates[key]
        console.log({ examState1 })
        this._vm.$set(
          state.studentExamStates[key],
          'prepareStart',
          payload[key].prepareStart
        )
        // Object.assign(state.studentExamStates[key], payload[key])
        // this._vm.$set(state.studentExamStates[key], key, payload[key])
      })
    },
  },

  actions: {
    async fetchExamInfo({ commit }, meetingId) {
      console.log({ meetingId })
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
