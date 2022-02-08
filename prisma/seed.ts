import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function deleteAllSupplierDummyData() {
  await db.item.deleteMany({});
  await db.supplier.deleteMany({});
}

async function deleteAllCustomerDummyData() {
  await db.customer.deleteMany({});
}

async function deleteAllOrderData() {
  await db.order.deleteMany({});
}

async function deleteAllOrderPerCustomerData() {
  await db.orderPerCustomer.deleteMany({});
}

async function generateSupplierDummyData() {
  await db.supplier.create({
    data: {
      email: "JohnDoe@gmail.com",
      name: "John Doe",
      items: {
        createMany: {
          data: [
            {
              name: "Laptop",
              item_count_threshold: [1, 10, 100],
              price_per_threshold: [20000.2, 18000.1, 16000.1],
              imageURL:
                "https://stripe-poc-assets.s3.amazonaws.com/laptop-stretched.png",
            },
            {
              name: "Cup",
              item_count_threshold: [1, 10, 100],
              price_per_threshold: [2000, 1800, 1600],
              imageURL: "https://stripe-poc-assets.s3.amazonaws.com/cup.png",
            },
          ],
        },
      },
    },
  });

  await db.supplier.create({
    data: {
      email: "AshKetchup@gmail.com",
      name: "Ash Ketchup",
      items: {
        createMany: {
          data: [
            {
              name: "Ipad",
              item_count_threshold: [1, 10, 100],
              price_per_threshold: [50000, 40000, 30000],
              imageURL: "https://stripe-poc-assets.s3.amazonaws.com/ipad.png",
            },
            {
              name: "Book",
              item_count_threshold: [1, 10, 100],
              price_per_threshold: [3000, 2800, 2600],
              imageURL: "https://stripe-poc-assets.s3.amazonaws.com/book.png",
            },
          ],
        },
      },
    },
  });
}

const generateCustomerDummyData = async () => {
  await db.customer.createMany({
    data: [
      {
        email: "customer1@gmail.com",
        name: "Customer 1",
      },
      {
        email: "customer2@gmail.com",
        name: "Customer 2",
      },
      {
        email: "customer3@gmail.com",
        name: "Customer 3",
      },
    ],
  });
};

const seedCustomerData = async () => {
  await deleteAllCustomerDummyData();
  await generateCustomerDummyData();
};

const seedSupplierData = async () => {
  await deleteAllSupplierDummyData();
  await generateSupplierDummyData();
};

const removeOrderData = async () => {
  await deleteAllOrderData();
  await deleteAllOrderPerCustomerData();
};

const seedAllData = async () => {
  await removeOrderData();
  await seedSupplierData();
  await seedCustomerData();
};

seedAllData();
