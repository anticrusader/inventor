const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 0
  },
  category: {
    type: String,
    required: true
  },
  // category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  // weight: {
  //   type: Number,
  //   required: true
  // },
  // stone: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Stone',
  //   required: true
  // },
  // vendor: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Vendor',
  //   required: true
  // },
  category: { type: String },  // Changed from ObjectId
  stone: { type: String },     // Changed from ObjectId
  vendor: { type: String },    // Changed from ObjectId
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  images: [{
    type: String
  }],
  sku: {
    type: String,
    unique: true
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  collection: 'products' // Explicitly set collection name
});

// Function to generate a unique SKU
async function generateSKU(vendorId) {
  const vendor = await mongoose.model('Vendor').findById(vendorId);
  if (!vendor) throw new Error('Vendor not found');
  
  const vendorPrefix = (vendor.fname.slice(0, 2)).toLowerCase();
  
  // Find the highest item code
  const highestProduct = await mongoose.model('Product')
    .findOne({ sku: new RegExp(`^${vendorPrefix}\\d{4}$`) })
    .sort({ sku: -1 });
  
  let itemCode = '0001';
  if (highestProduct && highestProduct.sku) {
    const currentCode = parseInt(highestProduct.sku.slice(-4));
    itemCode = String(currentCode + 1).padStart(4, '0');
  }
  
  return `${vendorPrefix}${itemCode}`;
}

// Pre-save middleware to generate SKU
productSchema.pre('save', async function(next) {
  if (!this.sku) {
    try {
      this.sku = await generateSKU(this.vendor);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Update the updatedAt timestamp before saving
productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Product = mongoose.model('Product', productSchema);
console.log('Product model initialized with collection:', Product.collection.name);

module.exports = Product;

