const Registration = require('../models/Registration');
const Event = require('../models/Event');
const User = require('../models/User');
const Notification = require('../models/Notification');
const qrcode = require('qrcode');

const registerForEvent = async (req, res) => {
  try {
    const { event_id, phone } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const event = await Event.findById(event_id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.status !== 'upcoming') {
      return res.status(400).json({ success: false, message: 'Event is not open for registration' });
    }

    const today = new Date().toISOString().split('T')[0];
    if (event.registration_deadline && today > event.registration_deadline) {
      return res.status(400).json({ success: false, message: 'Registration deadline has passed' });
    }

    const currentCount = await Registration.countDocuments({
      event_id: event._id,
      status: { $ne: 'cancelled' }
    });

    if (currentCount >= event.max_participants) {
      return res.status(400).json({ success: false, message: 'Event is full' });
    }

    const existingReg = await Registration.findOne({
      event_id: event._id,
      student_id: user._id,
      status: { $ne: 'cancelled' }
    });

    if (existingReg) {
      return res.status(400).json({ success: false, message: 'Already registered for this event' });
    }

    const yearStr = new Date().getFullYear().toString();
    const randDigits = Math.floor(10000 + Math.random() * 90000);
    const registration_id = `REG-${yearStr}-${randDigits}`;

    const studentCollegeId = req.body.college_id || user.college_id || '';
    const studentDept = req.body.department || user.department || '';
    const studentYear = req.body.year || user.year || '';
    const studentPhone = phone || user.phone || '';

    // Update user profile if previously blank
    if (studentCollegeId && !user.college_id) user.college_id = studentCollegeId;
    if (studentDept && !user.department) user.department = studentDept;
    if (studentYear && !user.year) user.year = studentYear;
    if (studentPhone && !user.phone) user.phone = studentPhone;
    await user.save();

    const newReg = await Registration.create({
      registration_id,
      event_id: event._id,
      student_id: user._id,
      student_name: user.name,
      email: user.email,
      college_id: studentCollegeId,
      department: studentDept,
      year: studentYear,
      phone: studentPhone,
      status: 'registered'
    });

    // Create confirmation notification
    await Notification.create({
      user_id: user._id,
      title: 'Registration Successful',
      message: `Registration successful for ${event.title} (${registration_id})`,
      type: 'registration',
      is_read: false
    });

    const qrCodeDataUrl = await qrcode.toDataURL(registration_id);

    const regObj = newReg.toJSON();
    regObj.qr_code = qrCodeDataUrl;

    res.status(201).json({ success: true, data: regObj });
  } catch (error) {
    console.error('Error in registerForEvent:', error);
    res.status(500).json({ success: false, message: 'Server error during registration', error: error.message });
  }
};

const getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ student_id: req.user.id })
      .populate('event_id')
      .sort({ registered_at: -1 });

    // Format so frontend accessing reg.events or reg.event_id works
    const formatted = registrations.map((reg) => {
      const obj = reg.toJSON();
      if (reg.event_id) {
        obj.events = {
          id: reg.event_id._id,
          title: reg.event_id.title,
          event_date: reg.event_id.event_date,
          venue: reg.event_id.venue,
          status: reg.event_id.status
        };
      }
      return obj;
    });

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error('Error in getMyRegistrations:', error);
    res.status(500).json({ success: false, message: 'Server error fetching registrations', error: error.message });
  }
};

const getEventParticipants = async (req, res) => {
  try {
    const { eventId } = req.params;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer_id && event.organizer_id.toString() !== req.user.id && req.user.role !== 'organizer') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    const participants = await Registration.find({
      event_id: eventId,
      status: { $ne: 'cancelled' }
    }).sort({ registered_at: -1 });

    res.json({ success: true, data: participants });
  } catch (error) {
    console.error('Error in getEventParticipants:', error);
    res.status(500).json({ success: false, message: 'Server error fetching participants', error: error.message });
  }
};

const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params;

    const registration = await Registration.findById(id).populate('event_id');
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }

    if (registration.student_id.toString() !== req.user.id && req.user.role !== 'organizer') {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    registration.status = 'cancelled';
    await registration.save();

    const eventTitle = registration.event_id ? registration.event_id.title : 'Event';
    await Notification.create({
      user_id: registration.student_id,
      title: 'Registration Cancelled',
      message: `Registration cancelled for ${eventTitle}`,
      type: 'cancellation',
      is_read: false
    });

    res.json({ success: true, message: 'Registration cancelled successfully' });
  } catch (error) {
    console.error('Error in cancelRegistration:', error);
    res.status(500).json({ success: false, message: 'Server error cancelling registration', error: error.message });
  }
};

const checkRegistration = async (req, res) => {
  try {
    const { eventId } = req.params;

    const registration = await Registration.findOne({
      event_id: eventId,
      student_id: req.user.id,
      status: { $ne: 'cancelled' }
    });

    res.json({
      success: true,
      data: {
        registered: !!registration,
        registration: registration || null
      }
    });
  } catch (error) {
    console.error('Error in checkRegistration:', error);
    res.status(500).json({ success: false, message: 'Server error checking registration', error: error.message });
  }
};

module.exports = {
  registerForEvent,
  getMyRegistrations,
  getEventParticipants,
  cancelRegistration,
  checkRegistration
};
