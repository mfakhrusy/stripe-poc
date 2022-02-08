import { DataFunctionArgs } from "@remix-run/server-runtime";
import { Outlet, useLoaderData, useParams } from "remix";
import SupplierItem from "~/components/dashboard/supplierItem";
import { db } from "~/utils/db.server";

export const loader = async ({ request }: DataFunctionArgs) => {
  const data = {
    suppliers: await db.supplier.findMany({
      include: {
        items: true,
      },
    }),
  };
  return data;
};

type LoaderData = Awaited<ReturnType<typeof loader>>;

export default function NewOrderList() {
  const data = useLoaderData<LoaderData>();
  const params = useParams();
  const itemId = params.itemId ?? null;

  return (
    <>
      <Outlet />
      {itemId ? null : (
        <div className="flex flex-col">
          {data.suppliers.map((supplier) => (
            <div key={supplier.id} className="pb-4">
              <p>{`Supplier: ${supplier.name}`}</p>
              <div className="flex">
                {supplier.items.map((item) => (
                  <SupplierItem item={item} key={item.id} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
