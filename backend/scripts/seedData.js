const mongoose = require('mongoose');
const Stone = require('../models/Stone');
const Vendor = require('../models/Vendor');

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/inventor', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const stones = [
  { name: 'Diamond' },
  { name: 'Emerald' },
  { name: 'Ruby' },
  { name: 'Sapphire' },
  { name: 'Zirkon' }
];

const vendors = [
  { fname: 'Younas' },
  { fname: 'Waseem' },
  { fname: 'Saleem' },
  { fname: 'Anwar', lname: 'Shaikh' },
  { fname: 'Riwaj' },
  { fname: 'Javed', lname: 'Shakoor' },
  { fname: 'KW' },
  { fname: 'Sajan' },
  { fname: 'Saeed' },
  { fname: 'Nasir', lname: 'Zameer' }
];

const seedData = async () => {
  try {
    // Clear existing data
    await Stone.deleteMany({});
    await Vendor.deleteMany({});

    // Insert new data
    await Stone.insertMany(stones);
    await Vendor.insertMany(vendors);

    console.log('Data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
