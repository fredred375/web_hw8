import { gql } from 'apollo-boost'

export const POSTS_SUBSCRIPTION = gql`
  subscription userPost(
    $name: String!
  ) {
    userPost(
      name: $name
    ) {
      mutation
      data{
        author
        name
        message
      }
    }
  }
`
