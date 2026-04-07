require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Shelter = require('./models/Shelter');
const Pet = require('./models/Pet');
const Application = require('./models/Application');
const Watchlist = require('./models/Watchlist');
const SuccessStory = require('./models/SuccessStory');

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Clear collections
    await User.deleteMany({});
    await Shelter.deleteMany({});
    await Pet.deleteMany({});
    await Application.deleteMany({});
    await Watchlist.deleteMany({});
    await SuccessStory.deleteMany({});

    // 2. Create users
    const salt = await bcrypt.genSalt(10);
    const adminPassword = await bcrypt.hash('admin123', salt);
    const testPassword = await bcrypt.hash('test123', salt);

    const users = await User.insertMany([
      { name: "Happy Paws Shelter", email: "admin@happypaws.com", passwordHash: adminPassword, role: "shelter-admin" },
      { name: "Second Chance Shelter", email: "admin@secondchance.com", passwordHash: adminPassword, role: "shelter-admin" },
      { name: "Test User", email: "test@test.com", passwordHash: testPassword, role: "adopter" }
    ]);

    const admin1 = users[0];
    const admin2 = users[1];

    // 4. Create shelters
    const shelters = await Shelter.insertMany([
      { name: "Happy Paws Shelter", address: "123 Happy St", city: "New York", phone: "555-0101", operatingHours: "Mon-Sat 9AM-6PM", adminId: admin1._id },
      { name: "Second Chance Shelter", address: "456 Chance Ave", city: "Los Angeles", phone: "555-0202", operatingHours: "Mon-Sat 9AM-6PM", adminId: admin2._id }
    ]);

    // 5. Create 15 pets
    const allTraits = ["Playful", "Calm", "Energetic", "Good with kids", "Good with other pets", "House-trained", "Apartment-friendly", "Loves walks", "Independent", "Affectionate", "Senior-friendly"];

    const getRandomTraits = () => {
      const shuffled = [...allTraits].sort(() => 0.5 - Math.random());
      return shuffled.slice(0, 3 + Math.floor(Math.random() * 3));
    };

    const petData = [];

    // 8 Dogs
    for (let i = 1; i <= 8; i++) {
        petData.push({
            name: `Doggo ${i}`,
            species: 'Dog',
            breed: i % 2 === 0 ? 'Golden Retriever' : 'Labrador Mix',
            age: 1 + Math.floor(Math.random() * 5),
            gender: i % 2 === 0 ? 'Male' : 'Female',
            size: 'Medium',
            traits: getRandomTraits(),
            photos: [`https://placedog.net/500/400?id=${i}`],
            description: `A very good dog looking for a forever home.`,
            status: i === 1 ? 'adopted' : (i === 2 ? 'pending' : 'available'),
            shelterId: shelters[i % 2]._id
        });
    }

    // 5 Cats
    for (let i = 1; i <= 5; i++) {
        petData.push({
            name: `Kitty ${i}`,
            species: 'Cat',
            breed: 'Domestic Shorthair',
            age: 1 + Math.floor(Math.random() * 5),
            gender: i % 2 === 0 ? 'Female' : 'Male',
            size: 'Small',
            traits: getRandomTraits(),
            photos: [`https://loremflickr.com/500/400/cat,cute?lock=${i}`],
            description: `A sweet and cuddly cat.`,
            status: i === 1 ? 'pending' : 'available',
            shelterId: shelters[i % 2]._id
        });
    }

    // 2 Rabbits
    for (let i = 1; i <= 2; i++) {
        petData.push({
            name: `Bunny ${i}`,
            species: 'Rabbit',
            breed: 'Holland Lop',
            age: 1,
            gender: 'Female',
            size: 'Small',
            traits: getRandomTraits(),
            photos: [`https://loremflickr.com/500/400/rabbit,bunny?lock=${i+100}`], // Reliable Unsplash rabbit
            description: `A fluffy bounding rabbit.`,
            status: 'available',
            shelterId: shelters[i % 2]._id
        });
    }

    await Pet.insertMany(petData);

    console.log("Seeded successfully! 15 pets, 2 shelters, 3 users created");
    process.exit();
  } catch (error) {
    console.error("Seeding error:", error);
    process.exit(1);
  }
};

seedDB();
