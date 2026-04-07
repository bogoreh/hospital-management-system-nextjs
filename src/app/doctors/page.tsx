'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  X,
  Filter,
  ChevronDown,
  Phone,
  Mail,
  User,
  Calendar,
  Clock,
  DollarSign,
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Doctor, DoctorFormData } from '@/types';

// Specializations list
const specializations = [
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

// Available days options
const weekDays = [
  'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
];

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [editingDoctor, setEditingDoctor] = useState<Doctor | null>(null);
  const [filterSpecialization, setFilterSpecialization] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [formData, setFormData] = useState<DoctorFormData>({
    name: '',
    specialization: '',
    qualification: '',
    experience: '',
    phone: '',
    email: '',
    address: '',
    availableDays: [],
    availableTimeStart: '09:00',
    availableTimeEnd: '17:00',
    consultationFee: '',
    status: 'available'
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Load sample data on mount
  useEffect(() => {
    const sampleDoctors: Doctor[] = [
      {
        id: '1',
        name: 'Dr. Sarah Johnson',
        specialization: 'Cardiology',
        qualification: 'MD, FACC',
        experience: 12,
        phone: '+1 234 567 8900',
        email: 'sarah.johnson@hospital.com',
        address: '123 Medical Center Dr, Suite 101',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTime: { start: '09:00', end: '17:00' },
        consultationFee: 150,
        status: 'available',
        rating: 4.8,
        patientsCount: 1240,
        joinDate: new Date('2018-03-15'),
      },
      {
        id: '2',
        name: 'Dr. Michael Chen',
        specialization: 'Neurology',
        qualification: 'MD, PhD',
        experience: 15,
        phone: '+1 234 567 8901',
        email: 'michael.chen@hospital.com',
        address: '456 Medical Center Dr, Suite 202',
        availableDays: ['Tuesday', 'Thursday', 'Saturday'],
        availableTime: { start: '10:00', end: '18:00' },
        consultationFee: 200,
        status: 'available',
        rating: 4.9,
        patientsCount: 980,
        joinDate: new Date('2016-08-20'),
      },
      {
        id: '3',
        name: 'Dr. Emily Davis',
        specialization: 'Pediatrics',
        qualification: 'MD, FAAP',
        experience: 8,
        phone: '+1 234 567 8902',
        email: 'emily.davis@hospital.com',
        address: '789 Medical Center Dr, Suite 303',
        availableDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        availableTime: { start: '08:00', end: '16:00' },
        consultationFee: 120,
        status: 'busy',
        rating: 4.7,
        patientsCount: 1560,
        joinDate: new Date('2020-01-10'),
      },
      {
        id: '4',
        name: 'Dr. James Wilson',
        specialization: 'Orthopedics',
        qualification: 'MD, FACS',
        experience: 20,
        phone: '+1 234 567 8903',
        email: 'james.wilson@hospital.com',
        address: '321 Medical Center Dr, Suite 404',
        availableDays: ['Monday', 'Wednesday', 'Friday'],
        availableTime: { start: '09:00', end: '15:00' },
        consultationFee: 180,
        status: 'off-duty',
        rating: 4.9,
        patientsCount: 2100,
        joinDate: new Date('2010-05-05'),
      }
    ];
    setDoctors(sampleDoctors);
  }, []);

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.name) errors.name = 'Doctor name is required';
    if (!formData.specialization) errors.specialization = 'Specialization is required';
    if (!formData.qualification) errors.qualification = 'Qualification is required';
    if (!formData.experience) errors.experience = 'Experience is required';
    else if (parseInt(formData.experience) < 0 || parseInt(formData.experience) > 60) errors.experience = 'Invalid experience years';
    if (!formData.phone) errors.phone = 'Phone is required';
    if (!formData.email) errors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = 'Email is invalid';
    if (!formData.consultationFee) errors.consultationFee = 'Consultation fee is required';
    if (formData.availableDays.length === 0) errors.availableDays = 'At least one available day is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    if (editingDoctor) {
      // Edit doctor
      const updatedDoctors = doctors.map(doctor =>
        doctor.id === editingDoctor.id
          ? {
              ...doctor,
              name: formData.name,
              specialization: formData.specialization,
              qualification: formData.qualification,
              experience: parseInt(formData.experience),
              phone: formData.phone,
              email: formData.email,
              address: formData.address,
              availableDays: formData.availableDays,
              availableTime: {
                start: formData.availableTimeStart,
                end: formData.availableTimeEnd
              },
              consultationFee: parseInt(formData.consultationFee),
              status: formData.status,
            }
          : doctor
      );
      setDoctors(updatedDoctors);
      toast.success('Doctor updated successfully!');
    } else {
      // Add new doctor
      const newDoctor: Doctor = {
        id: Date.now().toString(),
        name: formData.name,
        specialization: formData.specialization,
        qualification: formData.qualification,
        experience: parseInt(formData.experience),
        phone: formData.phone,
        email: formData.email,
        address: formData.address,
        availableDays: formData.availableDays,
        availableTime: {
          start: formData.availableTimeStart,
          end: formData.availableTimeEnd
        },
        consultationFee: parseInt(formData.consultationFee),
        status: formData.status,
        rating: 0,
        patientsCount: 0,
        joinDate: new Date(),
      };
      setDoctors([newDoctor, ...doctors]);
      toast.success('Doctor added successfully!');
    }
    
    resetForm();
    setShowModal(false);
  };

  const handleEdit = (doctor: Doctor) => {
    setEditingDoctor(doctor);
    setFormData({
      name: doctor.name,
      specialization: doctor.specialization,
      qualification: doctor.qualification,
      experience: doctor.experience.toString(),
      phone: doctor.phone,
      email: doctor.email,
      address: doctor.address,
      availableDays: doctor.availableDays,
      availableTimeStart: doctor.availableTime.start,
      availableTimeEnd: doctor.availableTime.end,
      consultationFee: doctor.consultationFee.toString(),
      status: doctor.status
    });
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this doctor?')) {
      setDoctors(doctors.filter(doctor => doctor.id !== id));
      toast.success('Doctor deleted successfully!');
    }
  };

  const handleViewProfile = (doctor: Doctor) => {
    setSelectedDoctor(doctor);
    setShowProfileModal(true);
  };

  const resetForm = () => {
    setEditingDoctor(null);
    setFormData({
      name: '',
      specialization: '',
      qualification: '',
      experience: '',
      phone: '',
      email: '',
      address: '',
      availableDays: [],
      availableTimeStart: '09:00',
      availableTimeEnd: '17:00',
      consultationFee: '',
      status: 'available'
    });
    setFormErrors({});
  };

  const toggleDaySelection = (day: string) => {
    setFormData(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  // Filter doctors based on search and filters
  const filteredDoctors = doctors.filter(doctor => {
    const matchesSearch = searchTerm === '' ||
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialization = filterSpecialization === 'all' || doctor.specialization === filterSpecialization;
    const matchesStatus = filterStatus === 'all' || doctor.status === filterStatus;
    return matchesSearch && matchesSpecialization && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'available': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'busy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'off-duty': return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'off-duty': return 'Off Duty';
      default: return status;
    }
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
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-dark-text">Doctors</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">Manage doctor profiles and availability</p>
              </div>
              <button
                onClick={() => {
                  resetForm();
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center gap-2"
              >
                <Plus className="h-5 w-5" />
                Add New Doctor
              </button>
            </div>

            {/* Search and Filters */}
            <div className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border p-6 mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search by name, specialization, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  />
                </div>
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 flex items-center gap-2"
                >
                  <Filter className="h-5 w-5" />
                  Filters
                  <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {showFilters && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-dark-border grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialization</label>
                    <select
                      value={filterSpecialization}
                      onChange={(e) => setFilterSpecialization(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="all">All Specializations</option>
                      {specializations.map(spec => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    >
                      <option value="all">All Status</option>
                      <option value="available">Available</option>
                      <option value="busy">Busy</option>
                      <option value="off-duty">Off Duty</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredDoctors.map((doctor) => (
                <div key={doctor.id} className="bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border hover:shadow-lg transition-all duration-300 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                          {doctor.name.split(' ')[1]?.[0] || doctor.name[0]}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800 dark:text-dark-text text-lg">{doctor.name}</h3>
                          <p className="text-sm text-blue-600 dark:text-blue-400">{doctor.specialization}</p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{doctor.rating}</span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">({doctor.patientsCount}+ patients)</span>
                          </div>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(doctor.status)}`}>
                        {getStatusText(doctor.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Briefcase className="h-4 w-4" />
                        <span>{doctor.experience} years experience</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <GraduationCap className="h-4 w-4" />
                        <span>{doctor.qualification}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Phone className="h-4 w-4" />
                        <span>{doctor.phone}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">{doctor.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <DollarSign className="h-4 w-4" />
                        <span>${doctor.consultationFee} per visit</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Calendar className="h-4 w-4" />
                        <span>{doctor.availableDays.join(', ')}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4" />
                        <span>{doctor.availableTime.start} - {doctor.availableTime.end}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-dark-border">
                      <button
                        onClick={() => handleViewProfile(doctor)}
                        className="flex-1 px-3 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Eye className="h-4 w-4" />
                        Profile
                      </button>
                      <button
                        onClick={() => handleEdit(doctor)}
                        className="flex-1 px-3 py-2 text-green-600 border border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Edit className="h-4 w-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(doctor.id)}
                        className="flex-1 px-3 py-2 text-red-600 border border-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDoctors.length === 0 && (
              <div className="text-center py-12 bg-white dark:bg-dark-card rounded-xl shadow-sm border border-gray-200 dark:border-dark-border">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No doctors found</p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Add/Edit Doctor Modal - Add dark mode classes similarly */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">
                {editingDoctor ? 'Edit Doctor' : 'Add New Doctor'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Form fields - add dark mode classes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    placeholder="Dr. John Doe"
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Specialization *</label>
                  <select
                    value={formData.specialization}
                    onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-dark-border dark:bg-dark-card dark:text-dark-text rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  >
                    <option value="">Select Specialization</option>
                    {specializations.map(spec => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  {formErrors.specialization && <p className="text-red-500 text-xs mt-1">{formErrors.specialization}</p>}
                </div>
                
                {/* Add remaining form fields with dark mode classes... */}
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium">
                  {editingDoctor ? 'Update Doctor' : 'Add Doctor'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Doctor Profile Modal - Add dark mode classes similarly */}
      {showProfileModal && selectedDoctor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
          <div className="bg-white dark:bg-dark-card rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-white dark:bg-dark-card border-b border-gray-200 dark:border-dark-border p-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800 dark:text-dark-text">Doctor Profile</h2>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-6">
              {/* Profile content with dark mode classes */}
              <div className="flex items-center gap-6 mb-8 pb-6 border-b border-gray-200 dark:border-dark-border">
                <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                  {selectedDoctor.name.split(' ')[1]?.[0] || selectedDoctor.name[0]}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-dark-text">{selectedDoctor.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium">{selectedDoctor.specialization}</p>
                  <div className="flex gap-4 mt-2">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedDoctor.status)}`}>
                      {getStatusText(selectedDoctor.status)}
                    </span>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{selectedDoctor.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500 dark:text-gray-400">Joined: {new Date(selectedDoctor.joinDate).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Rest of the profile content... */}
              <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-dark-border">
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    handleEdit(selectedDoctor);
                  }}
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Edit className="h-4 w-4" />
                  Edit Doctor
                </button>
                <button
                  onClick={() => {
                    setShowProfileModal(false);
                    handleDelete(selectedDoctor.id);
                  }}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium flex items-center justify-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Doctor
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ProtectedRoute>
  );
}