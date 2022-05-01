import { gql } from "apollo-server";

export const DeleteAccount = gql`
  mutation DeleteAccount($id: ID!) {
    deleteAccount(id: $id)
  }
`;

export const DeleteProfile = gql`
  mutation DeleteProfile($accountId: ID!) {
    deleteProfile(accountId: $accountId)
  }
`;

export const DeleteAllUserBookmarks = gql`
  mutation DeleteAllUserBookmarks($ownerAccountId: ID!) {
    deleteAllUserBookmarks(ownerAccountId: $ownerAccountId)
  }
`;

export const RemoveUserFromNetworks = gql`
  mutation RemoveUserFromNetworks($accountId: ID!) {
    removeUserFromNetworks(accountId: $accountId)
  }
`;
