const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

const getAllEvents = async (req, res) => {
  try {
    const { search, category, sort } = req.query;

    const filter = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { organizer_name: { $regex: search, $options: 'i' } }
      ];
    }
    if (category && category !== 'All' && category !== 'all') {
      filter.category = category;
    }

    let sortOption = { created_at: -1 };
    if (sort === 'newest') {
      sortOption = { created_at: -1 };
    } else if (sort === 'upcoming') {
      sortOption = { event_date: 1 };
    } else if (sort === 'popular') {
      sortOption = { created_at: -1 };
    }

    const events = await Event.find(filter).sort(sortOption);

    // Get registration count for each event
    const eventsWithCounts = await Promise.all(
      events.map(async (ev) => {
        const count = await Registration.countDocuments({
          event_id: ev._id,
          status: { $ne: 'cancelled' }
        });
        const obj = ev.toJSON();
        obj.registration_count = count;
        return obj;
      })
    );

    if (sort === 'popular') {
      eventsWithCounts.sort((a, b) => (b.registration_count || 0) - (a.registration_count || 0));
    }

    res.json(eventsWithCounts);
  } catch (error) {
    console.error('Error in getAllEvents:', error);
    res.status(500).json({ success: false, message: 'Server error fetching events', error: error.message });
  }
};

const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    const registrationCount = await Registration.countDocuments({
      event_id: event._id,
      status: { $ne: 'cancelled' }
    });

    const eventObj = event.toJSON();
    eventObj.registration_count = registrationCount;

    res.json(eventObj);
  } catch (error) {
    console.error('Error in getEventById:', error);
    res.status(500).json({ success: false, message: 'Server error fetching event details', error: error.message });
  }
};

const createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      event_date,
      start_time,
      end_time,
      venue,
      max_participants,
      registration_deadline,
      organizer_name,
      organizer_email,
      contact_number,
      banner_url,
      rules,
      requirements
    } = req.body;

    const newEvent = await Event.create({
      title,
      description,
      category,
      event_date,
      start_time,
      end_time,
      venue,
      max_participants: parseInt(max_participants, 10) || 100,
      registration_deadline,
      organizer_id: req.user.id,
      organizer_name: organizer_name || req.user.name,
      organizer_email: organizer_email || req.user.email,
      contact_number,
      banner_url,
      rules,
      requirements,
      status: 'upcoming'
    });

    res.status(201).json({ success: true, data: newEvent });
  } catch (error) {
    console.error('Error in createEvent:', error);
    res.status(500).json({ success: false, message: 'Server error creating event', error: error.message });
  }
};

const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer_id && event.organizer_id.toString() !== req.user.id && req.user.role !== 'organizer') {
      return res.status(403).json({ success: false, message: 'Unauthorized to update this event' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: updatedEvent });
  } catch (error) {
    console.error('Error in updateEvent:', error);
    res.status(500).json({ success: false, message: 'Server error updating event', error: error.message });
  }
};

const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }

    if (event.organizer_id && event.organizer_id.toString() !== req.user.id && req.user.role !== 'organizer') {
      return res.status(403).json({ success: false, message: 'Unauthorized to delete this event' });
    }

    await Event.findByIdAndDelete(req.params.id);
    await Registration.deleteMany({ event_id: req.params.id });

    res.json({ success: true, message: 'Event deleted successfully' });
  } catch (error) {
    console.error('Error in deleteEvent:', error);
    res.status(500).json({ success: false, message: 'Server error deleting event', error: error.message });
  }
};

const getStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const activeEvents = await Event.countDocuments({ status: 'upcoming' });
    const registeredStudents = await Registration.countDocuments({ status: { $ne: 'cancelled' } });
    const organizers = await User.countDocuments({ role: 'organizer' });

    res.json({
      total_events: totalEvents,
      active_events: activeEvents,
      registered_students: registeredStudents,
      organizers: organizers
    });
  } catch (error) {
    console.error('Error in getStats:', error);
    res.status(500).json({ success: false, message: 'Server error fetching statistics', error: error.message });
  }
};

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getStats
};
