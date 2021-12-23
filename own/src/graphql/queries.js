import { gql } from 'apollo-boost';

export const MESSAGES_QUERY = gql`
    query
    {
        messages
        {
            id
            name
            body
        }
    }
`