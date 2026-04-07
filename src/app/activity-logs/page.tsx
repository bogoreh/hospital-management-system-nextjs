'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  ChevronDown,
  User,
  Calendar,
  DollarSign,
  FileText,
  Pill,
  Bell,
  Download,
  Eye,
  Clock,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { exportAppointmentsToPDF } from '@/utils/exportPDF';

interface ActivityLog {
  id: string;
  action: string;
  user: string;
  userRole: string;
  target: string;
  targetId: string;
  details: string;
  timestamp: Date;
  type: 'appointment' | 'patient' | 'doctor' | 'billing' | 'emr' | 'notification';
  severity: 'info' | 'warning' | 'error' | 'success';
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Generate sample activity logs
  useEffect(() => {
    const sampleLogs: ActivityLog[] = [
      // {
      //   id: '1',
      //   action: 'Created new appointment',
      //   user: 'Dr. Sarah Johnson',
      //   userRole: 'doctor',
      //   target: 'Appointment',
      //   targetId: 'APT-001',
      //   details: 'Appointment scheduled with John Doe for Cardiology checkup',
      //   timestamp: new Date('2024-03-20T10:30:00'),
      //   type: 'appointment',
      //   severity: 'success'
      // },
      // {
      //   id: '2',
      //   action: 'Generated invoice',
      //   user: 'Admin User',
      //   userRole: 'admin',
      //   target: 'Invoice',
      //   targetId: 'INV-2024-001',
      //   details: 'Invoice generated for John Doe - Total: $165.00',
      //   timestamp: new Date('2024-03-20T09:15:00'),
      //   type: 'billing',
      //   severity: 'info'
      // },
      // {
      //   id: '3',
      //   action: 'Added medical record',
      //   user: 'Dr. Michael Chen',
      //   userRole: 'doctor',
      //   target: 'EMR',
      //   targetId: 'EMR-001',
      //   details: 'Added diagnosis: Hypertension for patient Jane Smith',
      //   timestamp: new Date('2024-03-19T14:45:00'),
      //   type: 'emr',
      //   severity: 'success'
      // },
      // {
      //   id: '4',
      //   action: 'Updated patient information',
      //   user: 'Staff User',
      //   userRole: 'staff',
      //   target: 'Patient',
      //   targetId: 'PT-001',
      //   details: 'Updated contact information for Robert Johnson',
      //   timestamp: new Date('2024-03-19T11:20:00'),
      //   type: 'patient',
      //   severity: 'info'
      // },
      // {
      //   id: '5',
      //   action: 'Sent notification email',
      //   user: 'System',
      //   userRole: 'system',
      //   target: 'Notification',
      //   targetId: 'NOTIF-001',
      //   details: 'Appointment reminder sent to john.doe@example.com',
      //   timestamp: new Date('2024-03-18T16:00:00'),
      //   type: 'notification',
      //   severity: 'info'
      // },
      // {
      //   id: '6',
      //   action: 'Cancelled appointment',
      //   user: 'Jane Smith',
      //   userRole: 'patient',
      //   target: 'Appointment',
      //   targetId: 'APT-002',
      //   details: 'Appointment cancelled due to personal reasons',
      //   timestamp: new Date('2024-03-18T09:30:00'),
      //   type: 'appointment',
      //   severity: 'warning'
      // },
      // {
      //   id: '7',
      //   action: 'Payment received',
      //   user: 'Admin User',
      //   userRole: 'admin',
      //   target: 'Payment',
      //   targetId: 'PAY-001',
      //   details: 'Payment of $165.00 received for invoice INV-2024-001',
      //   timestamp: new Date('2024-03-17T14:20:00'),
      //   type: 'billing',
      //   severity: 'success'
      // },
      // {
      //   id: '8',
      //   action: 'Prescribed medication',
      //   user: 'Dr. Emily Davis',
      //   userRole: 'doctor',
      //   target: 'Prescription',
      //   targetId: 'RX-001',
      //   details: 'Prescribed Amoxicillin for patient Robert Johnson',
      //   timestamp: new Date('2024-03-17T11:45:00'),
      //   type: 'emr',
      //   severity: 'info'
      // }
    ];
    setLogs(sampleLogs);
  }, []);

  const getTypeIcon = (type: string) => {
    switch(type) {
      case 'appointment': return <Calendar className="h-5 w-5" />;
      case 'patient': return <User className="h-5 w-5" />;
      case 'doctor': return <User className="h-5 w-5" />;
      case 'billing': return <DollarSign className="h-5 w-5" />;
      case 'emr': return <FileText className="h-5 w-5" />;
      case 'notification': return <Bell className="h-5 w-5" />;
      default: return <Activity className="h-5 w-5" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'success': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'warning': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'error': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  const getTypeColor = (type: string) => {
    switch(type) {
      case 'appointment': return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'billing': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'emr': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
    }
  };

  const handleExportLogs = () => {
    // Create a simple text export of logs
    const logText = filteredLogs.map(log => 
      `[${new Date(log.timestamp).toLocaleString()}] ${log.action} - ${log.user} (${log.userRole}) - ${log.details}`
    ).join('\n');
    
    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `activity_logs_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Activity logs exported successfully!');
  };

  const handleViewDetails = (log: ActivityLog) => {
    setSelectedLog(log);
    setShowDetailsModal(true);
  };

  // Filter logs
  const filteredLogs = logs.filter(log => {
    const matchesSearch = searchTerm === '' ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.details.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || log.type === filterType;
    const matchesSeverity = filterSeverity === 'all' || log.severity === filterSeverity;
    
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const logDate = new Date(log.timestamp);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = logDate >= startDate && logDate <= endDate;
    }
    
    return matchesSearch && matchesType && matchesSeverity && matchesDateRange;
  });

  const clearFilters = () => {
    setSearchTerm('');
    setFilterType('all');
    setFilterSeverity('all');
    setDateRange({ start: '', end: '' });
    toast.success('All filters cleared');
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50 dark:bg-dark-bg">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-dark-text">
                  Activity Logs
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                  Track all system activities and user actions
                </p>
              </div>
              <button
                onClick={handleExportLogs}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Download className="h-5 w-5" />
                Export Logs
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search logs by action, user, or details..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-gray-100 dark:bg-dark-border text-gray-700 dark:text-dark-text rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                {(searchTerm || filterType !== 'all' || filterSeverity !== 'all' || dateRange.start || dateRange.end) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-dark-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Date Range
                      </label>
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                        />
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Activity Type
                      </label>
                      <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="all">All Types</option>
                        <option value="appointment">Appointments</option>
                        <option value="patient">Patients</option>
                        <option value="doctor">Doctors</option>
                        <option value="billing">Billing</option>
                        <option value="emr">Medical Records</option>
                        <option value="notification">Notifications</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Severity
                      </label>
                      <select
                        value={filterSeverity}
                        onChange={(e) => setFilterSeverity(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="all">All Severities</option>
                        <option value="info">Info</option>
                        <option value="success">Success</option>
                        <option value="warning">Warning</option>
                        <option value="error">Error</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                <div className="text-2xl font-bold text-gray-800 dark:text-dark-text">{logs.length}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Total Activities</div>
              </div>
              <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {logs.filter(l => l.severity === 'success').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Successful</div>
              </div>
              <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {logs.filter(l => l.severity === 'warning').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Warnings</div>
              </div>
              <div className="bg-white dark:bg-dark-card rounded-lg p-4 border border-gray-200 dark:border-dark-border">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {logs.filter(l => l.type === 'appointment').length}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Appointments</div>
              </div>
            </div>

            {/* Activity Logs List */}
            <div className="space-y-4">
              {filteredLogs.map((log) => (
                <div 
                  key={log.id} 
                  className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6 hover:shadow-md transition-all animate-slide-up"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start gap-4">
                        <div className={`p-2 rounded-lg ${getTypeColor(log.type)}`}>
                          {getTypeIcon(log.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <h3 className="font-semibold text-gray-800 dark:text-dark-text">
                              {log.action}
                            </h3>
                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(log.severity)}`}>
                              {log.severity}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            {log.details}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500">
                            <span className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              {log.user} ({log.userRole})
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {new Date(log.timestamp).toLocaleString()}
                            </span>
                            <span>Target: {log.target} #{log.targetId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleViewDetails(log)}
                      className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center gap-2"
                    >
                      <Eye className="h-4 w-4" />
                      Details
                    </button>
                  </div>
                </div>
              ))}

              {filteredLogs.length === 0 && (
                <div className="text-center py-12 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No activity logs found</p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Log Details Modal */}
      {showDetailsModal && selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-2xl w-full animate-slide-up">
            <div className="border-b border-gray-200 dark:border-dark-border p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Activity Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Action</label>
                  <p className="text-gray-800 dark:text-dark-text font-medium">{selectedLog.action}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Severity</label>
                  <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(selectedLog.severity)}`}>
                    {selectedLog.severity}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">User</label>
                  <p className="text-gray-800 dark:text-dark-text">{selectedLog.user}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Role</label>
                  <p className="text-gray-800 dark:text-dark-text">{selectedLog.userRole}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Target</label>
                  <p className="text-gray-800 dark:text-dark-text">{selectedLog.target} #{selectedLog.targetId}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Timestamp</label>
                  <p className="text-gray-800 dark:text-dark-text">{new Date(selectedLog.timestamp).toLocaleString()}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Details</label>
                  <p className="text-gray-800 dark:text-dark-text">{selectedLog.details}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}

// Import missing icons
import { X } from 'lucide-react';