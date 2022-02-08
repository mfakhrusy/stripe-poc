import { Item } from "@prisma/client";
import { Link } from "remix";

type Props = {
  item: Item;
};

export default function SupplierItem({ item }: Props) {
  return (
    <Link
      to={`/dashboard/order/new/${item.id}`}
      className="p-4 hover:shadow-lg"
    >
      <img
        src={
          item.imageURL ??
          "https://via.placeholder.com/1280x720.png?text=Placeholder%20Image"
        }
        className="w-52 h-auto"
      />
      <h2 className="mb-2 text-bold">{item.name}</h2>
      <div>
        {item.price_per_threshold.map((price, id) => (
          <p key={id} className="flex justify-between">
            <span>{`${item.item_count_threshold[id]} Item`}</span>
            <span>{`$${price}/item`}</span>
          </p>
        ))}
      </div>
    </Link>
  );
}
