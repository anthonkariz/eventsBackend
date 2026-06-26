const { createSeedClient } = require('@snaplet/seed');

async function main() {
  const seed = await createSeedClient();

  // Truncate all tables to start fresh
  await seed.$resetDatabase();

  // Create 5 users, and automatically give each user 3 events!
  // Snaplet handles the fake names, emails, and user_id foreign keys automatically.
  await seed.users((x) => x(5, {
    events: (x) => x(3)
  }));

  console.log("Database seeded with factories successfully!");
}

main();