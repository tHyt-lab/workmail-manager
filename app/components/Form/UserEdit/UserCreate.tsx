"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Box, Stack } from "@mui/material";
import {
  Create,
  PasswordInput,
  SaveButton,
  SelectInput,
  SimpleForm,
  TextInput,
  Toolbar,
} from "react-admin";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

const validateSchema = z
  .object({
    userName: z
      .string()
      .min(1)
      .regex(
        /^[a-zA-Z0-9_\-@\.]+$/i,
        "ユーザー名に使用できる文字は、a-z, A-Z, 0-9, _, -, @, .(ピリオド)のみです。"
      ),
    displayName: z.string().min(1),
    email: z.string(),
    domain: z.string(),
    password: z
      .string()
      .min(8, "パスワードは8文字以上で入力してください")
      .regex(
        /^((?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])|(?=.*[a-z])(?=.*[A-Z])(?=.*[!@;:])|(?=.*[A-Z])(?=.*[0-9])(?=.*[!@;:])|(?=.*[a-z])(?=.*[0-9])(?=.*[!@;:]))[a-zA-Z0-9!@;:]{8,}$/,
        "パスワードは最低8文字で、小文字、大文字、数字、特殊文字から少なくとも3種類は使用する。"
      ),
    passwordConfirm: z.string().min(1),
  })
  .superRefine(({ password, passwordConfirm }, ctx) => {
    if (password !== passwordConfirm) {
      ctx.addIssue({
        path: ["passwordConfirm"],
        code: "custom",
        message: "パスワードが一致しません",
      });
    }
  });

const BottomToolbar = () => {
  return (
    <Toolbar>
      <SaveButton label="作成" />
    </Toolbar>
  );
};

const Inputs = () => {
  const { setValue } = useFormContext();

  return (
    <>
      <TextInput
        source="userName"
        size="small"
        onChange={(event) => {
          setValue("email", event.target.value);
        }}
      />
      <TextInput source="displayName" size="small" />
      <Stack direction="row" alignItems="center" columnGap={1}>
        <TextInput source="email" size="small" disabled />
        <Box component="span" mb={2}>
          @
        </Box>
        <SelectInput
          source="domain"
          choices={[
            {
              id: "test-workmail-consallink.awsapps.com",
              name: "test-workmail-consallink.awsapps.com",
            },
          ]}
          size="small"
        />
      </Stack>
      <PasswordInput source="password" size="small" />
      <PasswordInput source="passwordConfirm" size="small" />
    </>
  );
};

export default function UserCreate() {
  return (
    <Create>
      <SimpleForm
        toolbar={<BottomToolbar />}
        resolver={zodResolver(validateSchema)}
      >
        <Inputs />
      </SimpleForm>
    </Create>
  );
}
