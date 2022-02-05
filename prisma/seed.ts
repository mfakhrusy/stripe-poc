import { PrismaClient } from "@prisma/client";
const db = new PrismaClient();

async function deleteAllSupplierDummyData() {
  await db.item.deleteMany({});
  await db.supplier.deleteMany({});
}

async function deleteAllCustomerDummyData() {
  await db.customer.deleteMany({});
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
              name: "JD - Item 1",
              price_threshold: [1, 10, 100],
              price_per_threshold: ["20000", "18000", "16000"],
            },
            {
              name: "JD - Item 2",
              price_threshold: [1, 10, 100],
              price_per_threshold: ["2000", "1800", "1600"],
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
              name: "AK - Item 1",
              price_threshold: [1, 10, 100],
              price_per_threshold: ["50000", "40000", "30000"],
            },
            {
              name: "AK - Item 2",
              price_threshold: [1, 10, 100],
              price_per_threshold: ["3000", "2800", "2600"],
            },
          ],
        },
      },
    },
  });
};

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
  })
}

const seedCustomerData = async () => {
  await deleteAllCustomerDummyData();
  await generateCustomerDummyData();
}

const seedSupplierData = async () => {
  await deleteAllSupplierDummyData();
  await generateSupplierDummyData();
};

seedSupplierData();
seedCustomerData();
