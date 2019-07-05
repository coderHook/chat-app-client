import React, { Component } from 'react'
import * as request from 'superagent'
import { connect } from 'react-redux'
import {onEvent} from './actions/messages'

class App extends Component {
  state = {
    messages: [],
    message: ''
  }

  source = new EventSource('http://localhost:5000/stream')

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
      .post('http://localhost:5000/message')
      .send({message})
      .then(response => {
        console.log('res ext: ', response)
      })
      .catch(console.error)
  }

  render() {
    const messages = this
              .props
              .messages
              .map((message, index) => <p key={index} >
              { message } 
            </p>)

    return <main>
      <form onSubmit={this.onSubmit}>
        <input type="text" onChange={ this.onChange } value={this.state.message}/>
        <button>Send</button>
      </form>
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