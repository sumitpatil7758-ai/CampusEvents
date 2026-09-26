const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar', 'Competition', 'Hackathon']
    },
    event_date: { type: String, required: true },
    start_time: { type: String, required: true },
    end_time: { type: String, required: true },
    venue: { type: String, required: true },
    organizer_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    organizer_name: { type: String, default: '' },
    organizer_email: { type: String, default: '' },
    contact_number: { type: String, default: '' },
    max_participants: { type: Number, required: true, default: 100 },
    registration_deadline: { type: String, required: true },
    banner_url: { type: String, default: '' },
    rules: { type: String, default: '' },
    requirements: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming'
    }
  },
  {
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    toJSON: {
      virtuals: true,
      transform: function (doc, ret) {
        ret.id = ret._id;
        delete ret.__v;
        return ret;
      }
    }
  }
);

module.exports = mongoose.model('Event', eventSchema);
