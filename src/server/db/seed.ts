import "dotenv/config";
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import * as schema from "../db/schemas";
import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/neon-http";

const client: NeonQueryFunction<boolean, boolean> = neon(
  process.env.DATABASE_URL!,
);
export const db = drizzle(client, { schema });

export async function GET() {
  console.log("Starting Seeding the Database");
  await seedDatabase();
  return Response.json({ message: "We start Seeding Now....." });
}

async function seedDatabase() {
  try {
    console.log("Connected to the database");
    console.log("Seeding...");

    await db.insert(schema.storeSettings).values({
      profileName: "default",
      storeForceClose: false,
      reservationInterval: 30,
      reservationDuration: 60,
      reservationNotArrivalExpirationTime: 15,
      tableNumberLeadingZeros: false,
      leadingZerosQuantity: 2,
    });

    const password = async (pass: string) => await bcrypt.hash(pass, 10);

    await db.insert(schema.users).values({
      name: "Store Manger",
      password: await password("password"),
      role: "admin",
      email: "store@example.com",
    });
    const [user] = await db
      .insert(schema.users)
      .values({
        name: "admin",
        password: await password("arccik@gmail.com"),
        email: "arccik@gmail.com",
        role: "admin",
      })
      .returning();

    await db.insert(schema.tables).values([
      { number: 1, seats: 4, status: "available" },
      { number: 2, seats: 4, status: "available" },
      { number: 3, seats: 4, status: "available" },
      { number: 4, seats: 4, status: "available" },
      { number: 5, seats: 4, status: "available" },
      { number: 6, seats: 4, status: "available" },
    ]);

    await db.insert(schema.storeRegularSchedule).values([
      { day: "sunday", number: 0, openTime: "10:00:00", closeTime: "16:00:00" },
      { day: "monday", number: 1, openTime: "09:00:00", closeTime: "17:00:00" },
      {
        day: "tuesday",
        number: 2,
        openTime: "09:00:00",
        closeTime: "17:00:00",
      },
      {
        day: "wednesday",
        number: 3,
        openTime: "09:00:00",
        closeTime: "17:00:00",
      },
      {
        day: "thursday",
        number: 4,
        openTime: "09:00:00",
        closeTime: "17:00:00",
      },
      { day: "friday", number: 5, openTime: "09:00:00", closeTime: "17:00:00" },
      {
        day: "saturday",
        number: 6,
        openTime: "10:00:00",
        closeTime: "16:00:00",
      },
    ]);

    await db.insert(schema.storeCustomSchedule).values([
      {
        date: new Date("2024-01-01"),
        name: "New Year's Day",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
      {
        date: new Date("2024-02-14"),
        name: "Valentine's Day",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
      {
        date: new Date("2024-03-17"),
        name: "St. Patrick's Day",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
      {
        date: new Date("2024-04-01"),
        name: "April Fools' Day",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
      {
        date: new Date("2024-05-05"),
        name: "Cinco de Mayo",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
      {
        date: new Date("2024-07-04"),
        name: "Independence Day (USA)",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
      {
        date: new Date("2024-10-31"),
        name: "Halloween",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
      {
        date: new Date("2024-11-11"),
        name: "Veterans Day",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
      {
        date: new Date("2024-12-25"),
        name: "Christmas Day",
        openTime: "11:00:00",
        closeTime: "16:00:00",
      },
    ]);

    await db
      .insert(schema.categories)
      .values([
        { name: "Appetizers" },
        { name: "Main Course" },
        { name: "Desserts" },
        { name: "Beverages" },
        { name: "Salad" },
      ]);

    const categoryIds = await db
      .select({ id: schema.categories.id })
      .from(schema.categories);

    if (!categoryIds.some((category) => category.id)) {
      return console.log("Category Ids not created ");
    }
    await db.insert(schema.items).values([
      {
        imageUrl: "/img/food.jpg",
        name: "Caesar Salad",
        description: "Fresh romaine lettuce with Caesar dressing and croutons",
        price: 8.99,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        preparationTime: 10,
        categoryId: categoryIds[0].id,
        isAvailable: true,
      },
      {
        imageUrl: "/img/food.jpg",
        name: "Margherita Pizza",
        description:
          "Thin-crust pizza with fresh basil, tomato sauce, and mozzarella cheese",
        price: 12.99,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        preparationTime: 20,
        categoryId: categoryIds[1]?.id,
        isAvailable: true,
      },
      {
        imageUrl: "/img/food.jpg",
        name: "Beef Burger",
        description:
          "Juicy beef patty with lettuce, tomato, and onion on a brioche bun",
        price: 10.99,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        preparationTime: 15,
        categoryId: categoryIds[2]?.id,
        isAvailable: true,
      },
      {
        name: "Pad Thai",
        imageUrl: "/img/food.jpg",
        description:
          "Stir-fried rice noodles with shrimp, eggs, and bean sprouts in a tangy tamarind sauce",
        price: 14.99,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isSpicy: true,
        preparationTime: 25,
        categoryId: categoryIds[2]?.id,
        isAvailable: true,
      },
      {
        imageUrl: "/img/food.jpg",
        name: "Vegetable Curry",
        description:
          "Assorted vegetables in a rich, creamy coconut curry sauce",
        price: 13.99,
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: true,
        isSpicy: true,
        preparationTime: 30,
        categoryId: categoryIds[3]?.id,
        isAvailable: true,
      },
      {
        imageUrl: "/img/food.jpg",
        name: "Grilled Salmon",
        description:
          "Fresh salmon fillet grilled to perfection, served with roasted potatoes and asparagus",
        price: 18.99,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isSpicy: false,
        preparationTime: 25,
        categoryId: categoryIds[3]?.id,
        isAvailable: true,
      },
      {
        imageUrl: "/img/food.jpg",
        name: "Falafel Wrap",
        description:
          "Crispy falafel balls wrapped in pita bread with lettuce, tomato, and tahini sauce",
        price: 9.99,
        isVegetarian: true,
        isVegan: true,
        isGlutenFree: false,
        isSpicy: false,
        preparationTime: 15,
        categoryId: categoryIds[4]?.id,
        isAvailable: true,
      },
      {
        imageUrl: "/img/food.jpg",
        name: "Beef Tacos",
        description:
          "Seasoned ground beef in soft tortillas topped with lettuce, cheese, and salsa",
        price: 11.99,
        isVegetarian: false,
        isVegan: false,
        isGlutenFree: true,
        isSpicy: true,
        preparationTime: 20,
        categoryId: categoryIds[4]?.id,
        isAvailable: true,
      },
      {
        imageUrl: "/img/food.jpg",
        name: "Mushroom Risotto",
        description:
          "Creamy Arborio rice with sautéed mushrooms and Parmesan cheese",
        price: 16.99,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: true,
        isSpicy: false,
        preparationTime: 35,
        categoryId: categoryIds[4]?.id,
        isAvailable: true,
      },
      {
        imageUrl: "/img/food.jpg",
        name: "Chocolate Lava Cake",
        description:
          "Warm, gooey chocolate cake with a molten center, served with vanilla ice cream",
        price: 7.99,
        isVegetarian: true,
        isVegan: false,
        isGlutenFree: false,
        isSpicy: false,
        preparationTime: 15,
        categoryId: categoryIds[4]?.id,
        isAvailable: true,
      },
    ]);

    await db.insert(schema.venueSettings).values({
      name: "Rest App",
      address: "123 London Main St",
      managerName: "Sergio",
      email: "admin@resto-app.com",
      website: "restro-app.com",
      phone: "555-1234",
      accessibilityInformation: "Accessible",
      amenities: "Pool",
      capacity: 100,
      description: "This is a default venue",
      updatedBy: user?.id,
    });
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    console.log("Database connection closed");
  }
}
