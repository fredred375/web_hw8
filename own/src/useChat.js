import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@apollo/react-hooks'
import {
  MESSAGES_QUERY,
  SEND_MESSAGE,
  CLEAR_MESSAGES,
  MESSAGES_SUBSCRIPTION
} from './graphql';


const useChat = () => {
  const { loading, error, data, subscribeToMore } = useQuery(MESSAGES_QUERY)
  const [mutation_sendMessage] = useMutation(SEND_MESSAGE);
  const [mutation_clearMessages] = useMutation(CLEAR_MESSAGES)
  useEffect(() => {
    subscribeToMore({
      document: MESSAGES_SUBSCRIPTION,
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev
        console.log(subscriptionData.data)
        if(subscriptionData.data.messages.mutation === 'CLEARED')
        {
          return {
            ...prev,
            messages: []
          }
        }
        else
        {
          const newMessage = subscriptionData.data.messages.data
          return {
            ...prev,
            messages: [...prev.messages, newMessage]
          }
        }
      }
    })
  }, [subscribeToMore])

  const sendMessage = async (msg) => {
    // TODO
    const res = await mutation_sendMessage({
      variables: {
        name: msg.name,
        body: msg.body
      }
    })
    console.log(res);
  }

  const clearMessages = async () => {
    // TODO
    const res = await mutation_clearMessages();
    console.log(res);
  }

  return {
    loading,
    error,
    data,
    sendMessage,
    clearMessages
  }
}

export default useChat

