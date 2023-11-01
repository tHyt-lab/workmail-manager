import {
  CreateUserCommand,
  DeregisterFromWorkMailCommand,
  DescribeUserCommand,
  ListUsersCommand,
  NameAvailabilityException,
  RegisterToWorkMailCommand,
  WorkMailClient,
} from "@aws-sdk/client-workmail";
import { fromCognitoIdentityPool } from "@aws-sdk/credential-providers";
import { Auth } from "aws-amplify";
import { DataProvider, HttpError } from "ra-core";

async function createWorkMailClient(): Promise<WorkMailClient> {
  const idToken = await Auth.currentSession().then((session) =>
    session.getIdToken().getJwtToken()
  );
  return new WorkMailClient({
    region: "us-east-1",
    credentials: fromCognitoIdentityPool({
      clientConfig: {
        region: process.env.NEXT_PUBLIC_AWS_REGION,
      },
      identityPoolId: process.env.NEXT_PUBLIC_COGNITO_IDENTITY_POOL_ID || "",
      logins: {
        [`cognito-idp.${process.env.NEXT_PUBLIC_AWS_REGION}.amazonaws.com/${process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID}`]:
          idToken,
      },
    }),
  });
}

const dataProvider: DataProvider = {
  getList: async () => {
    const workmailClient = await createWorkMailClient();

    const userList = await workmailClient.send(
      new ListUsersCommand({
        OrganizationId: process.env.NEXT_PUBLIC_WORKMAIL_ORGANIZATION_ID,
      })
    );

    return {
      data:
        userList.Users?.map((user, i) => ({
          id: user.Id,
          name: user.Name,
          email: user.Email,
          state: user.State,
        })) ?? ([] as any),
      total: userList.Users?.length || 0,
    };
  },
  getOne: async (resource, params) => {
    const workmailClient = await createWorkMailClient();

    const user = await workmailClient.send(
      new DescribeUserCommand({
        OrganizationId: process.env.NEXT_PUBLIC_WORKMAIL_ORGANIZATION_ID,
        UserId: params.id as string,
      })
    );

    return {
      data: {
        id: user.UserId,
        name: user.Name,
        email: user.Email,
        state: user.State,
      } as any,
    };
  },
  getMany: (resource, params) => Promise.resolve({ data: [] }),
  getManyReference: (resource, params) => Promise.resolve({ data: [] }),
  create: async (resource, params) => {
    const workmailClient = await createWorkMailClient();

    // ユーザー追加
    const user = await workmailClient
      .send(
        new CreateUserCommand({
          OrganizationId: process.env.NEXT_PUBLIC_WORKMAIL_ORGANIZATION_ID,
          DisplayName: params.data.displayName,
          Name: params.data.email,
          Password: params.data.password,
        })
      )
      .catch((e) => {
        if (e instanceof NameAvailabilityException) {
          throw new HttpError(
            `ユーザー名「${params.data.email}」は既に登録されています。`,
            e.$metadata.httpStatusCode
          );
        }
        throw new HttpError(e, 500);
      });

    // ユーザー有効化
    await workmailClient
      .send(
        new RegisterToWorkMailCommand({
          OrganizationId: process.env.NEXT_PUBLIC_WORKMAIL_ORGANIZATION_ID,
          EntityId: user.UserId,
          Email: `${params.data.email}@${params.data.domain}`,
        })
      )
      .catch((e) => {
        throw new HttpError(e, 500);
      });

    return Promise.resolve({
      data: {
        id: user.UserId,
      } as any,
    });
  },
  update: (resource, params) => {
    console.log("update", resource, params);
    return Promise.resolve({
      data: {
        id: "",
      } as any,
    });
  },
  updateMany: (resource, params) => Promise.resolve({ data: [] }),
  delete: (resource, params) => {
    console.log("delete", resource, params);
    return Promise.resolve({
      data: {
        id: "",
      } as any,
    });
  },
  deleteMany: async (resource, params) => {
    const workmailClient = await createWorkMailClient();

    params.ids.forEach(async (id) => {
      await workmailClient
        .send(
          new DeregisterFromWorkMailCommand({
            OrganizationId: process.env.NEXT_PUBLIC_WORKMAIL_ORGANIZATION_ID,
            EntityId: id.toString(),
          })
        )
        .catch((e) => {
          throw new HttpError(e, 500);
        });
    });

    return Promise.resolve({ data: [] });
  },
};

export default dataProvider;
