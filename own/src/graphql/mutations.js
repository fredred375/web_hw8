import { gql } from 'apollo-boost'

export const SEND_MESSAGE = gql`
    mutation sendMessage(
        $name: String!
        $body: String!
    ) {
        send(messageInput: {
            name: $name,
            body: $body
        })
        {
            id
            name
            body
        }
    }
`

export const CLEAR_MESSAGES = gql`
    mutation {
        clear
    }
`