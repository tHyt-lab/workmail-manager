"use client";

import { Box, Container, Stack, Typography } from "@mui/material";
import { Auth } from "aws-amplify";
import { Button } from "react-admin";
import MicrosoftIcon from "@mui/icons-material/Microsoft";
import Image from "next/image";

export default function Login() {
  const loginHandler = async () => {
    Auth.federatedSignIn({ customProvider: "saml-test-entraid" }).catch((e) => {
      // eslint-disable-next-line no-console
      console.error(e);
    });
  };

  return (
    <Container
      maxWidth="md"
      sx={{
        height: "98vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack direction="column" alignItems="center" gap={3}>
        <Image src="/consallink-logo.png" alt="logo" width={300} height={300} />
        <Typography variant="h4" gutterBottom>
          CL WorkMail Manager
        </Typography>
        <Box>
          <Button
            size="large"
            label="Microsoft365でサインイン"
            variant="contained"
            onClick={loginHandler}
            sx={{
              textTransform: "none",
            }}
            startIcon={<MicrosoftIcon />}
          />
        </Box>
      </Stack>
    </Container>
  );
}
