export interface User {
  uid: string;
  email: string;
  displayName?: string;
  role: 'admin' | 'doctor' | 'staff';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  medicalHistory: string;
  allergies: string;
  emergencyContact: string;
  lastVisit: string;
  status: 'active' | 'inactive';
  createdAt: Date;
}

export interface PatientFormData {
  name: string;
  age: string;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  bloodGroup: string;
  medicalHistory: string;
  allergies: string;
  emergencyContact: string;
  status: 'active' | 'inactive';
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  qualification: string;
  experience: number;
  phone: string;
  email: string;
  address: string;
  availableDays: string[];
  availableTime: {
    start: string;
    end: string;
  };
  consultationFee: number;
  status: 'available' | 'busy' | 'off-duty';
  rating: number;
  patientsCount: number;
  joinDate: Date;
  image?: string;
}

export interface DoctorFormData {
  name: string;
  specialization: string;
  qualification: string;
  experience: string;
  phone: string;
  email: string;
  address: string;
  availableDays: string[];
  availableTimeStart: string;
  availableTimeEnd: string;
  consultationFee: string;
  status: 'available' | 'busy' | 'off-duty';
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  symptoms: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentFormData {
  patientId: string;
  patientName: string;
  doctorId: string;
  date: string;
  time: string;
  symptoms: string;
  notes: string;
}

export interface Diagnosis {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  diagnosis: string;
  symptoms: string[];
  notes: string;
  severity: 'mild' | 'moderate' | 'severe' | 'critical';
  status: 'active' | 'resolved' | 'chronic';
}

export interface Prescription {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  date: Date;
  medications: {
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
    instructions: string;
  }[];
  notes: string;
  refills: number;
  pharmacy?: string;
}

export interface MedicalFile {
  id: string;
  patientId: string;
  doctorId: string;
  doctorName: string;
  name: string;
  type: 'lab_report' | 'imaging' | 'prescription' | 'discharge_summary' | 'other';
  fileUrl: string;
  fileName: string;
  fileSize: number;
  fileType: string;
  uploadDate: Date;
  notes: string;
}

export interface EMRRecord {
  id: string;
  patientId: string;
  patientName: string;
  diagnoses: Diagnosis[];
  prescriptions: Prescription[];
  files: MedicalFile[];
  lastUpdated: Date;
  createdBy: string;
  createdAt: Date;
}

// Add EMRFormData interface
export interface EMRFormData {
  patientId: string;
  diagnosis: {
    diagnosis: string;
    symptoms: string[];
    notes: string;
    severity: 'mild' | 'moderate' | 'severe' | 'critical';
    status: 'active' | 'resolved' | 'chronic';
  };
  prescription: {
    medications: {
      name: string;
      dosage: string;
      frequency: string;
      duration: string;
      instructions: string;
    }[];
    notes: string;
    refills: number;
    pharmacy: string;
  };
}

export interface Service {
  id: string;
  name: string;
  category: 'consultation' | 'lab_test' | 'procedure' | 'medication' | 'other';
  price: number;
  description: string;
  isActive: boolean;
}

export interface Invoice {
  id: string;
  invoiceNumber: string;
  patientId: string;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  doctorId?: string;
  doctorName?: string;
  services: {
    serviceId: string;
    serviceName: string;
    quantity: number;
    price: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  discount: number;
  total: number;
  status: 'pending' | 'paid' | 'cancelled' | 'refunded';
  paymentMethod?: 'cash' | 'card' | 'insurance' | 'online';
  paymentDate?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate: Date;
}

export interface InvoiceFormData {
  patientId: string;
  doctorId: string;
  services: {
    serviceId: string;
    quantity: number;
  }[];
  discount: number;
  notes: string;
  dueDate: string;
}