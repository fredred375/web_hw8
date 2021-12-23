import './App.css'
import React, { useEffect, useRef, useCallback, useState } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
//import useChat from './useChat'
import { Button, Input, message, Tag } from 'antd'

import {
  POSTS_QUERY,
  CREATE_POST_MUTATION,
  POSTS_SUBSCRIPTION
} from './graphql'

function App() {
  const [authorname, setAuthorname] = useState('')
  const [username, setUsername] = useState('')
  const [body, setBody] = useState('')

  const { loading, error, data, subscribeToMore } = useQuery(POSTS_QUERY, {variables: { query : authorname}})
  const [addPost] = useMutation(CREATE_POST_MUTATION)

  const bodyRef = useRef(null)

  useEffect(() => {
    subscribeToMore({
      document: POSTS_SUBSCRIPTION,
      variables: { name: authorname },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        const newPost = subscriptionData.data.userPost.data

        return {
          ...prev,
          posts: [...prev.posts, newPost]
        }
      }
    })
  }, [subscribeToMore, authorname])

  const handleFormSubmit = useCallback(
    (e) => {
      //e.preventDefault()

      if (!username || !body) return

      addPost({
        variables: {
          author: authorname,
          name: username,
          message: body
        }
      })

      setBody('')
    },
    [addPost, username, body]
  )

  return authorname?(
    <div className="App">
      <div className="App-title">
        <h1>Simple Chat</h1>
        {/* <Button type="primary" danger onClick={clearMessages}>
          Clear
        </Button> */}
      </div>
      <div className="App-messages">
        {!data||data.length === 0 ? (
          <p style={{ color: '#ccc' }}>
            {loading? 'No messages...' : 'Loading...'}
          </p>
        ) : (
          data.posts.map(({author, name, message}, i) => (
            author == authorname?
            (
              <p className="App-message" key={i}>
                <Tag color="yellow">{author}</Tag> {message}
              </p>
            ):(
              <p className="App-message" key={i}>
                <Tag color="blue">{author}</Tag> {message}
              </p>
            )
          ))
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
        placeholder="Type a message here..."
        value={body}
        ref={bodyRef}
        enterButton="Send"
        onChange={(e) => setBody(e.target.value)}
        onSearch={
          // (msg) => {
          // if (!msg || !username) {
            // displayStatus({
            //   type: 'error',
            //   msg: 'Please enter a username and a message body.'
            // })
          //   return
          // }
          // }
          handleFormSubmit
        }
      ></Input.Search>
    </div>
  ):(
    <Input
        placeholder="Username"
        style={{ marginBottom: 10 }}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setAuthorname(e.target.value)
        }}}
      ></Input>
  )
}

export default App



  // const displayStatus = (s) => {
  //   if (s.msg) {
  //     const { type, msg } = s
  //     const content = {
  //       content: msg,
  //       duration: 0.5
  //     }

  //     switch (type) {
  //       case 'success':
  //         message.success(content)
  //         break
  //       case 'info':
  //         message.info(content)
  //         break
  //       case 'danger':
  //       default:
  //         message.error(content)
  //         break
  //     }
  //   }
  // }

  // useEffect(() => {
  //   displayStatus(status)
  // }, [status])