import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";

// import { neon } from "@neondatabase/serverless";
// import type { NeonQueryFunction } from "@neondatabase/serverless";
import * as schema from "./schemas";
import { createClient, type Client } from "@libsql/client";
// import {
//   storeRegularSchedule,
//   storeCustomSchedule,
//   storeSettings,
//   categories,
//   items,
//   ingredients,
//   nutritions,
//   venueSettings
// } from "./schemas";

// https://github.com/neondatabase/serverless/issues/66

const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ?? createClient({ url: process.env.DATABASE_URL! });
if (process.env.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });

async function seed() {
  console.log("Seeding...");

  const today = new Date();

  await db.insert(schema.storeSettings).values({
    profileName: "default",
    storeForceClose: false,
    reservationInterval: 30,
    reservationDuration: 60,
    reservationNotArrivalExpirationTime: 15,
    tableNumberLeadingZeros: false,
    leadingZerosQuantity: 2,
  });
  await db.insert(schema.users).values({
    name: "Store Manger",
    password: "password",
    role: "admin",
    email: "store@example.com",
  });

  await db.insert(schema.storeRegularSchedule).values([
    { day: "sunday", number: 0, openTime: "10:00:00", closeTime: "16:00:00" },
    { day: "monday", number: 1, openTime: "09:00:00", closeTime: "17:00:00" },
    { day: "tuesday", number: 2, openTime: "09:00:00", closeTime: "17:00:00" },
    {
      day: "wednesday",
      number: 3,
      openTime: "09:00:00",
      closeTime: "17:00:00",
    },
    { day: "thursday", number: 4, openTime: "09:00:00", closeTime: "17:00:00" },
    { day: "friday", number: 5, openTime: "09:00:00", closeTime: "17:00:00" },
    { day: "saturday", number: 6, openTime: "10:00:00", closeTime: "16:00:00" },
  ]);

  await db.insert(schema.storeCustomSchedule).values([
    {
      date: today,
      name: "New Year's Day",
      openTime: "11:00:00",
      closeTime: "16:00:00",
    },
    {
      date: today,
      name: "Valentine's Day",
      openTime: "11:00:00",
      closeTime: "16:00:00",
    },
    {
      date: today,
      name: "St. Patrick's Day",
      openTime: "11:00:00",
      closeTime: "16:00:00",
    },
    {
      date: today,
      name: "April Fools' Day",
      openTime: "11:00:00",
      closeTime: "16:00:00",
    },
    {
      date: today,
      name: "Cinco de Mayo",
      openTime: "11:00:00",
      closeTime: "16:00:00",
    },
    {
      date: today,
      name: "Independence Day (USA)",
      openTime: "11:00:00",
      closeTime: "16:00:00",
    },
    {
      date: today,
      name: "Halloween",
      openTime: "11:00:00",
      closeTime: "16:00:00",
    },
    {
      date: today,
      name: "Veterans Day",
      openTime: "11:00:00",
      closeTime: "16:00:00",
    },
    {
      date: today,
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

  await db.insert(schema.items).values([
    {
      imageUrl: "/img/food.png",
      name: "Caesar Salad",
      description: "Fresh romaine lettuce with Caesar dressing and croutons",
      price: 8.99,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isAvailable: true,
      isSpicy: false,
      preparationTime: 10,
      categoryId: 1,
    },
    {
      imageUrl: "/img/food.png",
      name: "Margherita Pizza",
      description:
        "Thin-crust pizza with fresh basil, tomato sauce, and mozzarella cheese",
      price: 12.99,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 20,
      categoryId: 2,
      isAvailable: true,
    },
    {
      imageUrl: "/img/food.png",
      name: "Beef Burger",
      description:
        "Juicy beef patty with lettuce, tomato, and onion on a brioche bun",
      price: 10.99,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 15,
      categoryId: 2,
      isAvailable: true,
    },
    {
      name: "Pad Thai",
      imageUrl: "/img/food.png",
      description:
        "Stir-fried rice noodles with shrimp, eggs, and bean sprouts in a tangy tamarind sauce",
      price: 14.99,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: true,
      preparationTime: 25,
      categoryId: 3,
      isAvailable: true,
    },
    {
      imageUrl: "/img/food.png",
      name: "Vegetable Curry",
      description: "Assorted vegetables in a rich, creamy coconut curry sauce",
      price: 13.99,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: true,
      isSpicy: true,
      preparationTime: 30,
      categoryId: 3,
      isAvailable: true,
    },
    {
      imageUrl: "/img/food.png",
      name: "Grilled Salmon",
      description:
        "Fresh salmon fillet grilled to perfection, served with roasted potatoes and asparagus",
      price: 18.99,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 25,
      categoryId: 4,
      isAvailable: true,
    },
    {
      imageUrl: "/img/food.png",
      name: "Falafel Wrap",
      description:
        "Crispy falafel balls wrapped in pita bread with lettuce, tomato, and tahini sauce",
      price: 9.99,
      isVegetarian: true,
      isVegan: true,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 15,
      categoryId: 5,
      isAvailable: true,
    },
    {
      imageUrl: "/img/food.png",
      name: "Beef Tacos",
      description:
        "Seasoned ground beef in soft tortillas topped with lettuce, cheese, and salsa",
      price: 11.99,
      isVegetarian: false,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: true,
      preparationTime: 20,
      categoryId: 5,
      isAvailable: true,
    },
    {
      imageUrl: "/img/food.png",
      name: "Mushroom Risotto",
      description:
        "Creamy Arborio rice with sautéed mushrooms and Parmesan cheese",
      price: 16.99,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: true,
      isSpicy: false,
      preparationTime: 35,
      categoryId: 4,
      isAvailable: true,
    },
    {
      imageUrl: "/img/food.png",
      name: "Chocolate Lava Cake",
      description:
        "Warm, gooey chocolate cake with a molten center, served with vanilla ice cream",
      price: 7.99,
      isVegetarian: true,
      isVegan: false,
      isGlutenFree: false,
      isSpicy: false,
      preparationTime: 15,
      categoryId: 4,
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
  });
}
const ingredientsWithNutritions = async () => {
  const onionNutrition = await db
    .insert(schema.nutritions)
    .values({ calories: 60, carbohydrates: 0, proteins: 1, fat: 0 })
    .returning({ id: schema.nutritions.id });
  await db
    .insert(schema.ingredients)
    .values({ name: "Onion", stock: 10, nutritionId: onionNutrition[0]?.id });

  const pastaNutricion = await db
    .insert(schema.nutritions)
    .values({
      calories: 208,
      carbohydrates: 32.1,
      proteins: 6.7,
      fat: 7.7,
    })
    .returning({ id: schema.nutritions.id });
  await db.insert(schema.ingredients).values({
    name: "Pasta Casserole",
    stock: 2,
    nutritionId: pastaNutricion[0]?.id,
  });

  const cheddarNutricion = await db
    .insert(schema.nutritions)
    .values({
      calories: 408.2,
      carbohydrates: 2.4,
      proteins: 23,
      fat: 34,
    })
    .returning({ id: schema.nutritions.id });
  await db.insert(schema.ingredients).values({
    name: "cheddar",
    stock: 10,
    nutritionId: cheddarNutricion[0]?.id,
  });
  console.log("Done!");
};
// ingredientsWithNutritions()
seed();
