import { proxyActivities } from "@temporalio/workflow";

const {
  deleteAccount,
  deleteProfile,
  deleteAllUserBookmarks,
  removeUserFromNetworks
} = proxyActivities({
  startToCloseTimeout: "1 minute"
});

export async function DeleteAllUserData(accountId) {
  await deleteAccount(accountId);
  await deleteProfile(accountId);
  await deleteAllUserBookmarks(accountId);
  await removeUserFromNetworks(accountId);
}
