import authProvider from "@/providers/AuthProvider/AuthProvider";
import dataProvider from "@/providers/DataProvider/DataProvider";
import { Resource } from "ra-core";
import { Admin, ListGuesser } from "react-admin";
import Login from "./Login/Login";
import UserCreate from "./Form/UserEdit/UserCreate";

export default function AdminApp() {
  return (
    <Admin
      authProvider={authProvider}
      dataProvider={dataProvider}
      loginPage={Login}
      requireAuth
    >
      <Resource name="users" list={ListGuesser} create={UserCreate} />
    </Admin>
  );
}
