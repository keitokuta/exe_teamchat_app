const mongoose = require('mongoose');
const config = require('../config');

const userSchema = {
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  username: { type: String, required: true },
  avatar: String,
  createdAt: { type: Date, default: Date.now },
  lastLogin: Date,
  status: { type: String, enum: ['active', 'inactive'], default: 'active' }
};

const channelSchema = {
  name: { type: String, required: true },
  description: String,
  type: { type: String, enum: ['public', 'private'], default: 'public' },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
};

async function up() {
  try {
    await mongoose.connect(config.mongoUri);

    await mongoose.connection.createCollection('users');
    await mongoose.connection.createCollection('channels');

    await mongoose.connection.collection('users').createIndex({ email: 1 }, { unique: true });
    await mongoose.connection.collection('users').createIndex({ username: 1 });
    
    await mongoose.connection.collection('channels').createIndex({ name: 1 });
    await mongoose.connection.collection('channels').createIndex({ members: 1 });
    await mongoose.connection.collection('channels').createIndex({ createdAt: -1 });

    console.log('Migration completed successfully');
  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

async function down() {
  try {
    await mongoose.connect(config.mongoUri);
    
    await mongoose.connection.dropCollection('users');
    await mongoose.connection.dropCollection('channels');

    console.log('Rollback completed successfully');
  } catch (error) {
    console.error('Rollback failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
  }
}

module.exports = { up, down };