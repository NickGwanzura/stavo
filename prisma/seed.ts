import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Create default roles
  const roles = await Promise.all(
    [
      { name: "Owner", description: "Full access to all features" },
      { name: "Manager", description: "Manage inventory, sales, and operations" },
      { name: "Salesperson", description: "Create sales and quotations" },
      { name: "InventoryClerk", description: "Receive and manage stock" },
      { name: "Technician", description: "Test and repair devices" },
      { name: "Accountant", description: "Manage finances and expenses" },
      { name: "Auditor", description: "Read-only access for auditing" },
    ].map((role) =>
      prisma.role.upsert({
        where: { name: role.name },
        update: { description: role.description },
        create: role,
      })
    )
  );
  console.log(`Created ${roles.length} roles`);

  // Create default organisation
  const org = await prisma.organisation.upsert({
    where: { slug: "ximex-demo" },
    update: {},
    create: {
      name: "Ximex Demo Dealers",
      slug: "ximex-demo",
      address: "Ximex Mall, Harare, Zimbabwe",
      phone: "+263 77 000 0000",
      email: "info@ximexdemo.co.zw",
      invoicePrefix: "INV",
      quotationPrefix: "QTN",
      defaultCurrency: "USD",
      supportedCurrencies: ["USD", "ZAR", "ZiG"],
      warrantyTerms:
        "All devices come with a 14-day warranty covering hardware defects. Accidental damage and liquid damage are not covered.",
    },
  });
  console.log(`Created organisation: ${org.name}`);

  // Create branches
  const branches = await Promise.all(
    [
      { name: "Ximex Mall Shop 1" },
      { name: "Ximex Mall Shop 2" },
      { name: "CBD Storeroom" },
      { name: "Repair Workshop" },
    ].map((branch) =>
      prisma.branch.upsert({
        where: {
          organisationId_name: {
            organisationId: org.id,
            name: branch.name,
          },
        },
        update: {},
        create: {
          organisationId: org.id,
          name: branch.name,
        },
      })
    )
  );
  console.log(`Created ${branches.length} branches`);

  // Create default expense categories
  const expenseCategories = await Promise.all(
    [
      "Shop Rent",
      "Electricity",
      "Internet",
      "Transport",
      "Salaries",
      "Repairs",
      "Packaging",
      "Marketing",
      "Bank Charges",
      "Licences",
      "Taxes",
      "Owner Drawings",
      "Other",
    ].map((name) =>
      prisma.expenseCategory.upsert({
        where: {
          organisationId_name: {
            organisationId: org.id,
            name,
          },
        },
        update: {},
        create: {
          organisationId: org.id,
          name,
        },
      })
    )
  );
  console.log(`Created ${expenseCategories.length} expense categories`);

  // Create default financial accounts
  const accounts = await Promise.all(
    [
      { name: "Cash on Hand", type: "CASH" },
      { name: "EcoCash", type: "ECOCASH" },
      { name: "OneMoney", type: "ONEMONEY" },
      { name: "InnBucks", type: "INNBUCKS" },
      { name: "Bank Account", type: "BANK" },
      { name: "Card Payments", type: "CARD" },
    ].map((account) =>
      prisma.financialAccount.upsert({
        where: {
          organisationId_name: {
            organisationId: org.id,
            name: account.name,
          },
        },
        update: {},
        create: {
          organisationId: org.id,
          name: account.name,
          type: account.type,
        },
      })
    )
  );
  console.log(`Created ${accounts.length} financial accounts`);

  // Create product categories
  const categories = await Promise.all(
    [
      { name: "Smartphones", isAccessory: false },
      { name: "Feature Phones", isAccessory: false },
      { name: "Tablets", isAccessory: false },
      { name: "Chargers", isAccessory: true },
      { name: "Cables", isAccessory: true },
      { name: "Earphones", isAccessory: true },
      { name: "Phone Cases", isAccessory: true },
      { name: "Screen Protectors", isAccessory: true },
      { name: "Power Banks", isAccessory: true },
      { name: "Smartwatches", isAccessory: true },
    ].map((cat) =>
      prisma.productCategory.upsert({
        where: {
          organisationId_name: {
            organisationId: org.id,
            name: cat.name,
          },
        },
        update: {},
        create: {
          organisationId: org.id,
          name: cat.name,
          isAccessory: cat.isAccessory,
        },
      })
    )
  );
  console.log(`Created ${categories.length} product categories`);

  // Create brands
  const brands = await Promise.all(
    [
      "Apple",
      "Samsung",
      "Huawei",
      "Xiaomi",
      "Tecno",
      "Infinix",
      "Nokia",
      "Oppo",
      "Vivo",
      "Sony",
    ].map((name) =>
      prisma.brand.upsert({
        where: {
          organisationId_name: {
            organisationId: org.id,
            name,
          },
        },
        update: {},
        create: {
          organisationId: org.id,
          name,
        },
      })
    )
  );
  console.log(`Created ${brands.length} brands`);

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
