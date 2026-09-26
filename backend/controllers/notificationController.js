const Notification = require('../models/Notification');
const Registration = require('../models/Registration');

const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user_id: req.user.id }).sort({ created_at: -1 });
    res.json({ success: true, data: notifications });
  } catch (error) {
    console.error('Error in getNotifications:', error);
    res.status(500).json({ success: false, message: 'Server error fetching notifications', error: error.message });
  }
};

const markAsRead = async (req, res) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, user_id: req.user.id },
      { is_read: true }
    );
    res.json({ success: true, message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error in markAsRead:', error);
    res.status(500).json({ success: false, message: 'Server error marking notification as read', error: error.message });
  }
};

const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany({ user_id: req.user.id }, { is_read: true });
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (error) {
    console.error('Error in markAllAsRead:', error);
    res.status(500).json({ success: false, message: 'Server error marking all as read', error: error.message });
  }
};

const deleteNotification = async (req, res) => {
  try {
    await Notification.findOneAndDelete({ _id: req.params.id, user_id: req.user.id });
    res.json({ success: true, message: 'Notification deleted' });
  } catch (error) {
    console.error('Error in deleteNotification:', error);
    res.status(500).json({ success: false, message: 'Server error deleting notification', error: error.message });
  }
};

const sendNotification = async (req, res) => {
  try {
    const { event_id, title, message } = req.body;

    const registrations = await Registration.find({
      event_id,
      status: { $ne: 'cancelled' }
    });

    const notifs = registrations.map((reg) => ({
      user_id: reg.student_id,
      title,
      message,
      type: 'announcement',
      is_read: false
    }));

    if (notifs.length > 0) {
      await Notification.insertMany(notifs);
    }

    res.json({ success: true, message: `Sent ${notifs.length} notifications` });
  } catch (error) {
    console.error('Error in sendNotification:', error);
    res.status(500).json({ success: false, message: 'Server error sending notifications', error: error.message });
  }
};

module.exports = {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  sendNotification
};
