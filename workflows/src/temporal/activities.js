import {
  DeleteAccount,
  DeleteProfile,
  DeleteAllUserBookmarks,
  RemoveUserFromNetworks
} from "../graphql/operations.js";
import Auth0Client from "../utils/Auth0Client.js";
import createAuthenticatedApolloClient from "../graphql/client.js";

const { getToken } = new Auth0Client({
  audience: process.env.AUTH0_AUDIENCE,
  clientId: process.env.AUTH0_CLIENT_ID_WORKFLOWS,
  clientSecret: process.env.AUTH0_CLIENT_SECRET_WORKFLOWS,
  domain: process.env.AUTH0_DOMAIN
});

const apolloClient = createAuthenticatedApolloClient(
  process.env.GATEWAY_ENDPOINT,
  getToken
);

export async function deleteAccount(id) {
  const response = await apolloClient.mutate({
    mutation: DeleteAccount,
    variables: { id }
  });

  if (response.error) {
    throw new Error(response.error);
  } else {
    return true;
  }
}

export async function deleteProfile(accountId) {
  const response = await apolloClient.mutate({
    mutation: DeleteProfile,
    variables: { accountId }
  });

  if (response.error) {
    throw new Error(response.error);
  } else {
    return true;
  }
}

export async function removeUserFromNetworks() {
  const response = await apolloClient.mutate({
    mutation: RemoveUserFromNetworks,
    variables: { accountId }
  });

  if (response.error) {
    throw new Error(response.error);
  } else {
    return true;
  }
}

export async function deleteAllUserBookmarks(accountId) {
  const response = await apolloClient.mutate({
    mutation: DeleteAllUserBookmarks,
    variables: { accountId }
  });

  if (response.error) {
    throw new Error(response.error);
  } else {
    return true;
  }
}
