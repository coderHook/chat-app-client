import {EVENT} from '../actions/messages'
const initialState = []

export default function messages(state = initialState, { type, payload }) {
  switch(type){
    case EVENT:
      return payload
    default:
      return state
  }
}