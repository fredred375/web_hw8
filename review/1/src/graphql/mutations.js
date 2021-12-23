import { gql } from 'apollo-boost'

export const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $author: String!
    $name: String!
    $message: String!
  ) {
    createPost(
      data: {
        author: $author
        name: $name
        message: $message
      }
    ) {
      author
      name
      message
    }
  }
`
