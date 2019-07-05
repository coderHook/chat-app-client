export const EVENT = 'EVENT'

export function onEvent(event){
  const { data } = event

    const messages = JSON.parse(data)

    console.log('messages: ', messages)

    return {
      type: EVENT,
      payload: messages
    }
}