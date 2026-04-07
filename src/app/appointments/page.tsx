'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Stethoscope, 
  FileText, 
  X,
  CheckCircle,
  XCircle,
  Clock as ClockIcon,
  Eye,
  Edit,
  Trash2,
  Search,
  Filter,
  ChevronDown,
  Plus,
  AlertCircle,
  Phone,
  Mail,
  Calendar as CalendarIcon,
  Activity,
  Bell,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Appointment, Doctor, Patient, AppointmentFormData } from '@/types';

// Time slots (30-minute intervals)
const generateTimeSlots = () => {
  const slots = [];
  for (let i = 8; i <= 20; i++) {
    slots.push(`${i.toString().padStart(2, '0')}:00`);
    slots.push(`${i.toString().padStart(2, '0')}:30`);
  }
  return slots;
};

const timeSlots = generateTimeSlots();

// Departments/Specializations
const departments = [
  'All Departments',
  'Cardiology',
  'Neurology',
  'Pediatrics',
  'Orthopedics',
  'Dermatology',
  'Ophthalmology',
  'ENT',
  'Psychiatry',
  'Radiology',
  'Emergency Medicine',
  'General Medicine',
  'Gynecology',
  'Urology',
  'Nephrology',
  'Oncology'
];

// Notification function
const sendAppointmentNotification = async (
  type: string,
  patient: Patient,
  doctor: Doctor,
  date: string,
  time: string,
  location: string = '123 Healthcare Ave, Medical City'
) => {
  try {
    const response = await fetch('/api/notifications/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        data: {
          patientName: patient.name,
          patientEmail: patient.email,
          doctorName: doctor.name,
          date,
          time,
          location
        }
      })
    });
    
    if (response.ok) {
      console.log(`Notification sent successfully: ${type}`);
    } else {
      console.error('Failed to send notification');
    }
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterDoctor, setFilterDoctor] = useState<string>('all');
  const [filterDepartment, setFilterDepartment] = useState<string>('All Departments');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sendingNotification, setSendingNotification] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [formData, setFormData] = useState<AppointmentFormData>({
    patientId: '',
    patientName: '',
    doctorId: '',
    date: '',
    time: '',
    symptoms: '',
    notes: ''
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load sample data
  useEffect(() => {
    // Sample patients
    const samplePatients: Patient[] = [
      {
        id: '1',
        name: 'John Doe',
        age: 45,
        gender: 'Male',
        phone: '+1 234 567 8900',
        email: 'john.doe@example.com',
        address: '123 Main St',
        bloodGroup: 'O+',
        medicalHistory: 'Hypertension',
        allergies: 'Penicillin',
        emergencyContact: 'Jane Doe',
        lastVisit: '2024-03-15',
        status: 'active',
        createdAt: new Date()
      },
      {
        id: '2',
        name: 'Jane Smith',
        age: 32,
        gender: 'Female',
        phone: '+1 234 567 8902',
        email: 'jane.smith@example.com',
        address: '456 Oak Ave',
        bloodGroup: 'A+',
        medicalHistory: 'Asthma',
        allergies: 'None',
        emergencyContact: 'Mike Smith',
        lastVisit: '2024-03-14',
        status: 'active',
        createdAt: new Date()
      },
      {
        id: '3',
        name: 'Robert Johnson',
        age: 58,
        gender: 'Male',
        phone: '+1 234 567 8904',
        email: 'robert.j@example.com',
        address: '789 Pine Rd',
        bloodGroup: 'B+',
        medicalHistory: 'Diabetes',
        allergies: 'Sulfa',
        emergencyContact: 'Mary Johnson',
        lastVisit: '2024-03-10',
        status: 'active',
        createdAt: new Date()
      }
    ];

    // Sample doctors with different departments
    const sampleDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        qualification: 'MD, FACC',
        experience: 12,
        phone: '+1 234 567 8900',
        email: 'sarah@hospital.com',
        address: '123 Medical Center Dr',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTime: { start: '09:00', end: '17:00' },
        consultationFee: 150,
        status: 'available',
        rating: 4.8,
        patientsCount: 1240,
        joinDate: new Date()
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialization: 'Neurology',
        qualification: 'MD, PhD',
        experience: 15,
        phone: '+1 234 567 8901',
        email: 'michael@hospital.com',
        address: '456 Medical Center Dr',
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableTime: { start: '10:00', end: '18:00' },
        consultationFee: 200,
        status: 'available',
        rating: 4.9,
        patientsCount: 980,
        joinDate: new Date()
      },
      {
        id: '3',
        name: 'Dr. Emily Davis',
        specialization: 'Pediatrics',
        qualification: 'MD, FAAP',
        experience: 8,
        phone: '+1 234 567 8902',
        email: 'emily@hospital.com',
        address: '789 Medical Center Dr',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTime: { start: '08:00', end: '16:00' },
        consultationFee: 120,
        status: 'available',
        rating: 4.7,
        patientsCount: 1560,
        joinDate: new Date()
      }
    ];

    // Sample appointments with various dates
    const sampleAppointments: Appointment[] = [
      // {
      //   id: '1',
      //   patientId: '1',
      //   patientName: 'John Doe',
      //   patientPhone: '+1 234 567 8900',
      //   patientEmail: 'john.doe@example.com',
      //   doctorId: '1',
      //   doctorName: 'Dr. Sarah Johnson',
      //   doctorSpecialization: 'Cardiology',
      //   date: '2024-03-20',
      //   time: '10:00',
      //   duration: 30,
      //   status: 'confirmed',
      //   symptoms: 'Chest pain, shortness of breath',
      //   notes: 'Please bring previous medical records',
      //   createdAt: new Date('2024-03-18'),
      //   updatedAt: new Date('2024-03-18')
      // },
      // {
      //   id: '2',
      //   patientId: '2',
      //   patientName: 'Jane Smith',
      //   patientPhone: '+1 234 567 8902',
      //   patientEmail: 'jane.smith@example.com',
      //   doctorId: '2',
      //   doctorName: 'Dr. Michael Chen',
      //   doctorSpecialization: 'Neurology',
      //   date: '2024-03-21',
      //   time: '14:30',
      //   duration: 30,
      //   status: 'pending',
      //   symptoms: 'Severe headaches, dizziness',
      //   notes: '',
      //   createdAt: new Date('2024-03-19'),
      //   updatedAt: new Date('2024-03-19')
      // },
      // {
      //   id: '3',
      //   patientId: '3',
      //   patientName: 'Robert Johnson',
      //   patientPhone: '+1 234 567 8904',
      //   patientEmail: 'robert.j@example.com',
      //   doctorId: '3',
      //   doctorName: 'Dr. Emily Davis',
      //   doctorSpecialization: 'Pediatrics',
      //   date: '2024-03-22',
      //   time: '11:00',
      //   duration: 30,
      //   status: 'pending',
      //   symptoms: 'Fever, cough',
      //   notes: 'Child patient',
      //   createdAt: new Date('2024-03-20'),
      //   updatedAt: new Date('2024-03-20')
      // },
      // {
      //   id: '4',
      //   patientId: '1',
      //   patientName: 'John Doe',
      //   patientPhone: '+1 234 567 8900',
      //   patientEmail: 'john.doe@example.com',
      //   doctorId: '2',
      //   doctorName: 'Dr. Michael Chen',
      //   doctorSpecialization: 'Neurology',
      //   date: '2024-03-15',
      //   time: '11:00',
      //   duration: 30,
      //   status: 'completed',
      //   symptoms: 'Follow-up consultation',
      //   notes: 'Recovery going well',
      //   createdAt: new Date('2024-03-10'),
      //   updatedAt: new Date('2024-03-15')
      // }
    ];

    setPatients(samplePatients);
    setDoctors(sampleDoctors);
    setAppointments(sampleAppointments);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.patientId) errors.patientId = 'Please select a patient';
    if (!formData.doctorId) errors.doctorId = 'Please select a doctor';
    if (!formData.date) errors.date = 'Please select a date';
    if (!formData.time) errors.time = 'Please select a time';
    if (!formData.symptoms) errors.symptoms = 'Please describe symptoms';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const selectedDoctor = doctors.find(d => d.id === formData.doctorId);
    const selectedPatient = patients.find(p => p.id === formData.patientId);
    
    if (!selectedDoctor || !selectedPatient) return;
    
    const newAppointment: Appointment = {
      id: Date.now().toString(),
      patientId: formData.patientId,
      patientName: selectedPatient.name,
      patientPhone: selectedPatient.phone,
      patientEmail: selectedPatient.email,
      doctorId: formData.doctorId,
      doctorName: selectedDoctor.name,
      doctorSpecialization: selectedDoctor.specialization,
      date: formData.date,
      time: formData.time,
      duration: 30,
      status: 'pending',
      symptoms: formData.symptoms,
      notes: formData.notes,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    setAppointments([newAppointment, ...appointments]);
    
    // Send notification for new appointment booking
    setSendingNotification(true);
    await sendAppointmentNotification(
      'appointment_reminder',
      selectedPatient,
      selectedDoctor,
      formData.date,
      formData.time,
      '123 Healthcare Ave, Medical City'
    );
    setSendingNotification(false);
    
    toast.success('Appointment booked successfully! A confirmation email has been sent.');
    resetForm();
    setShowModal(false);
  };

  const handleStatusUpdate = async (id: string, newStatus: Appointment['status']) => {
    const appointment = appointments.find(app => app.id === id);
    if (!appointment) return;
    
    const selectedPatient = patients.find(p => p.id === appointment.patientId);
    const selectedDoctor = doctors.find(d => d.id === appointment.doctorId);
    
    if (!selectedPatient || !selectedDoctor) return;
    
    const updatedAppointments = appointments.map(app =>
      app.id === id
        ? { ...app, status: newStatus, updatedAt: new Date() }
        : app
    );
    setAppointments(updatedAppointments);
    
    // Send notification based on status change
    setSendingNotification(true);
    
    if (newStatus === 'confirmed') {
      await sendAppointmentNotification(
        'appointment_confirmation',
        selectedPatient,
        selectedDoctor,
        appointment.date,
        appointment.time,
        '123 Healthcare Ave, Medical City'
      );
      toast.success(`Appointment confirmed! A confirmation email has been sent to ${selectedPatient.email}`);
    } else if (newStatus === 'cancelled') {
      await sendAppointmentNotification(
        'appointment_cancellation',
        selectedPatient,
        selectedDoctor,
        appointment.date,
        appointment.time,
        '123 Healthcare Ave, Medical City'
      );
      toast.success(`Appointment cancelled! A cancellation notice has been sent to ${selectedPatient.email}`);
    } else {
      toast.success(`Appointment ${newStatus} successfully!`);
    }
    
    setSendingNotification(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this appointment?')) {
      setAppointments(appointments.filter(app => app.id !== id));
      toast.success('Appointment deleted successfully!');
    }
  };

  const handleViewDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const handleResendNotification = async (appointment: Appointment) => {
    const selectedPatient = patients.find(p => p.id === appointment.patientId);
    const selectedDoctor = doctors.find(d => d.id === appointment.doctorId);
    
    if (!selectedPatient || !selectedDoctor) {
      toast.error('Unable to send notification');
      return;
    }
    
    setSendingNotification(true);
    await sendAppointmentNotification(
      'appointment_reminder',
      selectedPatient,
      selectedDoctor,
      appointment.date,
      appointment.time,
      '123 Healthcare Ave, Medical City'
    );
    setSendingNotification(false);
    
    toast.success(`Reminder email resent to ${selectedPatient.email}`);
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      patientName: '',
      doctorId: '',
      date: '',
      time: '',
      symptoms: '',
      notes: ''
    });
    setFormErrors({});
  };

  const clearFilters = () => {
    setSearchTerm('');
    setFilterStatus('all');
    setFilterDoctor('all');
    setFilterDepartment('All Departments');
    setDateRange({ start: '', end: '' });
    toast.success('All filters cleared');
  };

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'confirmed': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-blue-100 text-blue-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <ClockIcon className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  // Enhanced filter logic
  const filteredAppointments = appointments.filter(appointment => {
    // Search filter
    const matchesSearch = searchTerm === '' || 
      appointment.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.patientPhone.includes(searchTerm) ||
      appointment.patientEmail.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Status filter
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    
    // Doctor filter
    const matchesDoctor = filterDoctor === 'all' || appointment.doctorId === filterDoctor;
    
    // Department filter
    const matchesDepartment = filterDepartment === 'All Departments' || 
      appointment.doctorSpecialization === filterDepartment;
    
    // Date range filter
    let matchesDateRange = true;
    if (dateRange.start && dateRange.end) {
      const appointmentDate = new Date(appointment.date);
      const startDate = new Date(dateRange.start);
      const endDate = new Date(dateRange.end);
      matchesDateRange = appointmentDate >= startDate && appointmentDate <= endDate;
    } else if (dateRange.start) {
      const appointmentDate = new Date(appointment.date);
      const startDate = new Date(dateRange.start);
      matchesDateRange = appointmentDate >= startDate;
    } else if (dateRange.end) {
      const appointmentDate = new Date(appointment.date);
      const endDate = new Date(dateRange.end);
      matchesDateRange = appointmentDate <= endDate;
    }
    
    return matchesSearch && matchesStatus && matchesDoctor && matchesDepartment && matchesDateRange;
  });

  // Group appointments by date
  const groupedAppointments = filteredAppointments.reduce((groups, appointment) => {
    const date = appointment.date;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(appointment);
    return groups;
  }, {} as Record<string, Appointment[]>);

  // Sort dates
  const sortedDates = Object.keys(groupedAppointments).sort();

  // Get unique doctors for filter
  const uniqueDoctors = Array.from(new Map(doctors.map(doctor => [doctor.id, doctor])).values());

  // Statistics for filtered results
  const stats = {
    total: filteredAppointments.length,
    pending: filteredAppointments.filter(a => a.status === 'pending').length,
    confirmed: filteredAppointments.filter(a => a.status === 'confirmed').length,
    completed: filteredAppointments.filter(a => a.status === 'completed').length,
    cancelled: filteredAppointments.filter(a => a.status === 'cancelled').length
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Appointments</h1>
                <p className="text-gray-600 mt-2">Schedule and manage patient appointments</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                disabled={sendingNotification}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2 disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
                Book Appointment
              </button>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by patient name, doctor name, phone, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  Advanced Filters
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
                {(searchTerm || filterStatus !== 'all' || filterDoctor !== 'all' || filterDepartment !== 'All Departments' || dateRange.start || dateRange.end) && (
                  <button
                    onClick={clearFilters}
                    className="px-4 py-2 text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                  >
                    <RefreshCw className="h-4 w-4" />
                    Clear All
                  </button>
                )}
              </div>

              {/* Advanced Filters Panel */}
              {showFilters && (
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Date Range Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Date Range
                      </label>
                      <div className="space-y-2">
                        <input
                          type="date"
                          value={dateRange.start}
                          onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                          placeholder="Start Date"
                        />
                        <input
                          type="date"
                          value={dateRange.end}
                          onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm"
                          placeholder="End Date"
                        />
                      </div>
                    </div>

                    {/* Status Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Activity className="h-4 w-4" />
                        Status
                      </label>
                      <select
                        value={filterStatus}
                        onChange={(e) => setFilterStatus(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="all">All Status</option>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    {/* Doctor Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Stethoscope className="h-4 w-4" />
                        Doctor
                      </label>
                      <select
                        value={filterDoctor}
                        onChange={(e) => setFilterDoctor(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        <option value="all">All Doctors</option>
                        {uniqueDoctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>{doctor.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Department Filter */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                        <Sparkles className="h-4 w-4" />
                        Department
                      </label>
                      <select
                        value={filterDepartment}
                        onChange={(e) => setFilterDepartment(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      >
                        {departments.map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Active Filters Display */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {searchTerm && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                        Search: {searchTerm}
                        <button onClick={() => setSearchTerm('')} className="hover:text-blue-600">×</button>
                      </span>
                    )}
                    {filterStatus !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                        Status: {filterStatus}
                        <button onClick={() => setFilterStatus('all')} className="hover:text-green-600">×</button>
                      </span>
                    )}
                    {filterDoctor !== 'all' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-purple-100 text-purple-800 rounded-full">
                        Doctor: {doctors.find(d => d.id === filterDoctor)?.name}
                        <button onClick={() => setFilterDoctor('all')} className="hover:text-purple-600">×</button>
                      </span>
                    )}
                    {filterDepartment !== 'All Departments' && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 text-orange-800 rounded-full">
                        Dept: {filterDepartment}
                        <button onClick={() => setFilterDepartment('All Departments')} className="hover:text-orange-600">×</button>
                      </span>
                    )}
                    {(dateRange.start || dateRange.end) && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                        Date: {dateRange.start || 'any'} to {dateRange.end || 'any'}
                        <button onClick={() => setDateRange({ start: '', end: '' })} className="hover:text-indigo-600">×</button>
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <div className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="text-2xl font-bold text-gray-800">{stats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <div className="text-2xl font-bold text-yellow-800">{stats.pending}</div>
                <div className="text-sm text-yellow-600">Pending</div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <div className="text-2xl font-bold text-green-800">{stats.confirmed}</div>
                <div className="text-sm text-green-600">Confirmed</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="text-2xl font-bold text-blue-800">{stats.completed}</div>
                <div className="text-sm text-blue-600">Completed</div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <div className="text-2xl font-bold text-red-800">{stats.cancelled}</div>
                <div className="text-sm text-red-600">Cancelled</div>
              </div>
            </div>

            {/* View Toggle */}
            <div className="flex justify-end mb-4">
              <div className="bg-gray-100 rounded-lg p-1 flex gap-1">
                <button
                  onClick={() => setViewMode('list')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'list' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  List View
                </button>
                <button
                  onClick={() => setViewMode('calendar')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    viewMode === 'calendar' 
                      ? 'bg-white text-blue-600 shadow-sm' 
                      : 'text-gray-600 hover:text-gray-800'
                  }`}
                >
                  Calendar View
                </button>
              </div>
            </div>

            {/* Appointments by Date (List View) */}
            {viewMode === 'list' && (
              <div className="space-y-6">
                {sortedDates.map(date => (
                  <div key={date} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-6 py-3 border-b border-gray-200">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="h-5 w-5 text-gray-600" />
                        <h2 className="font-semibold text-gray-800">
                          {new Date(date).toLocaleDateString('en-US', { 
                            weekday: 'long', 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </h2>
                        <span className="ml-2 px-2 py-1 text-xs bg-gray-200 text-gray-700 rounded-full">
                          {groupedAppointments[date].length} appointments
                        </span>
                      </div>
                    </div>
                    <div className="divide-y divide-gray-200">
                      {groupedAppointments[date].map((appointment) => (
                        <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-start gap-4">
                                <div className="flex-shrink-0">
                                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex flex-col items-center justify-center">
                                    <Clock className="h-5 w-5 text-blue-600" />
                                    <span className="text-xs font-medium text-blue-600 mt-1">
                                      {appointment.time}
                                    </span>
                                  </div>
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    <h3 className="font-semibold text-gray-800">{appointment.patientName}</h3>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor(appointment.status)}`}>
                                      {getStatusIcon(appointment.status)}
                                      {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                                    </span>
                                  </div>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Stethoscope className="h-4 w-4" />
                                      <span>{appointment.doctorName}</span>
                                      <span className="text-xs text-gray-400">({appointment.doctorSpecialization})</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Phone className="h-4 w-4" />
                                      <span>{appointment.patientPhone}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <Mail className="h-4 w-4" />
                                      <span>{appointment.patientEmail}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-gray-600">
                                      <FileText className="h-4 w-4" />
                                      <span className="truncate">{appointment.symptoms}</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 flex-wrap">
                              <button
                                onClick={() => handleViewDetails(appointment)}
                                className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
                              >
                                <Eye className="h-4 w-4" />
                                Details
                              </button>
                              {(appointment.status === 'pending' || appointment.status === 'confirmed') && (
                                <button
                                  onClick={() => handleResendNotification(appointment)}
                                  disabled={sendingNotification}
                                  className="px-3 py-2 text-purple-600 border border-purple-600 rounded-lg hover:bg-purple-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                  title="Resend reminder email"
                                >
                                  <Bell className="h-4 w-4" />
                                  Resend
                                </button>
                              )}
                              {appointment.status === 'pending' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(appointment.id, 'confirmed')}
                                    disabled={sendingNotification}
                                    className="px-3 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Confirm
                                  </button>
                                  <button
                                    onClick={() => handleStatusUpdate(appointment.id, 'cancelled')}
                                    disabled={sendingNotification}
                                    className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <XCircle className="h-4 w-4" />
                                    Cancel
                                  </button>
                                </>
                              )}
                              {appointment.status === 'confirmed' && (
                                <>
                                  <button
                                    onClick={() => handleStatusUpdate(appointment.id, 'completed')}
                                    disabled={sendingNotification}
                                    className="px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2 disabled:opacity-50"
                                  >
                                    <CheckCircle className="h-4 w-4" />
                                    Complete
                                  </button>
                                  <button
                                    onClick={() => handleDelete(appointment.id)}
                                    className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                  </button>
                                </>
                              )}
                              {(appointment.status === 'completed' || appointment.status === 'cancelled') && (
                                <button
                                  onClick={() => handleDelete(appointment.id)}
                                  className="px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 transition-colors flex items-center gap-2"
                                >
                                  <Trash2 className="h-4 w-4" />
                                  Delete
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Calendar View (Simplified) */}
            {viewMode === 'calendar' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6">
                  <div className="grid grid-cols-7 gap-2 mb-4">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                      <div key={day} className="text-center font-semibold text-gray-600 py-2">
                        {day}
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {Array.from({ length: 35 }).map((_, i) => {
                      const date = new Date();
                      date.setDate(date.getDate() - date.getDay() + i);
                      const dateStr = date.toISOString().split('T')[0];
                      const dayAppointments = groupedAppointments[dateStr] || [];
                      
                      return (
                        <div key={i} className="min-h-[100px] border border-gray-200 rounded-lg p-2 hover:bg-gray-50 transition-colors">
                          <div className="text-sm font-medium text-gray-600 mb-1">{date.getDate()}</div>
                          {dayAppointments.slice(0, 3).map(app => (
                            <div key={app.id} className="text-xs p-1 bg-blue-50 rounded mb-1 truncate">
                              {app.time} - {app.patientName}
                            </div>
                          ))}
                          {dayAppointments.length > 3 && (
                            <div className="text-xs text-gray-500">+{dayAppointments.length - 3} more</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {filteredAppointments.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm border border-gray-200">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No appointments found matching your filters</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Book Appointment Modal - Same as before */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Book New Appointment</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Patient *</label>
                  <select
                    value={formData.patientId}
                    onChange={(e) => {
                      const patient = patients.find(p => p.id === e.target.value);
                      setFormData({ 
                        ...formData, 
                        patientId: e.target.value,
                        patientName: patient?.name || ''
                      });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Patient</option>
                    {patients.map(patient => (
                      <option key={patient.id} value={patient.id}>
                        {patient.name} - {patient.phone}
                      </option>
                    ))}
                  </select>
                  {formErrors.patientId && <p className="text-red-500 text-xs mt-1">{formErrors.patientId}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor *</label>
                  <select
                    value={formData.doctorId}
                    onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                  {formErrors.doctorId && <p className="text-red-500 text-xs mt-1">{formErrors.doctorId}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date *</label>
                  <input
                    type="date"
                    value={formData.date}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                  {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Time *</label>
                  <select
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Time</option>
                    {timeSlots.map(time => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                  {formErrors.time && <p className="text-red-500 text-xs mt-1">{formErrors.time}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms / Reason *</label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    rows={3}
                    placeholder="Describe symptoms or reason for visit..."
                  />
                  {formErrors.symptoms && <p className="text-red-500 text-xs mt-1">{formErrors.symptoms}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Additional Notes (Optional)</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    rows={2}
                    placeholder="Any additional information..."
                  />
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <Bell className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div className="text-sm text-blue-800">
                    <p className="font-medium">Email Notification</p>
                    <p>A confirmation email will be sent to the patient's email address after booking.</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                <button type="submit" disabled={sendingNotification} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50">
                  {sendingNotification ? 'Sending...' : 'Book Appointment'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors duration-200 font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Appointment Details Modal - Same as before */}
      {showDetailsModal && selectedAppointment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold">Appointment Details</h2>
              <button onClick={() => setShowDetailsModal(false)} className="text-gray-400 hover:text-gray-600">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Status Header */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <Activity className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Status:</span>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full flex items-center gap-1 ${getStatusColor(selectedAppointment.status)}`}>
                    {getStatusIcon(selectedAppointment.status)}
                    {selectedAppointment.status.charAt(0).toUpperCase() + selectedAppointment.status.slice(1)}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Booked on: {new Date(selectedAppointment.createdAt).toLocaleDateString()}
                </div>
              </div>

              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600" />
                  Patient Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Name</p>
                    <p className="font-medium">{selectedAppointment.patientName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="font-medium">{selectedAppointment.patientPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{selectedAppointment.patientEmail}</p>
                  </div>
                </div>
              </div>

              {/* Doctor Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Stethoscope className="h-5 w-5 text-green-600" />
                  Doctor Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Doctor</p>
                    <p className="font-medium">{selectedAppointment.doctorName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Specialization</p>
                    <p className="font-medium">{selectedAppointment.doctorSpecialization}</p>
                  </div>
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Appointment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium">{new Date(selectedAppointment.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Time</p>
                    <p className="font-medium">{selectedAppointment.time}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">{selectedAppointment.duration} minutes</p>
                  </div>
                </div>
              </div>

              {/* Medical Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-orange-600" />
                  Medical Information
                </h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Symptoms / Reason</p>
                    <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium">{selectedAppointment.symptoms}</p>
                    </div>
                  </div>
                  {selectedAppointment.notes && (
                    <div>
                      <p className="text-sm text-gray-500">Additional Notes</p>
                      <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium">{selectedAppointment.notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-gray-200">
                {selectedAppointment.status === 'pending' && (
                  <>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedAppointment.id, 'confirmed');
                        setShowDetailsModal(false);
                      }}
                      disabled={sendingNotification}
                      className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
                    >
                      Confirm & Send Email
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedAppointment.id, 'cancelled');
                        setShowDetailsModal(false);
                      }}
                      disabled={sendingNotification}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel & Notify
                    </button>
                  </>
                )}
                {selectedAppointment.status === 'confirmed' && (
                  <>
                    <button
                      onClick={() => {
                        handleResendNotification(selectedAppointment);
                      }}
                      disabled={sendingNotification}
                      className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Bell className="h-4 w-4" />
                      Resend Reminder
                    </button>
                    <button
                      onClick={() => {
                        handleStatusUpdate(selectedAppointment.id, 'completed');
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Mark as Completed
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(selectedAppointment.id);
                        setShowDetailsModal(false);
                      }}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                    >
                      Delete
                    </button>
                  </>
                )}
                {(selectedAppointment.status === 'completed' || selectedAppointment.status === 'cancelled') && (
                  <button
                    onClick={() => {
                      handleDelete(selectedAppointment.id);
                      setShowDetailsModal(false);
                    }}
                    className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium"
                  >
                    Delete Appointment
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}