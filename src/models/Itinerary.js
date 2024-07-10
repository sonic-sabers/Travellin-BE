import mongoose from 'mongoose';
const { Schema } = mongoose;

const AccommodationSchema = new Schema({
  name: String,
  address: String,
  checkInDate: Date,
  checkOutDate: Date,
  notes: String,
  document: String,  // Add document field
});

const TransportationSchema = new Schema({
  type: {
    type: String,
    enum: ['flight', 'train', 'bus', 'car', 'other'],
    required: true
  },
  company: String,
  departureLocation: String,
  departureDate: Date,
  arrivalLocation: String,
  arrivalDate: Date,
  bookingReference: String,
  notes: String,
  document: String,  // Add document field
});

const ActivitySchema = new Schema({
  name: String,
  date: Date,
  time: String,
  location: String,
  description: String,
  notes: String,
  document: String,  // Add document field
});

const DestinationSchema = new Schema({
  location: {
    type: String,
    required: true
  },
  arrivalDate: {
    type: Date,
    required: true
  },
  departureDate: {
    type: Date,
    required: true
  },
  notes: String,
  accommodations: [AccommodationSchema],
  transportations: [TransportationSchema],
  activities: [ActivitySchema],
  document: String,  // Add document field
});

const ItinerarySchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: String,
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  destinations: [DestinationSchema],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  document: String,  // Add document field
});

ItinerarySchema.virtual('itineraryId').get(function () {
  return this._id.toHexString();
});

ItinerarySchema.set('toJSON', {
  virtuals: true
});

export default mongoose.model('Itinerary', ItinerarySchema);
