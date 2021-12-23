import './App.css'
import React, { useEffect, useRef, useState } from 'react'
import useChat from './useChat'
import { Button, Input, message, Tag } from 'antd'


function App() {
  
  const { loading, error, data, sendMessage, clearMessages } = useChat()

  const [username, setUsername] = useState('')
  const [body, setBody] = useState('')

  const bodyRef = useRef(null)

  useEffect(()=>{
    console.log(data)
  },[data])
  const displayStatus = (s) => {
    if (s.msg) {
      const { type, msg } = s
      const content = {
        content: msg,
        duration: 0.5
      }

      switch (type) {
        case 'success':
          message.success(content)
          break
        case 'info':
          message.info(content)
          break
        case 'danger':
        default:
          message.error(content)
          break
      }
    }
  }
  return (
    <div className="App">
      <div className="App-title">
        <h1>Simple Chat</h1>
        <Button type="primary" danger onClick={clearMessages}>
          Clear
        </Button>
      </div>
      <div className="App-messages">
        {loading || error ? (
          <p style={{ color: '#ccc' }}>
            Loading...
          </p>
        ) : (data.messages.length !== 0 ?(
          data.messages.map(({ id, name, body }) => (
            <p className="App-message" key={id}>
              <Tag color="blue">{name}</Tag> {body}
            </p>
          )
        )): (<p style={{ color: '#ccc' }}>
        No message...
      </p>)
        )}
      </div>
      <Input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        style={{ marginBottom: 10 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            bodyRef.current.focus()
          }
        }}
      ></Input>
      <Input.Search
        rows={4}
        value={body}
        ref={bodyRef}
        enterButton="Send"
        onChange={(e) => setBody(e.target.value)}
        placeholder="Type a message here..."
        onSearch={(msg) => {
          if (!msg || !username) {
            displayStatus({
              type: 'error',
              msg: 'Please enter a username and a message body.'
            })
            return
          }

          sendMessage({ name: username, body: msg })
          setBody('')
        }}
      ></Input.Search>
    </div>
  )
}

export default App
