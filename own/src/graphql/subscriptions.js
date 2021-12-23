import { gql } from 'apollo-boost'

export const MESSAGES_SUBSCRIPTION = gql`
  subscription {
    messages
    {
        mutation
        data
        {
            id
            name
            body
        }
    }
  }
`