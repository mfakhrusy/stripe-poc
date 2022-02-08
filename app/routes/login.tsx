import { ActionFunction, json, LoaderFunction } from "remix";
import { auth, sessionStorage } from "~/auth.server";

export const action: ActionFunction = async ({ request }) => {
  await auth.authenticate("form", request, {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
  });
};

type LoaderData = {
  error: { message: string } | null;
};

export const loader: LoaderFunction = async ({ request }) => {
  await auth.isAuthenticated(request, { successRedirect: "/dashboard" });

  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );

  const error = session.get(auth.sessionErrorKey) as LoaderData["error"];

  return json<LoaderData>({ error });
};

export default function Login() {
  return (
    <main
      className="w-screen h-screen flex items-center justify-center font-sans"
      style={{ background: "linear-gradient(to right, #8360c3, #2ebf91)" }}
    >
      <div className="w-80 h-80 border-2 border-black rounded-lg p-4">
        <h1 className="font-bold text-xl text-center mb-4">Login</h1>
        <form action="/login" method="post" className="flex flex-col">
          <label htmlFor="email" className="font-bold mb-3">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            placeholder="Enter Email"
            className="placeholder:text-slate-100 placeholder:opacity-40 text-gray-100 p-1 bg-transparent border-b-2 border-b-black"
          />
          <label htmlFor="password" className="font-bold mb-3 mt-6">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            placeholder="Enter Password"
            className="placeholder:text-slate-100 placeholder:opacity-40 text-gray-100 p-1 bg-transparent border-b-2 border-b-black"
            defaultValue="test"
          />
          <button
            style={{
              background: "linear-gradient(to center, #8360c3, #2ebf91)",
            }}
            className="w-28 rounded-xl self-center mt-6 py-2 text-sm shadow-sm hover:shadow-lg hover:font-bold"
          >
            Log In
          </button>
        </form>
      </div>
    </main>
  );
}
