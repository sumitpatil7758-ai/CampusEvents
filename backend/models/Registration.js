const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    registration_id: { type: String, required: true, unique: true },
    event_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
    student_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    student_name: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    college_id: { type: String, default: '' },
    department: { type: String, default: '' },
    year: { type: String, default: '' },
    status: {
      type: String,
      enum: ['registered', 'cancelled', 'attended'],
      default: 'registered'
    }
  },
  {
    timestamps: { createdAt: 'registered_at', updatedAt: 'updated_at' },
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

module.exports = mongoose.model('Registration', registrationSchema);
