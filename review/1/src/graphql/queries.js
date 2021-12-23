import { gql } from 'apollo-boost'

export const POSTS_QUERY = gql`
  query posts (
      $query: String!
  ) {
    posts (
      query: $query
    ) {
        author
        name
        message
    }
  }
`
