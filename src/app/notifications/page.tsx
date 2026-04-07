'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { 
  Bell, 
  Mail, 
  Calendar, 
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  Settings,
  Send,
  Eye,
  Trash2,
  Filter,
  Search
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  type: 'appointment_reminder' | 'appointment_confirmation' | 'appointment_cancellation' | 'invoice' | 'system';
  title: string;
  message: string;
  recipient: string;
  recipientEmail: string;
  status: 'sent' | 'pending' | 'failed';
  sentAt?: Date;
  createdAt: Date;
  metadata: any;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showSendModal, setShowSendModal] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sending, setSending] = useState(false);
  const [formData, setFormData] = useState({
    type: 'appointment_reminder',
    recipientEmail: '',
    recipientName: '',
    appointmentDate: '',
    appointmentTime: '',
    doctorName: '',
    location: '123 Healthcare Ave, Medical City',
    invoiceNumber: '',
    invoiceAmount: '',
    dueDate: ''
  });

  // Load sample notifications
  useEffect(() => {
    const sampleNotifications: Notification[] = [
      // {
      //   id: '1',
      //   type: 'appointment_reminder',
      //   title: 'Appointment Reminder',
      //   message: 'Reminder: Appointment with Dr. Sarah Johnson tomorrow at 10:00 AM',
      //   recipient: 'John Doe',
      //   recipientEmail: 'john.doe@example.com',
      //   status: 'sent',
      //   sentAt: new Date('2024-03-19T10:00:00'),
      //   createdAt: new Date('2024-03-19T09:00:00'),
      //   metadata: {
      //     patientName: 'John Doe',
      //     doctorName: 'Dr. Sarah Johnson',
      //     date: '2024-03-20',
      //     time: '10:00 AM'
      //   }
      // },
      // {
      //   id: '2',
      //   type: 'appointment_confirmation',
      //   title: 'Appointment Confirmed',
      //   message: 'Your appointment with Dr. Michael Chen has been confirmed for March 21 at 2:30 PM',
      //   recipient: 'Jane Smith',
      //   recipientEmail: 'jane.smith@example.com',
      //   status: 'sent',
      //   sentAt: new Date('2024-03-18T14:30:00'),
      //   createdAt: new Date('2024-03-18T14:00:00'),
      //   metadata: {
      //     patientName: 'Jane Smith',
      //     doctorName: 'Dr. Michael Chen',
      //     date: '2024-03-21',
      //     time: '2:30 PM'
      //   }
      // },
      // {
      //   id: '3',
      //   type: 'invoice',
      //   title: 'New Invoice Generated',
      //   message: 'Invoice INV-2024-001 for $165.00 is due on April 15, 2024',
      //   recipient: 'John Doe',
      //   recipientEmail: 'john.doe@example.com',
      //   status: 'sent',
      //   sentAt: new Date('2024-03-15T09:00:00'),
      //   createdAt: new Date('2024-03-15T08:30:00'),
      //   metadata: {
      //     patientName: 'John Doe',
      //     invoiceNumber: 'INV-2024-001',
      //     amount: 165,
      //     dueDate: '2024-04-15'
      //   }
      // }
    ];
    setNotifications(sampleNotifications);
  }, []);

  const handleSendNotification = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      let notificationData: any = {};

      switch (formData.type) {
        case 'appointment_reminder':
          notificationData = {
            patientName: formData.recipientName,
            patientEmail: formData.recipientEmail,
            doctorName: formData.doctorName,
            date: formData.appointmentDate,
            time: formData.appointmentTime,
            location: formData.location
          };
          break;
        case 'appointment_confirmation':
          notificationData = {
            patientName: formData.recipientName,
            patientEmail: formData.recipientEmail,
            doctorName: formData.doctorName,
            date: formData.appointmentDate,
            time: formData.appointmentTime
          };
          break;
        case 'appointment_cancellation':
          notificationData = {
            patientName: formData.recipientName,
            patientEmail: formData.recipientEmail,
            doctorName: formData.doctorName,
            date: formData.appointmentDate,
            time: formData.appointmentTime
          };
          break;
        case 'invoice':
          notificationData = {
            patientName: formData.recipientName,
            patientEmail: formData.recipientEmail,
            invoiceNumber: formData.invoiceNumber,
            amount: parseFloat(formData.invoiceAmount),
            dueDate: formData.dueDate
          };
          break;
      }

      const response = await fetch('/api/notifications/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: formData.type,
          data: notificationData
        })
      });

      if (response.ok) {
        const newNotification: Notification = {
          id: Date.now().toString(),
          type: formData.type as any,
          title: getNotificationTitle(formData.type),
          message: getNotificationMessage(formData.type, notificationData),
          recipient: formData.recipientName,
          recipientEmail: formData.recipientEmail,
          status: 'sent',
          sentAt: new Date(),
          createdAt: new Date(),
          metadata: notificationData
        };

        setNotifications([newNotification, ...notifications]);
        toast.success('Notification sent successfully!');
        resetForm();
        setShowSendModal(false);
      } else {
        toast.error('Failed to send notification');
      }
    } catch (error) {
      toast.error('Error sending notification');
    } finally {
      setSending(false);
    }
  };

  const getNotificationTitle = (type: string): string => {
    switch(type) {
      case 'appointment_reminder': return 'Appointment Reminder';
      case 'appointment_confirmation': return 'Appointment Confirmed';
      case 'appointment_cancellation': return 'Appointment Cancelled';
      case 'invoice': return 'New Invoice Generated';
      default: return 'System Notification';
    }
  };

  const getNotificationMessage = (type: string, data: any): string => {
    switch(type) {
      case 'appointment_reminder':
        return `Reminder: Appointment with ${data.doctorName} on ${data.date} at ${data.time}`;
      case 'appointment_confirmation':
        return `Your appointment with ${data.doctorName} has been confirmed for ${data.date} at ${data.time}`;
      case 'appointment_cancellation':
        return `Your appointment with ${data.doctorName} on ${data.date} at ${data.time} has been cancelled`;
      case 'invoice':
        return `Invoice ${data.invoiceNumber} for $${data.amount.toFixed(2)} is due on ${data.dueDate}`;
      default: return '';
    }
  };

  const handleViewDetails = (notification: Notification) => {
    setSelectedNotification(notification);
    setShowDetailsModal(true);
  };

  const handleDeleteNotification = (id: string) => {
    if (window.confirm('Are you sure you want to delete this notification?')) {
      setNotifications(notifications.filter(n => n.id !== id));
      toast.success('Notification deleted successfully!');
    }
  };

  const resetForm = () => {
    setFormData({
      type: 'appointment_reminder',
      recipientEmail: '',
      recipientName: '',
      appointmentDate: '',
      appointmentTime: '',
      doctorName: '',
      location: '123 Healthcare Ave, Medical City',
      invoiceNumber: '',
      invoiceAmount: '',
      dueDate: ''
    });
  };

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'appointment_reminder':
      case 'appointment_confirmation':
      case 'appointment_cancellation':
        return <Calendar className="h-5 w-5" />;
      case 'invoice':
        return <DollarSign className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'appointment_reminder': return 'bg-blue-100 text-blue-600';
      case 'appointment_confirmation': return 'bg-green-100 text-green-600';
      case 'appointment_cancellation': return 'bg-red-100 text-red-600';
      case 'invoice': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'sent': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Filter notifications
  const filteredNotifications = notifications.filter(notification => {
    const matchesType = filterType === 'all' || notification.type === filterType;
    const matchesSearch = notification.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Notifications</h1>
                <p className="text-gray-600 mt-2">Send and manage email notifications</p>
              </div>
              <button
                onClick={() => setShowSendModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Send className="h-5 w-5" />
                Send Notification
              </button>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Bell className="h-6 w-6 text-blue-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">{notifications.length}</span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Total Notifications</h3>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-green-100 p-3 rounded-lg">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {notifications.filter(n => n.status === 'sent').length}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Sent Successfully</h3>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-yellow-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {notifications.filter(n => n.status === 'pending').length}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Pending</h3>
              </div>
              
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-purple-100 p-3 rounded-lg">
                    <Mail className="h-6 w-6 text-purple-600" />
                  </div>
                  <span className="text-2xl font-bold text-gray-800">
                    {notifications.filter(n => n.type === 'invoice').length}
                  </span>
                </div>
                <h3 className="text-gray-600 text-sm font-medium">Invoices Sent</h3>
              </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by recipient name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="all">All Types</option>
                    <option value="appointment_reminder">Appointment Reminders</option>
                    <option value="appointment_confirmation">Appointment Confirmations</option>
                    <option value="appointment_cancellation">Appointment Cancellations</option>
                    <option value="invoice">Invoices</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              {filteredNotifications.map((notification) => (
                <div key={notification.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`p-2 rounded-lg ${getTypeColor(notification.type)}`}>
                        {getTypeIcon(notification.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-800">{notification.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                            {notification.status}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mb-2">{notification.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>To: {notification.recipient} ({notification.recipientEmail})</span>
                          <span>Sent: {new Date(notification.createdAt).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewDetails(notification)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="View Details"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteNotification(notification.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredNotifications.length === 0 && (
                <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                  <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">No notifications found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Send Notification Modal */}
      {showSendModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Send Notification</h2>
              <button onClick={() => setShowSendModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSendNotification} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Notification Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="appointment_reminder">Appointment Reminder</option>
                  <option value="appointment_confirmation">Appointment Confirmation</option>
                  <option value="appointment_cancellation">Appointment Cancellation</option>
                  <option value="invoice">Invoice</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.recipientName}
                    onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recipient Email *</label>
                  <input
                    type="email"
                    required
                    value={formData.recipientEmail}
                    onChange={(e) => setFormData({ ...formData, recipientEmail: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {(formData.type === 'appointment_reminder' || formData.type === 'appointment_confirmation' || formData.type === 'appointment_cancellation') && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Doctor Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.doctorName}
                        onChange={(e) => setFormData({ ...formData, doctorName: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Date *</label>
                      <input
                        type="date"
                        required
                        value={formData.appointmentDate}
                        onChange={(e) => setFormData({ ...formData, appointmentDate: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Appointment Time *</label>
                      <input
                        type="time"
                        required
                        value={formData.appointmentTime}
                        onChange={(e) => setFormData({ ...formData, appointmentTime: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {formData.type === 'invoice' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.invoiceNumber}
                      onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Amount *</label>
                    <input
                      type="number"
                      required
                      step="0.01"
                      value={formData.invoiceAmount}
                      onChange={(e) => setFormData({ ...formData, invoiceAmount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Due Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button type="submit" disabled={sending} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {sending ? 'Sending...' : 'Send Notification'}
                </button>
                <button type="button" onClick={() => setShowSendModal(false)} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Notification Details Modal */}
      {showDetailsModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Notification Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${getTypeColor(selectedNotification.type)}`}>
                  {getTypeIcon(selectedNotification.type)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800">{selectedNotification.title}</h3>
                  <p className="text-sm text-gray-500">Type: {selectedNotification.type}</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{selectedNotification.message}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Recipient</label>
                  <p className="text-gray-800">{selectedNotification.recipient}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <p className="text-gray-800">{selectedNotification.recipientEmail}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedNotification.status)}`}>
                    {selectedNotification.status}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sent At</label>
                  <p className="text-gray-800">
                    {selectedNotification.sentAt ? new Date(selectedNotification.sentAt).toLocaleString() : 'Not sent'}
                  </p>
                </div>
              </div>
              
              {selectedNotification.metadata && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Metadata</label>
                  <pre className="p-3 bg-gray-50 rounded-lg text-sm overflow-auto">
                    {JSON.stringify(selectedNotification.metadata, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

// Import missing icons
import { X } from 'lucide-react';