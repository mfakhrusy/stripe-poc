import { OrderStatus } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime";
import { DataFunctionArgs } from "@remix-run/server-runtime";
import React from "react";
import { useLoaderData, useParams, ActionFunction } from "remix";
import { auth } from "~/auth.server";
import genRandomSerial from "~/utils/genRandomSerial";
import { db } from "~/utils/db.server";

export const action: ActionFunction = async ({ request, params }) => {
  const itemId = params.itemId ?? "";
  const formData = await request.formData();
  const itemCount = formData.get("quantity");
  const itemGoal = formData.get("quantityGoal");
  const customerEmail = formData.get("email");

  await db.orderPerCustomer.create({
    data: {
      itemCount: Number(itemCount),
      orders: {
        create: {
          serial: genRandomSerial(),
          itemGoal: Number(itemGoal),
          status: "WAITING_FOR_FULFILLMENT",
          item: {
            connect: {
              id: Number(itemId),
            },
          },
        },
      },
      customer: {
        connect: {
          email: customerEmail as string,
        },
      },
    },
  });

  return null;
};

export const loader = async ({ request, params }: DataFunctionArgs) => {
  const email = await auth.isAuthenticated(request);

  const itemId = Number(params.itemId);

  const data = {
    item: await db.item.findUnique({
      where: { id: itemId },
    }),
    currentCustomer: await db.customer.findUnique({
      where: { email: email ?? "" },
    }),
  };
  return data;
};

type LoaderData = Awaited<ReturnType<typeof loader>>;

const calculatePrice = (
  price_per_threshold: Array<Decimal>,
  item_count_threshold: Array<number>,
  quantity: number
) => {
  const priceProgression = price_per_threshold
    .map((price, id) => {
      return {
        minItem: item_count_threshold[id],
        price,
      };
    })
    .sort((a, b) => b.minItem - a.minItem);

  let price = 0;

  for (let i = 0; i < priceProgression.length; i++) {
    const { minItem, price: itemPrice } = priceProgression[i];
    if (quantity >= minItem) {
      price = quantity * Number(itemPrice);
      break;
    }
  }

  return price;
};

export default function CreateNewOrder() {
  const data = useLoaderData<LoaderData>();
  const [itemQuantity, setItemQuantity] = React.useState(0);
  const { itemId } = useParams();

  const totalPrice = calculatePrice(
    data.item?.price_per_threshold ?? [],
    data.item?.item_count_threshold ?? [],
    itemQuantity
  );

  return (
    <div className="bg-gray-100 p-2 w-full">
      <h1 className="pb-2 font-bold text-xl">Create New Order</h1>
      <hr />
      <form
        className="pt-2 flex flex-col"
        action={`/dashboard/order/new/${itemId}`}
        method="post"
      >
        <h2 className="font-semibold text-lg pb-4">Customer Detail</h2>
        <div className="flex justify-between h-10 mb-2">
          <label htmlFor="email" className="font-bold flex items-center">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            className="w-3/4 placeholder:text-slate-100 placeholder:opacity-40 p-1 border-2 border-black bg-gray-200 hover:cursor-not-allowed"
            readOnly
            defaultValue={data.currentCustomer?.email}
          />
        </div>
        <div className="flex justify-between h-10 mb-2">
          <label htmlFor="name" className="font-bold flex items-center">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            className="w-3/4 placeholder:text-slate-100 placeholder:opacity-40 p-1 border-2 border-black bg-gray-200 hover:cursor-not-allowed"
            disabled
            value={data.currentCustomer?.name ?? ""}
          />
        </div>
        <h2 className="font-semibold text-lg py-4">Item Detail</h2>
        <div className="flex">
          <img src={data.item?.imageURL ?? ""} alt="" className="w-auto h-32" />
          <div className="ml-4">
            <p className="mb-2">{`Item name: ${data.item?.name}`}</p>
            <p>Price:</p>
            {data.item?.price_per_threshold.map((price, index) => (
              <p key={index} className="w-56 flex justify-between">
                <span>
                  {`min ${data.item?.item_count_threshold[index]} items`}
                </span>
                <span>{`$${price}/item`}</span>
              </p>
            ))}
          </div>
        </div>
        <h2 className="font-semibold text-lg py-4">Order Detail</h2>
        <div className="flex justify-between h-10 mb-2">
          <label htmlFor="quantity" className="font-bold flex items-center">
            Quantity
          </label>
          <input
            type="number"
            name="quantity"
            id="quantity"
            placeholder="Quantity"
            className="w-3/4 placeholder:text-slate-100 placeholder:opacity-40 p-1 border-2 border-black"
            defaultValue={0}
            onChange={(e) => setItemQuantity(Number(e.target.value))}
          />
        </div>
        <div className="flex justify-between h-10 mb-2">
          <label htmlFor="quantityGoal" className="font-bold flex items-center">
            Quantity Goal
          </label>
          <input
            type="number"
            name="quantityGoal"
            id="quantityGoal"
            placeholder="Quantity Goal"
            className="w-3/4 placeholder:text-slate-100 placeholder:opacity-40 p-1 border-2 border-black"
            defaultValue={0}
          />
        </div>
        <div className="flex justify-between h-10 mb-2">
          <label htmlFor="totalPrice" className="font-bold flex items-center">
            Total Price
          </label>
          <input
            type="text"
            name="totalPrice"
            id="totalPrice"
            className="w-3/4 placeholder:text-slate-100 placeholder:opacity-40 p-1 border-2 border-black bg-gray-200 hover:cursor-not-allowed"
            disabled
            value={`${totalPrice}$`}
          />
        </div>
        <button
          type="submit"
          className="border-black rounded-md border-2 w-32 p-2 mt-4 hover:bg-gray-300"
        >
          Order
        </button>
      </form>
    </div>
  );
}
