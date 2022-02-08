// from: https://github.com/remix-run/remix/blob/main/examples/remix-auth-form/app/auth.server.ts
import { createCookieSessionStorage } from "remix";
import { Authenticator, AuthorizationError } from "remix-auth";
import { FormStrategy } from "remix-auth-form";
import { db } from "~/utils/db.server";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: ["s3cret"], // This should be an env variable, change later
    secure: process.env.NODE_ENV === "production",
  },
});

export const auth = new Authenticator<string>(sessionStorage);

auth.use(
  new FormStrategy(async ({ form }) => {
    const email = (form.get("email") ?? "") as string;
    const password = (form.get("password") ?? "") as string;

    const customerEmails = await db.customer.findMany({
      select: { email: true },
    });

    // replace the code below with your own authentication logic
    if (!password) throw new AuthorizationError("Password is required");
    if (password !== "test") {
      throw new AuthorizationError("Invalid credentials");
    }
    if (!email) throw new AuthorizationError("Email is required");

    if (!customerEmails.find((c) => c.email === email)) {
      throw new AuthorizationError("Invalid credentials");
    }

    return email;
  })
);
