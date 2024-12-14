import { gql } from "@apollo/client";

export const GET_AUTHENTICATED_USER = gql`
  query GetAuthenticatedUser {
    authUser {
        _id
        username
        profilePicture
        name
        gender
    }
  }
`;

export const GET_USER_AND_TRANSACTIONS = gql`
  query GetAuthUserAndTransactions($userId: ID!){
    user(userId: $userId){
        _id
        username
        profilePicture
        name
        gender
        # relationships
        transactions {
            _id
            description
            paymentType
            category
            amount
            location
            date
        }
    }
  }
`;
