import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import bcrypt from "bcryptjs";
import * as schema from "../server/db/schemas";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) throw new Error("DATABASE_URL environment variable is not set");

const client = neon(DATABASE_URL);
const db = drizzle(client, { schema });

const hashPassword = (pass: string) => bcrypt.hash(pass, 10);

function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

function daysFromNow(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]!;
}

// ─── Clear all tables in reverse FK order ────────────────────────────────────
async function clearDatabase() {
  console.log("🗑️  Clearing existing data...");
  await db.delete(schema.cookedItems);
  await db.delete(schema.payments);
  await db.delete(schema.orderItems);
  await db.delete(schema.orders);
  await db.delete(schema.bills);
  await db.delete(schema.rotas);
  await db.delete(schema.notifications);
  await db.delete(schema.reservations);
  await db.delete(schema.tables);
  await db.delete(schema.profileInfo);
  await db.delete(schema.accounts);
  await db.delete(schema.sessions);
  await db.delete(schema.users);
  await db.delete(schema.items);
  await db.delete(schema.categories);
  await db.delete(schema.allergens);
  await db.delete(schema.ingredients);
  await db.delete(schema.nutritions);
  await db.delete(schema.storeCustomSchedule);
  await db.delete(schema.storeRegularSchedule);
  await db.delete(schema.storeSettings);
  await db.delete(schema.venueSettings);
  console.log("   ✓ Done\n");
}

async function main() {
  try {
    await clearDatabase();

    // ─── 1. Store Settings ──────────────────────────────────────────────────
    console.log("⚙️  Seeding store settings...");
    await db.insert(schema.storeSettings).values({
      profileName: "default",
      storeForceClose: false,
      reservationInterval: 30,
      reservationDuration: 90,
      reservationNotArrivalExpirationTime: 15,
      tableNumberLeadingZeros: false,
      leadingZerosQuantity: 1,
      serviceFee: 12.5,
    });

    // ─── 2. Weekly Schedule ─────────────────────────────────────────────────
    console.log("📅  Seeding weekly schedule...");
    await db.insert(schema.storeRegularSchedule).values([
      { number: 0, day: "sunday",    openTime: "11:00", closeTime: "21:00", isActive: true },
      { number: 1, day: "monday",    openTime: "12:00", closeTime: "22:00", isActive: true },
      { number: 2, day: "tuesday",   openTime: "12:00", closeTime: "22:00", isActive: true },
      { number: 3, day: "wednesday", openTime: "12:00", closeTime: "22:00", isActive: true },
      { number: 4, day: "thursday",  openTime: "12:00", closeTime: "22:30", isActive: true },
      { number: 5, day: "friday",    openTime: "11:00", closeTime: "23:30", isActive: true },
      { number: 6, day: "saturday",  openTime: "11:00", closeTime: "23:30", isActive: true },
    ]);

    // ─── 3. Custom Schedule (Holidays) ─────────────────────────────────────
    console.log("🗓️  Seeding custom schedule...");
    await db.insert(schema.storeCustomSchedule).values([
      { date: new Date("2026-01-01"), name: "New Year's Day",       openTime: "12:00", closeTime: "20:00", isActive: true },
      { date: new Date("2026-02-14"), name: "Valentine's Day",      openTime: "11:00", closeTime: "23:00", isActive: true },
      { date: new Date("2026-04-03"), name: "Good Friday",          openTime: "12:00", closeTime: "21:00", isActive: true },
      { date: new Date("2026-04-06"), name: "Easter Monday",        openTime: "12:00", closeTime: "21:00", isActive: true },
      { date: new Date("2026-05-04"), name: "May Bank Holiday",     openTime: "12:00", closeTime: "21:00", isActive: true },
      { date: new Date("2026-08-31"), name: "Summer Bank Holiday",  openTime: "11:00", closeTime: "23:00", isActive: true },
      { date: new Date("2026-12-24"), name: "Christmas Eve",        openTime: "12:00", closeTime: "22:00", isActive: true },
      { date: new Date("2026-12-25"), name: "Christmas Day",        isActive: false },
      { date: new Date("2026-12-26"), name: "Boxing Day",           openTime: "13:00", closeTime: "21:00", isActive: true },
      { date: new Date("2026-12-31"), name: "New Year's Eve",       openTime: "11:00", closeTime: "01:00", isActive: true },
    ]);

    // ─── 4. Users ───────────────────────────────────────────────────────────
    console.log("👥  Seeding users...");
    const [admin] = await db.insert(schema.users).values({
      name: "Admin",
      email: "arccik@gmail.com",
      password: await hashPassword("arccik@gmail.com"),
      role: "admin",
      employeeId: "EMP001",
    }).returning();

    const [manager] = await db.insert(schema.users).values({
      name: "Sophia Romano",
      email: "manager@bistro.com",
      password: await hashPassword("password123"),
      role: "manager",
      employeeId: "EMP002",
      shiftPreference: "morning",
    }).returning();

    const [waiter1] = await db.insert(schema.users).values({
      name: "James Mitchell",
      email: "james@bistro.com",
      password: await hashPassword("password123"),
      role: "waiter",
      employeeId: "EMP003",
      shiftPreference: "evening",
    }).returning();

    const [waiter2] = await db.insert(schema.users).values({
      name: "Emily Chen",
      email: "emily@bistro.com",
      password: await hashPassword("password123"),
      role: "waiter",
      employeeId: "EMP004",
      shiftPreference: "morning",
    }).returning();

    const [waiter3] = await db.insert(schema.users).values({
      name: "Marco Bianchi",
      email: "marco@bistro.com",
      password: await hashPassword("password123"),
      role: "waiter",
      employeeId: "EMP005",
      shiftPreference: "evening",
    }).returning();

    const [chef1] = await db.insert(schema.users).values({
      name: "Antonio Ferrari",
      email: "antonio@bistro.com",
      password: await hashPassword("password123"),
      role: "chef",
      employeeId: "EMP006",
      shiftPreference: "morning",
    }).returning();

    const [chef2] = await db.insert(schema.users).values({
      name: "Priya Sharma",
      email: "priya@bistro.com",
      password: await hashPassword("password123"),
      role: "chef",
      employeeId: "EMP007",
      shiftPreference: "evening",
    }).returning();

    if (!admin || !manager || !waiter1 || !waiter2 || !waiter3 || !chef1 || !chef2) {
      throw new Error("Failed to create users");
    }
    console.log("   ✓ 7 users created");

    // ─── 5. Profile Info ────────────────────────────────────────────────────
    console.log("📋  Seeding profile info...");
    await db.insert(schema.profileInfo).values([
      { userId: admin.id,   phone: "+44 7700 900001", address: "1 Admin Lane, London EC1A 1AA" },
      { userId: manager.id, phone: "+44 7700 900002", address: "12 Regent St, London W1B 5TR" },
      { userId: waiter1.id, phone: "+44 7700 900003", address: "45 Baker St, London W1U 7BZ" },
      { userId: waiter2.id, phone: "+44 7700 900004", address: "78 Oxford St, London W1D 1BS" },
      { userId: waiter3.id, phone: "+44 7700 900005", address: "22 Bond St, London W1S 4PH" },
      { userId: chef1.id,   phone: "+44 7700 900006", address: "9 Soho Square, London W1D 3QD" },
      { userId: chef2.id,   phone: "+44 7700 900007", address: "33 Carnaby St, London W1F 7DS" },
    ]);

    // ─── 6. Venue Settings ──────────────────────────────────────────────────
    console.log("🏠  Seeding venue settings...");
    await db.insert(schema.venueSettings).values({
      name: "La Bella Cucina",
      address: "42 Charlotte Street, London, W1T 2NX",
      phone: "+44 20 7946 0300",
      email: "info@labellacucina.co.uk",
      website: "www.labellacucina.co.uk",
      managerName: "Sophia Romano",
      description: "Authentic Italian-British fusion dining in the heart of Fitzrovia. Fresh ingredients, seasonal menus and an extensive wine cellar.",
      capacity: 120,
      amenities: "Private dining room, outdoor terrace, full bar, wine cellar, wheelchair accessible",
      accessibilityInformation: "Fully wheelchair accessible — step-free entrance and accessible toilets on ground floor.",
      acceptCash: true,
      acceptCredit: true,
      acceptMobilePayment: true,
      alloweManagerToEditMenu: true,
      allowedChashierToRefund: false,
      allowedServersToModifyOrder: true,
      serviceFee: 12,
      currency: "GBP",
      updatedBy: admin.id,
    });

    // ─── 7. Allergens (14 EU mandatory) ────────────────────────────────────
    console.log("⚠️  Seeding allergens...");
    await db.insert(schema.allergens).values([
      { name: "Celery" },
      { name: "Cereals containing gluten" },
      { name: "Crustaceans" },
      { name: "Eggs" },
      { name: "Fish" },
      { name: "Lupin" },
      { name: "Milk" },
      { name: "Molluscs" },
      { name: "Mustard" },
      { name: "Peanuts" },
      { name: "Sesame" },
      { name: "Soybeans" },
      { name: "Sulphur dioxide and sulphites" },
      { name: "Tree nuts" },
    ]);

    // ─── 8. Nutritions & Ingredients ───────────────────────────────────────
    console.log("🥦  Seeding nutritions & ingredients...");
    const nutritionData = [
      { calories: 364, carbohydrates: 72.0, proteins: 12.0, fat: 1.5 },   // 0 flour
      { calories: 155, carbohydrates: 1.1,  proteins: 13.0, fat: 11.0 },  // 1 eggs
      { calories: 61,  carbohydrates: 4.8,  proteins: 3.2,  fat: 3.3 },   // 2 milk
      { calories: 717, carbohydrates: 0.1,  proteins: 0.9,  fat: 81.0 },  // 3 butter
      { calories: 884, carbohydrates: 0.0,  proteins: 0.0,  fat: 100.0 }, // 4 olive oil
      { calories: 40,  carbohydrates: 9.3,  proteins: 1.1,  fat: 0.1 },   // 5 onion
      { calories: 149, carbohydrates: 33.1, proteins: 6.4,  fat: 0.5 },   // 6 garlic
      { calories: 18,  carbohydrates: 3.9,  proteins: 0.9,  fat: 0.2 },   // 7 tomatoes
      { calories: 280, carbohydrates: 3.1,  proteins: 28.0, fat: 17.0 },  // 8 mozzarella
      { calories: 431, carbohydrates: 4.1,  proteins: 38.0, fat: 29.0 },  // 9 parmesan
      { calories: 239, carbohydrates: 0.0,  proteins: 27.0, fat: 14.0 },  // 10 chicken
      { calories: 271, carbohydrates: 0.0,  proteins: 26.0, fat: 18.0 },  // 11 beef
      { calories: 208, carbohydrates: 0.0,  proteins: 20.0, fat: 13.0 },  // 12 salmon
      { calories: 85,  carbohydrates: 1.0,  proteins: 18.0, fat: 1.0 },   // 13 prawns
      { calories: 371, carbohydrates: 74.5, proteins: 13.0, fat: 1.1 },   // 14 pasta
      { calories: 360, carbohydrates: 79.0, proteins: 7.1,  fat: 0.7 },   // 15 rice
      { calories: 77,  carbohydrates: 17.0, proteins: 2.0,  fat: 0.1 },   // 16 potato
      { calories: 89,  carbohydrates: 23.0, proteins: 1.1,  fat: 0.3 },   // 17 banana (stock item)
    ];

    const ingredientNames = [
      "Plain Flour", "Free-Range Eggs", "Whole Milk", "Unsalted Butter",
      "Extra Virgin Olive Oil", "White Onion", "Garlic Cloves", "Plum Tomatoes",
      "Buffalo Mozzarella", "Parmigiano Reggiano", "Free-Range Chicken Breast",
      "Prime British Beef", "Atlantic Salmon Fillet", "Tiger Prawns",
      "Durum Wheat Pasta", "Arborio Rice", "Maris Piper Potatoes", "Fresh Basil",
    ];

    const nutritionIds: string[] = [];
    for (const n of nutritionData) {
      const [row] = await db.insert(schema.nutritions).values(n).returning();
      if (row) nutritionIds.push(row.id);
    }

    for (let i = 0; i < ingredientNames.length; i++) {
      await db.insert(schema.ingredients).values({
        name: ingredientNames[i]!,
        stock: Math.floor(Math.random() * 50) + 20,
        isActive: true,
        nutritionId: i < nutritionIds.length ? nutritionIds[i]! : undefined,
      });
    }
    console.log(`   ✓ ${ingredientNames.length} ingredients`);

    // ─── 9. Tables ──────────────────────────────────────────────────────────
    console.log("🪑  Seeding tables...");
    await db.insert(schema.tables).values([
      { number: 1,  seats: 2,  status: "available", description: "Window seat — romantic, street view" },
      { number: 2,  seats: 2,  status: "available", description: "Window seat — bright, south-facing" },
      { number: 3,  seats: 2,  status: "available" },
      { number: 4,  seats: 2,  status: "available" },
      { number: 5,  seats: 4,  status: "available", description: "Booth seating — cosy corner" },
      { number: 6,  seats: 4,  status: "available", description: "Booth seating" },
      { number: 7,  seats: 4,  status: "available" },
      { number: 8,  seats: 4,  status: "available" },
      { number: 9,  seats: 4,  status: "available" },
      { number: 10, seats: 4,  status: "available" },
      { number: 11, seats: 6,  status: "available", description: "Round table — terrace area" },
      { number: 12, seats: 6,  status: "available" },
      { number: 13, seats: 6,  status: "available" },
      { number: 14, seats: 6,  status: "available", description: "Near bar area" },
      { number: 15, seats: 8,  status: "available", description: "Semi-private — group dining" },
      { number: 16, seats: 8,  status: "available", description: "Semi-private — group dining" },
      { number: 17, seats: 10, status: "available", description: "Private dining room — min. £500 spend" },
      { number: 18, seats: 12, status: "available", description: "Banquet table — events & celebrations" },
    ]);

    const insertedTables = await db
      .select({ id: schema.tables.id, number: schema.tables.number })
      .from(schema.tables);
    console.log(`   ✓ ${insertedTables.length} tables`);

    // ─── 10. Categories ─────────────────────────────────────────────────────
    console.log("📂  Seeding categories...");
    const categoryNames = [
      "Starters",
      "Mains",
      "Pasta & Risotto",
      "Pizza",
      "Salads",
      "Desserts",
      "Soft Drinks",
      "Hot Drinks",
    ];

    const catIds: Record<string, string> = {};
    for (const name of categoryNames) {
      const [cat] = await db.insert(schema.categories).values({ name }).returning();
      if (cat) catIds[name] = cat.id;
    }

    // ─── 11. Menu Items ─────────────────────────────────────────────────────
    console.log("🍕  Seeding menu items...");

    const starters = catIds["Starters"]!;
    const mains    = catIds["Mains"]!;
    const pasta    = catIds["Pasta & Risotto"]!;
    const pizza    = catIds["Pizza"]!;
    const salads   = catIds["Salads"]!;
    const desserts = catIds["Desserts"]!;
    const drinks   = catIds["Soft Drinks"]!;
    const hot      = catIds["Hot Drinks"]!;

    const menuItems = [
      // ── Starters ──
      {
        name: "Bruschetta al Pomodoro",
        description: "Toasted sourdough with ripe plum tomatoes, fresh basil, garlic and extra virgin olive oil",
        price: 6.50, isVegetarian: true, isVegan: true, isGlutenFree: false, isSpicy: false,
        preparationTime: 8, categoryId: starters, isAvailable: true,
      },
      {
        name: "Arancini di Riso",
        description: "Crispy Sicilian rice balls filled with mozzarella and ragù, served with marinara dipping sauce",
        price: 7.50, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 12, categoryId: starters, isAvailable: true,
      },
      {
        name: "Calamari Fritti",
        description: "Lightly battered squid rings with lemon aioli and chilli flakes",
        price: 9.50, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 10, categoryId: starters, isAvailable: true,
      },
      {
        name: "Soup of the Day",
        description: "Chef's seasonal soup served with warm focaccia bread and butter",
        price: 6.00, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 5, categoryId: starters, isAvailable: true,
      },
      {
        name: "Burrata e Prosciutto",
        description: "Creamy burrata with San Daniele prosciutto, cherry tomatoes, rocket and aged balsamic",
        price: 12.50, isVegetarian: false, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 5, categoryId: starters, isAvailable: true,
      },
      {
        name: "Stuffed Portobello Mushrooms",
        description: "Portobello mushrooms filled with spinach, ricotta and pine nuts, baked with Parmesan crust",
        price: 8.00, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 15, categoryId: starters, isAvailable: true,
      },
      {
        name: "Prawn Cocktail",
        description: "Classic British prawn cocktail with Marie Rose sauce, iceberg lettuce and brown bread",
        price: 9.00, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 8, categoryId: starters, isAvailable: true,
      },
      {
        name: "Chicken Satay Skewers",
        description: "Marinated chicken skewers with peanut satay sauce, cucumber salad and lime",
        price: 8.50, isVegetarian: false, isVegan: false, isGlutenFree: true, isSpicy: true,
        preparationTime: 15, categoryId: starters, isAvailable: true,
      },

      // ── Mains ──
      {
        name: "Grilled Atlantic Salmon",
        description: "Fresh Scottish salmon fillet grilled with lemon butter, served with roasted new potatoes and seasonal vegetables",
        price: 19.99, isVegetarian: false, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 20, categoryId: mains, isAvailable: true,
      },
      {
        name: "28-Day Aged Ribeye Steak",
        description: "250g dry-aged British ribeye with triple-cooked chips, roasted tomato and peppercorn sauce",
        price: 29.99, isVegetarian: false, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 25, categoryId: mains, isAvailable: true,
      },
      {
        name: "Chicken Parmigiana",
        description: "Breaded free-range chicken breast with tomato sauce, mozzarella and Parmesan, served with spaghetti",
        price: 17.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 22, categoryId: mains, isAvailable: true,
      },
      {
        name: "Beer-Battered Fish & Chips",
        description: "Cornish cod in crispy beer batter with chunky chips, mushy peas, tartar sauce and a wedge of lemon",
        price: 15.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 18, categoryId: mains, isAvailable: true,
      },
      {
        name: "Roasted Vegetable Wellington",
        description: "Golden puff pastry filled with roasted Mediterranean vegetables and cashew nut roast, with seasonal greens",
        price: 15.99, isVegetarian: true, isVegan: true, isGlutenFree: false, isSpicy: false,
        preparationTime: 30, categoryId: mains, isAvailable: true,
      },
      {
        name: "Slow-Braised Lamb Shank",
        description: "12-hour braised British lamb shank in red wine jus, with creamy mash and roasted root vegetables",
        price: 24.99, isVegetarian: false, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 35, categoryId: mains, isAvailable: true,
      },
      {
        name: "Pan-Seared Sea Bass",
        description: "Line-caught sea bass fillet with lemon caper butter, samphire and saffron potatoes",
        price: 21.99, isVegetarian: false, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 20, categoryId: mains, isAvailable: true,
      },
      {
        name: "Chicken Tikka Masala",
        description: "Tender chicken in a rich tomato and cream curry sauce, served with basmati rice and naan bread",
        price: 16.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: true,
        preparationTime: 20, categoryId: mains, isAvailable: true,
      },

      // ── Pasta & Risotto ──
      {
        name: "Spaghetti Carbonara",
        description: "Classic Roman carbonara with guanciale, Pecorino Romano, egg yolk and cracked black pepper — no cream",
        price: 13.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 15, categoryId: pasta, isAvailable: true,
      },
      {
        name: "Penne all'Arrabbiata",
        description: "Penne in a fiery tomato sauce with garlic, chilli and fresh basil — vegan",
        price: 11.99, isVegetarian: true, isVegan: true, isGlutenFree: false, isSpicy: true,
        preparationTime: 12, categoryId: pasta, isAvailable: true,
      },
      {
        name: "Fettuccine Alfredo al Tartufo",
        description: "Egg fettuccine in a rich Parmesan and butter cream sauce, finished with shaved black truffle",
        price: 15.99, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 12, categoryId: pasta, isAvailable: true,
      },
      {
        name: "Wild Mushroom Risotto",
        description: "Creamy Arborio risotto with porcini and mixed wild mushrooms, truffle oil and aged Parmesan — gluten-free",
        price: 14.99, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 25, categoryId: pasta, isAvailable: true,
      },
      {
        name: "Seafood Linguine",
        description: "Linguine with tiger prawns, clams, mussels and squid in a white wine, garlic and cherry tomato sauce",
        price: 18.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 20, categoryId: pasta, isAvailable: true,
      },
      {
        name: "Lasagne al Forno",
        description: "Homemade egg pasta layered with slow-cooked beef ragù and béchamel, baked with a golden Parmesan crust",
        price: 14.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 20, categoryId: pasta, isAvailable: true,
      },

      // ── Pizza (12-inch stone-baked) ──
      {
        name: "Margherita",
        description: "San Marzano tomato, fior di latte mozzarella, fresh basil and extra virgin olive oil",
        price: 11.99, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 15, categoryId: pizza, isAvailable: true,
      },
      {
        name: "Pepperoni",
        description: "Tomato, mozzarella and generous layers of American pepperoni, finished with chilli flakes",
        price: 13.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 15, categoryId: pizza, isAvailable: true,
      },
      {
        name: "Quattro Formaggi",
        description: "White base with mozzarella, gorgonzola, Taleggio and Parmigiano Reggiano",
        price: 13.99, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 15, categoryId: pizza, isAvailable: true,
      },
      {
        name: "Prosciutto e Rucola",
        description: "Tomato, mozzarella, San Daniele prosciutto, wild rocket and shaved Parmesan",
        price: 15.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 15, categoryId: pizza, isAvailable: true,
      },
      {
        name: "Diavola",
        description: "Tomato, mozzarella, spicy Calabrian 'nduja sausage, smoked scamorza and jalapeños",
        price: 14.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: true,
        preparationTime: 15, categoryId: pizza, isAvailable: true,
      },
      {
        name: "Pizza Vegana",
        description: "Tomato base with roasted peppers, courgette, aubergine, olives, sun-dried tomatoes and vegan mozzarella",
        price: 13.99, isVegetarian: true, isVegan: true, isGlutenFree: false, isSpicy: false,
        preparationTime: 15, categoryId: pizza, isAvailable: true,
      },

      // ── Salads ──
      {
        name: "Classic Caesar Salad",
        description: "Cos lettuce, anchovies, house Caesar dressing, Parmesan shavings and croutons (add grilled chicken £3)",
        price: 10.99, isVegetarian: false, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 8, categoryId: salads, isAvailable: true,
      },
      {
        name: "Greek Salad",
        description: "Tomatoes, cucumber, Kalamata olives, red onion and barrel-aged feta with oregano vinaigrette — GF",
        price: 9.99, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 8, categoryId: salads, isAvailable: true,
      },
      {
        name: "Salade Niçoise",
        description: "Seared tuna, French beans, boiled eggs, olives, anchovy and baby potatoes in Dijon dressing",
        price: 12.99, isVegetarian: false, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 12, categoryId: salads, isAvailable: true,
      },
      {
        name: "Rocket & Parmesan",
        description: "Wild rocket, shaved Parmigiano Reggiano, cherry tomatoes and toasted pine nuts with lemon dressing",
        price: 8.50, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 5, categoryId: salads, isAvailable: true,
      },
      {
        name: "Superfood Salad",
        description: "Kale, quinoa, avocado, roasted chickpeas, pomegranate seeds and tahini lemon dressing — vegan, GF",
        price: 10.50, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 8, categoryId: salads, isAvailable: true,
      },

      // ── Desserts ──
      {
        name: "Tiramisù",
        description: "Classic Italian tiramisù with mascarpone, Savoiardi biscuits, espresso and Marsala wine",
        price: 7.50, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 5, categoryId: desserts, isAvailable: true,
      },
      {
        name: "Chocolate Fondant",
        description: "Warm dark chocolate fondant with a molten centre, served with Madagascan vanilla gelato",
        price: 8.50, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 12, categoryId: desserts, isAvailable: true,
      },
      {
        name: "Vanilla Panna Cotta",
        description: "Silky vanilla panna cotta with fresh strawberry coulis and crushed Amaretti crumbs — GF",
        price: 7.00, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 3, categoryId: desserts, isAvailable: true,
      },
      {
        name: "Gelato (3 Scoops)",
        description: "Three scoops from our daily selection: pistachio, stracciatella, lemon, coffee, strawberry or chocolate",
        price: 6.50, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 3, categoryId: desserts, isAvailable: true,
      },
      {
        name: "Apple & Blackberry Crumble",
        description: "Warm British apple and blackberry crumble with Demerara topping, served with custard or vanilla ice cream",
        price: 7.50, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 15, categoryId: desserts, isAvailable: true,
      },
      {
        name: "New York Cheesecake",
        description: "Baked vanilla cheesecake on a digestive biscuit base with seasonal berry compote",
        price: 7.50, isVegetarian: true, isVegan: false, isGlutenFree: false, isSpicy: false,
        preparationTime: 3, categoryId: desserts, isAvailable: true,
      },

      // ── Soft Drinks ──
      {
        name: "Coca-Cola",
        description: "330ml classic Coca-Cola served over ice",
        price: 3.50, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 1, categoryId: drinks, isAvailable: true,
      },
      {
        name: "Sicilian Lemonade",
        description: "House-made sparkling lemonade with fresh Sicilian lemons and mint, served over ice",
        price: 4.00, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 3, categoryId: drinks, isAvailable: true,
      },
      {
        name: "San Pellegrino Sparkling",
        description: "750ml bottle of San Pellegrino sparkling mineral water",
        price: 3.50, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 1, categoryId: drinks, isAvailable: true,
      },
      {
        name: "Still Mineral Water",
        description: "750ml still mineral water",
        price: 2.50, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 1, categoryId: drinks, isAvailable: true,
      },
      {
        name: "Fresh Orange Juice",
        description: "Freshly squeezed orange juice, served chilled",
        price: 4.25, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 3, categoryId: drinks, isAvailable: true,
      },
      {
        name: "Elderflower Pressé",
        description: "Fever-Tree elderflower pressé with cucumber and mint — light and refreshing",
        price: 4.00, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 2, categoryId: drinks, isAvailable: true,
      },

      // ── Hot Drinks ──
      {
        name: "Espresso",
        description: "Double shot of our house-blend Italian espresso",
        price: 2.75, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 2, categoryId: hot, isAvailable: true,
      },
      {
        name: "Cappuccino",
        description: "Double espresso with steamed milk and a thick layer of velvety foam",
        price: 3.75, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 3, categoryId: hot, isAvailable: true,
      },
      {
        name: "Flat White",
        description: "Double ristretto with microfoam steamed milk — silky and strong",
        price: 3.75, isVegetarian: true, isVegan: false, isGlutenFree: true, isSpicy: false,
        preparationTime: 3, categoryId: hot, isAvailable: true,
      },
      {
        name: "Americano",
        description: "Double espresso with hot water, served with milk on the side",
        price: 3.25, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 2, categoryId: hot, isAvailable: true,
      },
      {
        name: "English Breakfast Tea",
        description: "Twinings English Breakfast served in a pot with milk and sugar",
        price: 3.00, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 3, categoryId: hot, isAvailable: true,
      },
      {
        name: "Green Tea",
        description: "Japanese Sencha green tea — naturally rich in antioxidants",
        price: 3.00, isVegetarian: true, isVegan: true, isGlutenFree: true, isSpicy: false,
        preparationTime: 3, categoryId: hot, isAvailable: true,
      },
    ];

    await db.insert(schema.items).values(menuItems);
    const insertedItems = await db
      .select({ id: schema.items.id, price: schema.items.price })
      .from(schema.items);
    console.log(`   ✓ ${menuItems.length} menu items`);

    // ─── 12. Upcoming Reservations ──────────────────────────────────────────
    console.log("📞  Seeding reservations...");
    const tableIds = insertedTables.map(t => t.id);

    const upcomingReservations = [
      { daysAhead: 1, hour: 18, tableIdx: 0,  name: "Oliver Harrison",           guests: 2, phone: "+44 7911 123456", email: "oliver.h@email.com" },
      { daysAhead: 1, hour: 19, tableIdx: 4,  name: "Sophie Williams",           guests: 4, phone: "+44 7900 234567", requests: "One guest has a nut allergy" },
      { daysAhead: 2, hour: 20, tableIdx: 7,  name: "The Johnson Family",        guests: 5, phone: "+44 7799 345678", email: "johnson@family.com" },
      { daysAhead: 2, hour: 13, tableIdx: 0,  name: "Birthday Party — A. Smith", guests: 2, phone: "+44 7611 456789", requests: "Birthday cake on arrival please" },
      { daysAhead: 3, hour: 19, tableIdx: 10, name: "Corporate Dinner — Acme Ltd", guests: 6, email: "events@acme.com", requests: "Private area preferred, dietary requirements to follow" },
      { daysAhead: 4, hour: 12, tableIdx: 2,  name: "Emma Thompson",             guests: 2, phone: "+44 7500 567890" },
      { daysAhead: 5, hour: 20, tableIdx: 14, name: "Wedding Anniversary",       guests: 8, phone: "+44 7400 678901", requests: "Champagne on arrival please — surprise for Mrs. Davies" },
      { daysAhead: 6, hour: 19, tableIdx: 5,  name: "Liam & Sarah Cooper",       guests: 4, phone: "+44 7300 789012", email: "liam@cooper.co.uk" },
      { daysAhead: 7, hour: 18, tableIdx: 1,  name: "Aisha Khan",                guests: 2, email: "aisha@khan.com", requests: "Vegetarian menu required, no peanuts" },
      { daysAhead: 7, hour: 21, tableIdx: 11, name: "Book Club Dinner",          guests: 6, phone: "+44 7200 890123" },
    ];

    for (const r of upcomingReservations) {
      const scheduled = daysFromNow(r.daysAhead);
      scheduled.setHours(r.hour, 0, 0, 0);
      const expire = new Date(scheduled);
      expire.setMinutes(expire.getMinutes() + 90);

      await db.insert(schema.reservations).values({
        tableId: tableIds[r.tableIdx] ?? null,
        customerName: r.name,
        customerPhoneNumber: r.phone ?? null,
        customerEmail: r.email ?? null,
        guestsPredictedNumber: r.guests,
        specialRequests: r.requests ?? null,
        userId: waiter1.id,
        status: "Scheduled",
        scheduledAt: scheduled.toISOString(),
        expireAt: expire.toISOString(),
      });
    }
    console.log(`   ✓ ${upcomingReservations.length} reservations`);

    // ─── 13. Staff Rotas ────────────────────────────────────────────────────
    console.log("📋  Seeding staff rotas...");
    const staffMembers = [waiter1, waiter2, waiter3, chef1, chef2, manager];
    const shiftOptions = ["morning", "evening"] as const;
    let rotaCount = 0;

    for (let dayOffset = -7; dayOffset <= 14; dayOffset++) {
      const rotaDate = new Date();
      rotaDate.setDate(rotaDate.getDate() + dayOffset);
      rotaDate.setHours(0, 0, 0, 0);

      for (const member of staffMembers) {
        await db.insert(schema.rotas).values({
          userId: member.id,
          date: rotaDate,
          shift: pickRandom(shiftOptions),
          working: dayOffset <= 0,
          name: `${member.name.split(" ")[0]!} — ${rotaDate.toDateString()}`,
        });
        rotaCount++;
      }
    }
    console.log(`   ✓ ${rotaCount} rota entries`);

    // ─── 14. Notifications ──────────────────────────────────────────────────
    console.log("🔔  Seeding notifications...");
    await db.insert(schema.notifications).values([
      {
        userId: admin.id, type: "info", isRead: true,
        title: "Welcome to La Bella Cucina POS",
        message: "Your restaurant management system is configured and ready. Explore the dashboard to get started.",
      },
      {
        userId: admin.id, type: "info", isRead: false,
        title: "Database Seeded Successfully",
        message: "Sample data has been loaded: menu items, staff profiles and 60 days of historical orders.",
      },
      {
        userId: admin.id, type: "warning", isRead: false,
        title: "Low Stock Alert — Arborio Rice",
        message: "Arborio Rice is running low (18 units remaining). Please arrange a restock before the weekend.",
      },
      {
        userId: manager.id, type: "info", isRead: false,
        title: "10 Upcoming Reservations",
        message: "You have 10 reservations booked for the next 7 days. Check the reservations page for full details.",
      },
      {
        userId: manager.id, type: "info", isRead: true,
        title: "Monthly Revenue on Track",
        message: "Revenue is tracking above last month's figures. Full breakdown available in the analytics dashboard.",
      },
      {
        userId: chef1.id, type: "info", isRead: true,
        title: "New Menu Items Added",
        message: "The summer specials have been added to the system. Please review prep times and allergen info.",
      },
      {
        userId: waiter1.id, type: "warning", isRead: false,
        title: "Table 3 — Guest Waiting",
        message: "Table 3 has been waiting over 15 minutes. Please check in with the guests.",
      },
    ]);

    // ─── 15. Historical Orders, Bills & Payments ────────────────────────────
    console.log("📊  Seeding historical orders (60 days)...");
    const waiters = [waiter1, waiter2, waiter3];
    const paymentMethods = ["Card", "Cash"] as const;
    let orderCount = 0;

    for (let daysBack = 60; daysBack >= 1; daysBack--) {
      const date = daysAgo(daysBack);
      const dayOfWeek = date.getDay();
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
      // More orders on weekends (3-5) vs weekdays (1-3)
      const ordersForDay = isWeekend
        ? Math.floor(Math.random() * 3) + 3
        : Math.floor(Math.random() * 3) + 1;

      for (let o = 0; o < ordersForDay; o++) {
        const orderDate = new Date(date);
        orderDate.setHours(
          12 + Math.floor(Math.random() * 9),
          Math.floor(Math.random() * 60),
          0, 0,
        );

        const waiter  = pickRandom(waiters);
        const tableId = pickRandom(tableIds.slice(0, 14)); // use tables 1-14

        // Pick 2-4 random items
        const numItems = Math.floor(Math.random() * 3) + 2;
        const shuffled = [...insertedItems].sort(() => 0.5 - Math.random());
        const selectedItems = shuffled.slice(0, numItems);

        // Calculate total
        let subtotal = 0;
        for (const item of selectedItems) {
          const qty = Math.random() > 0.75 ? 2 : 1;
          subtotal += (item.price ?? 12) * qty;
        }
        subtotal = Math.round(subtotal * 100) / 100;

        const tip = Math.random() > 0.55
          ? Math.round(subtotal * (Math.random() * 0.15 + 0.05) * 100) / 100
          : 0;
        const total = Math.round((subtotal + tip) * 100) / 100;

        // Insert bill first
        const [bill] = await db.insert(schema.bills).values({
          totalAmount: total,
          serviceFee: Math.round(subtotal * 0.125 * 100) / 100,
          paid: true,
          tipAmount: tip > 0 ? tip : null,
          userId: waiter.id,
          createdAt: orderDate,
        }).returning();

        if (!bill) continue;

        // Insert order
        const [order] = await db.insert(schema.orders).values({
          userId: waiter.id,
          selectedBy: waiter.id,
          tableId: tableId,
          isPaid: true,
          status: "Completed",
          billId: bill.id,
          createdAt: orderDate,
        }).returning();

        if (!order) continue;

        // Insert order items
        for (const item of selectedItems) {
          const qty = Math.random() > 0.75 ? 2 : 1;
          await db.insert(schema.orderItems).values({
            orderId: order.id,
            itemId: item.id,
            quantity: qty,
            createdAt: orderDate,
          });
        }

        // Insert payment
        await db.insert(schema.payments).values({
          billId: bill.id,
          paymentMethod: pickRandom(paymentMethods),
          chargedAmount: total,
          tipAmount: tip > 0 ? tip : null,
          userId: waiter.id,
          orderId: order.id,
          createdAt: orderDate,
        });

        orderCount++;
      }
    }
    console.log(`   ✓ ${orderCount} historical orders with bills and payments`);

    // ─── Done ───────────────────────────────────────────────────────────────
    console.log("\n🎉  Seeding complete!\n");
    console.log("  Summary:");
    console.log(`  • 7 staff members (admin, manager, 3 waiters, 2 chefs)`);
    console.log(`  • 18 tables (2–12 seats)`);
    console.log(`  • ${categoryNames.length} menu categories`);
    console.log(`  • ${menuItems.length} menu items`);
    console.log(`  • 14 EU allergens`);
    console.log(`  • ${ingredientNames.length} ingredients with nutrition data`);
    console.log(`  • ${upcomingReservations.length} upcoming reservations`);
    console.log(`  • ${rotaCount} staff rota entries`);
    console.log(`  • 7 notifications`);
    console.log(`  • ${orderCount} historical orders with payments`);
    console.log("\n  Login: arccik@gmail.com / arccik@gmail.com\n");

  } catch (error) {
    console.error("\n❌  Seeding failed:", error);
    process.exit(1);
  }
}

await main();
