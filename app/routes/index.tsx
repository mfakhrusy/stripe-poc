import { redirect, LoaderFunction } from "remix";
import { auth } from "~/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });

  return redirect("/dashboard");
};
