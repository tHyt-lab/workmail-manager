import { AuthProvider, HttpError } from "ra-core";
import awsAuthConfig from "@/config/aws-config/auth";
import { Amplify, Auth } from "aws-amplify";

Amplify.configure({
  Auth: awsAuthConfig,
});

const authProvider: AuthProvider = {
  // send username and password to the auth server and get back credentials
  login: () => Promise.resolve(),
  // when the dataProvider returns an error, check if this is an authentication error
  checkError: (error) => {
    return error instanceof HttpError ? Promise.resolve() : Promise.reject();
  },
  // when the user navigates, make sure that their credentials are still valid
  checkAuth: async () => {
    console.log(await Auth.currentAuthenticatedUser());
    await Auth.currentAuthenticatedUser()
      .then(() => Promise.resolve())
      .catch(() => Promise.reject());
  },
  // remove local credentials and notify the auth server that the user logged out
  logout: async () => {
    Auth.signOut()
      .then(() => Promise.resolve())
      .catch(() => Promise.reject());
  },
  // get the user's profile
  getIdentity: () =>
    Promise.resolve({
      id: "123",
    }),
  // get the user permissions (optional)
  getPermissions: () => Promise.resolve(),
};

export default authProvider;
