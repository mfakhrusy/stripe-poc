import { Supplier } from "@prisma/client";
import { LoaderFunction, useLoaderData } from "remix";
import { db } from "~/utils/db.server";

type LoaderData = { suppliers: Array<Supplier> };
export const loader: LoaderFunction = async () => {
  const data: LoaderData = { suppliers: await db.supplier.findMany() };
  return data;
};

export default function Index() {
  const data = useLoaderData<LoaderData>();
  return (
    <main>
      {data.suppliers.map((supplier) => (
        <div key={supplier.id}>
          <h1>{supplier.name}</h1>
          <p>{supplier.email}</p>
        </div>
      ))}
    </main>
  );
}
