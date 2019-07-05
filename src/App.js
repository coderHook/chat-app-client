import React, { Component } from 'react'
import * as request from 'superagent'
import { connect } from 'react-redux'
import {onEvent} from './actions/messages'

class App extends Component {
  state = {
    messages: [],
    message: '',
    user: 'Pedro'
  }

  urls = {
    Pedro: 'http://localhost:5000',
    Mario: 'https://live-chat-appi.herokuapp.com',
    Andrew: 'https://mighty-mesa-76259.herokuapp.com',
    Jelle: 'https://damp-plains-53364.herokuapp.com'
  }

  source = new EventSource(`${this.urls[this.state.user]}/stream`)

  componentDidMount() {
    this.source.onmessage = this.props.onEvent
  }

  onChange = (event) => {
    const { value } = event.target

    this.setState({ message: value})
  }

  onSubmit = (event) => {
    event.preventDefault();

    console.log('submit')
    this.setState({message: ''})

    const { message } = this.state

    request
      .post(`${this.urls[this.state.user]}/message`)
      .send({message})
      .then(response => {
        console.log('res ext: ', response)
      })
      .catch(console.error)
  }

  changeUser = (user) => {
    console.log('user!:', user)
    this.setState({ user })

    const url = `${this.urls[user]}/stream`
    console.log("url test:", url)
    this.source = new EventSource(url)

    this.source.onmessage = this.props.onEvent
  }

  renderText (message) {
    console.log("message test:", message)
    const text = typeof message === "string"
      ? message
      : message.message
    
    console.log("text test:", text)

    return text
  }

  render() {
    const messages = this
      .props
      .messages
      .map((message, index) => <p key={index} >
        { this.renderText(message) } 
      </p>)

    const users = (Object.keys(this.urls))

    return <main>

      <div>
        to whom: { users.map((user, i) => <button key={i} onClick={() => this.changeUser(user)}>{ user }</button>)}
        </div>

      <form onSubmit={this.onSubmit}>
        <input type="text" onChange={ this.onChange } value={this.state.message}/>
        <button>Send</button>
      </form>
      <h1>Messages: {this.state.user}</h1>
      {messages}
    </main>
  }
}

function mapStateToProps(state) {
  const { messages } = state
  return {
    messages
  }
}

const mapDispatchToProps = { onEvent }

export default connect(mapStateToProps, mapDispatchToProps)(App)