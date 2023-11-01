import { Edit, SimpleForm, TextInput } from "react-admin";

export default function UserEdit() {
  return (
    <Edit>
      <SimpleForm>
        <TextInput source="name" />
        <TextInput source="email" />
        <TextInput source="state" />
      </SimpleForm>
    </Edit>
  );
}
