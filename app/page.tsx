import { Amplify } from "aws-amplify";
import awsAuthConfig from "@/config/aws-config/auth";
import dynamic from "next/dynamic";

Amplify.configure({
  Auth: awsAuthConfig,
});

const AdminApp = dynamic(() => import("@/app/components/AdminApp"), {ssr: false});

export default function Home() {
  return (
    <AdminApp />
  );
}
