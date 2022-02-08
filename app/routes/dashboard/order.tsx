import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Outlet } from "remix";
import { auth } from "~/auth.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return null;
};

export default function Order() {
  return <Outlet />;
}
