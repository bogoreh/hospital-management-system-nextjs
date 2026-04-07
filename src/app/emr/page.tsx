'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import Sidebar from '@/components/Sidebar';
import { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Search, 
  FileText, 
  Pill, 
  FileUp,
  Eye,
  Download,
  Trash2,
  X,
  User,
  Stethoscope,
  Calendar,
  AlertCircle,
  Activity,
  Heart,
  Brain,
  Bone,
  Eye as EyeIcon,
  Microscope,
  FileImage,
  File,  // Changed from FilePdf to File
  Upload,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  FolderOpen  // Add this for the EMR icon
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Patient, Doctor, Diagnosis, Prescription, MedicalFile, EMRRecord } from '@/types';

// Mock data for demonstration
const mockPatients: Patient[] = [
  // {
  //   id: '1',
  //   name: 'John Doe',
  //   age: 45,
  //   gender: 'Male',
  //   phone: '+1 234 567 8900',
  //   email: 'john.doe@example.com',
  //   address: '123 Main St',
  //   bloodGroup: 'O+',
  //   medicalHistory: 'Hypertension',
  //   allergies: 'Penicillin',
  //   emergencyContact: 'Jane Doe',
  //   lastVisit: '2024-03-15',
  //   status: 'active',
  //   createdAt: new Date()
  // },
  // {
  //   id: '2',
  //   name: 'Jane Smith',
  //   age: 32,
  //   gender: 'Female',
  //   phone: '+1 234 567 8902',
  //   email: 'jane.smith@example.com',
  //   address: '456 Oak Ave',
  //   bloodGroup: 'A+',
  //   medicalHistory: 'Asthma',
  //   allergies: 'None',
  //   emergencyContact: 'Mike Smith',
  //   lastVisit: '2024-03-14',
  //   status: 'active',
  //   createdAt: new Date()
  // }
];

const mockDoctors: Doctor[] = [
  // {
  //   id: '1',
  //   name: 'Dr. Sarah Johnson',
  //   specialization: 'Cardiology',
  //   qualification: 'MD, FACC',
  //   experience: 12,
  //   phone: '+1 234 567 8900',
  //   email: 'sarah@hospital.com',
  //   address: '123 Medical Center Dr',
  //   availableDays: ['Monday', 'Wednesday', 'Friday'],
  //   availableTime: { start: '09:00', end: '17:00' },
  //   consultationFee: 150,
  //   status: 'available',
  //   rating: 4.8,
  //   patientsCount: 1240,
  //   joinDate: new Date()
  // },
  // {
  //   id: '2',
  //   name: 'Dr. Michael Chen',
  //   specialization: 'Neurology',
  //   qualification: 'MD, PhD',
  //   experience: 15,
  //   phone: '+1 234 567 8901',
  //   email: 'michael@hospital.com',
  //   address: '456 Medical Center Dr',
  //   availableDays: ['Tuesday', 'Thursday', 'Saturday'],
  //   availableTime: { start: '10:00', end: '18:00' },
  //   consultationFee: 200,
  //   status: 'available',
  //   rating: 4.9,
  //   patientsCount: 980,
  //   joinDate: new Date()
  // }
];

// Mock EMR data
const mockEMRData: EMRRecord[] = [
  {
    id: '1',
    patientId: '1',
    patientName: 'John Doe',
    diagnoses: [
      {
        id: 'd1',
        patientId: '1',
        doctorId: '1',
        doctorName: 'Dr. Sarah Johnson',
        date: new Date('2024-03-15'),
        diagnosis: 'Hypertension',
        symptoms: ['Headache', 'Dizziness', 'Blurred vision'],
        notes: 'Patient has stage 1 hypertension. Started on lifestyle modifications.',
        severity: 'moderate',
        status: 'active'
      },
      {
        id: 'd2',
        patientId: '1',
        doctorId: '1',
        doctorName: 'Dr. Sarah Johnson',
        date: new Date('2024-02-10'),
        diagnosis: 'Hyperlipidemia',
        symptoms: ['None reported', 'Routine checkup finding'],
        notes: 'Elevated cholesterol levels. Started on statin therapy.',
        severity: 'mild',
        status: 'active'
      }
    ],
    prescriptions: [
      {
        id: 'p1',
        patientId: '1',
        doctorId: '1',
        doctorName: 'Dr. Sarah Johnson',
        date: new Date('2024-03-15'),
        medications: [
          {
            name: 'Lisinopril',
            dosage: '10mg',
            frequency: 'Once daily',
            duration: '30 days',
            instructions: 'Take with food'
          }
        ],
        notes: 'Monitor blood pressure weekly',
        refills: 2,
        pharmacy: 'City Pharmacy'
      }
    ],
    files: [
      {
        id: 'f1',
        patientId: '1',
        doctorId: '1',
        doctorName: 'Dr. Sarah Johnson',
        name: 'Blood Test Report',
        type: 'lab_report',
        fileUrl: '#',
        fileName: 'blood_test_20240315.pdf',
        fileSize: 1024000,
        fileType: 'application/pdf',
        uploadDate: new Date('2024-03-15'),
        notes: 'Complete blood count and lipid profile'
      }
    ],
    lastUpdated: new Date('2024-03-15'),
    createdBy: 'Dr. Sarah Johnson',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    patientId: '2',
    patientName: 'Jane Smith',
    diagnoses: [
      {
        id: 'd3',
        patientId: '2',
        doctorId: '2',
        doctorName: 'Dr. Michael Chen',
        date: new Date('2024-03-14'),
        diagnosis: 'Migraine',
        symptoms: ['Severe headache', 'Nausea', 'Light sensitivity'],
        notes: 'Patient experiences migraines 2-3 times per month',
        severity: 'moderate',
        status: 'active'
      }
    ],
    prescriptions: [
      {
        id: 'p2',
        patientId: '2',
        doctorId: '2',
        doctorName: 'Dr. Michael Chen',
        date: new Date('2024-03-14'),
        medications: [
          {
            name: 'Sumatriptan',
            dosage: '50mg',
            frequency: 'At onset of migraine',
            duration: 'As needed',
            instructions: 'Take at first sign of migraine'
          },
          {
            name: 'Propranolol',
            dosage: '40mg',
            frequency: 'Twice daily',
            duration: '90 days',
            instructions: 'Take consistently for prevention'
          }
        ],
        notes: 'Preventive therapy started',
        refills: 3,
        pharmacy: 'HealthPlus Pharmacy'
      }
    ],
    files: [],
    lastUpdated: new Date('2024-03-14'),
    createdBy: 'Dr. Michael Chen',
    createdAt: new Date('2024-02-01')
  }
];

export default function EMRPage() {
  const [patients] = useState<Patient[]>(mockPatients);
  const [doctors] = useState<Doctor[]>(mockDoctors);
  const [emrRecords, setEmrRecords] = useState<EMRRecord[]>(mockEMRData);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<EMRRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDiagnosisModal, setShowDiagnosisModal] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [showFileUploadModal, setShowFileUploadModal] = useState(false);
  const [showEMRView, setShowEMRView] = useState(false);
  const [activeTab, setActiveTab] = useState<'diagnoses' | 'prescriptions' | 'files'>('diagnoses');
  const [formData, setFormData] = useState({
    diagnosis: {
      diagnosis: '',
      symptoms: '',
      notes: '',
      severity: 'moderate' as const,
      status: 'active' as const
    },
    prescription: {
      medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
      notes: '',
      refills: 0,
      pharmacy: ''
    }
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Filter patients
  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm)
  );

  const handleSelectPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    const record = emrRecords.find(r => r.patientId === patient.id);
    setSelectedRecord(record || null);
    setShowEMRView(true);
  };

  const handleAddDiagnosis = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !selectedRecord) {
      toast.error('Please select a patient first');
      return;
    }

    const newDiagnosis: Diagnosis = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      doctorId: '1', // Current doctor ID
      doctorName: 'Dr. Sarah Johnson', // Current doctor name
      date: new Date(),
      diagnosis: formData.diagnosis.diagnosis,
      symptoms: formData.diagnosis.symptoms.split(',').map(s => s.trim()),
      notes: formData.diagnosis.notes,
      severity: formData.diagnosis.severity,
      status: formData.diagnosis.status
    };

    const updatedRecord = {
      ...selectedRecord,
      diagnoses: [...selectedRecord.diagnoses, newDiagnosis],
      lastUpdated: new Date()
    };

    setEmrRecords(emrRecords.map(r => 
      r.id === selectedRecord.id ? updatedRecord : r
    ));
    setSelectedRecord(updatedRecord);
    
    toast.success('Diagnosis added successfully!');
    setShowDiagnosisModal(false);
    setFormData({
      ...formData,
      diagnosis: { diagnosis: '', symptoms: '', notes: '', severity: 'moderate', status: 'active' }
    });
  };

  const handleAddPrescription = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !selectedRecord) {
      toast.error('Please select a patient first');
      return;
    }

    const newPrescription: Prescription = {
      id: Date.now().toString(),
      patientId: selectedPatient.id,
      doctorId: '1',
      doctorName: 'Dr. Sarah Johnson',
      date: new Date(),
      medications: formData.prescription.medications,
      notes: formData.prescription.notes,
      refills: formData.prescription.refills,
      pharmacy: formData.prescription.pharmacy
    };

    const updatedRecord = {
      ...selectedRecord,
      prescriptions: [...selectedRecord.prescriptions, newPrescription],
      lastUpdated: new Date()
    };

    setEmrRecords(emrRecords.map(r => 
      r.id === selectedRecord.id ? updatedRecord : r
    ));
    setSelectedRecord(updatedRecord);
    
    toast.success('Prescription added successfully!');
    setShowPrescriptionModal(false);
    setFormData({
      ...formData,
      prescription: {
        medications: [{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }],
        notes: '',
        refills: 0,
        pharmacy: ''
      }
    });
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPatient || !selectedRecord || uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    // Simulate file upload
    const newFiles: MedicalFile[] = uploadedFiles.map((file, index) => ({
      id: Date.now().toString() + index,
      patientId: selectedPatient.id,
      doctorId: '1',
      doctorName: 'Dr. Sarah Johnson',
      name: file.name,
      type: getFileType(file.name),
      fileUrl: URL.createObjectURL(file),
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
      uploadDate: new Date(),
      notes: ''
    }));

    const updatedRecord = {
      ...selectedRecord,
      files: [...selectedRecord.files, ...newFiles],
      lastUpdated: new Date()
    };

    setEmrRecords(emrRecords.map(r => 
      r.id === selectedRecord.id ? updatedRecord : r
    ));
    setSelectedRecord(updatedRecord);
    
    toast.success(`${uploadedFiles.length} file(s) uploaded successfully!`);
    setShowFileUploadModal(false);
    setUploadedFiles([]);
  };

  const getFileType = (fileName: string): MedicalFile['type'] => {
    if (fileName.toLowerCase().includes('lab') || fileName.toLowerCase().includes('blood')) return 'lab_report';
    if (fileName.toLowerCase().includes('xray') || fileName.toLowerCase().includes('mri')) return 'imaging';
    if (fileName.toLowerCase().includes('prescription')) return 'prescription';
    if (fileName.toLowerCase().includes('discharge')) return 'discharge_summary';
    return 'other';
  };

  const handleDeleteDiagnosis = (diagnosisId: string) => {
    if (window.confirm('Are you sure you want to delete this diagnosis?')) {
      const updatedRecord = {
        ...selectedRecord!,
        diagnoses: selectedRecord!.diagnoses.filter(d => d.id !== diagnosisId),
        lastUpdated: new Date()
      };
      setEmrRecords(emrRecords.map(r => 
        r.id === selectedRecord!.id ? updatedRecord : r
      ));
      setSelectedRecord(updatedRecord);
      toast.success('Diagnosis deleted successfully!');
    }
  };

  const handleDeletePrescription = (prescriptionId: string) => {
    if (window.confirm('Are you sure you want to delete this prescription?')) {
      const updatedRecord = {
        ...selectedRecord!,
        prescriptions: selectedRecord!.prescriptions.filter(p => p.id !== prescriptionId),
        lastUpdated: new Date()
      };
      setEmrRecords(emrRecords.map(r => 
        r.id === selectedRecord!.id ? updatedRecord : r
      ));
      setSelectedRecord(updatedRecord);
      toast.success('Prescription deleted successfully!');
    }
  };

  const handleDeleteFile = (fileId: string) => {
    if (window.confirm('Are you sure you want to delete this file?')) {
      const updatedRecord = {
        ...selectedRecord!,
        files: selectedRecord!.files.filter(f => f.id !== fileId),
        lastUpdated: new Date()
      };
      setEmrRecords(emrRecords.map(r => 
        r.id === selectedRecord!.id ? updatedRecord : r
      ));
      setSelectedRecord(updatedRecord);
      toast.success('File deleted successfully!');
    }
  };

  const addMedicationField = () => {
    setFormData({
      ...formData,
      prescription: {
        ...formData.prescription,
        medications: [...formData.prescription.medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]
      }
    });
  };

  const removeMedicationField = (index: number) => {
    setFormData({
      ...formData,
      prescription: {
        ...formData.prescription,
        medications: formData.prescription.medications.filter((_, i) => i !== index)
      }
    });
  };

  const updateMedication = (index: number, field: string, value: string) => {
    const updatedMedications = [...formData.prescription.medications];
    updatedMedications[index] = { ...updatedMedications[index], [field]: value };
    setFormData({
      ...formData,
      prescription: { ...formData.prescription, medications: updatedMedications }
    });
  };

  const getSeverityColor = (severity: string) => {
    switch(severity) {
      case 'mild': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'severe': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getFileIcon = (type: string) => {
    switch(type) {
      case 'lab_report': return <Microscope className="h-5 w-5" />;
      case 'imaging': return <FileImage className="h-5 w-5" />;
      case 'prescription': return <Pill className="h-5 w-5" />;
      default: return <File className="h-5 w-5" />; // Changed from FilePdf to File
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <div className="p-4 lg:p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Electronic Medical Records (EMR)</h1>
              <p className="text-gray-600 mt-2">Manage patient medical records, diagnoses, prescriptions, and documents</p>
            </div>

            {/* Patient Selection */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Select Patient</h2>
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by patient name or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredPatients.map(patient => (
                  <button
                    key={patient.id}
                    onClick={() => handleSelectPatient(patient)}
                    className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition-all text-left"
                  >
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                      {patient.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-800">{patient.name}</div>
                      <div className="text-sm text-gray-500">{patient.phone}</div>
                      <div className="text-xs text-gray-400">Age: {patient.age} | {patient.gender}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* EMR View Modal */}
            {showEMRView && selectedPatient && selectedRecord && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
                <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-auto">
                  <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold">
                        {selectedPatient.name.charAt(0)}
                      </div>
                      <div>
                        <h2 className="text-xl font-bold">{selectedPatient.name}</h2>
                        <p className="text-sm text-gray-500">Patient ID: {selectedPatient.id}</p>
                      </div>
                    </div>
                    <button onClick={() => setShowEMRView(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-6 border-b border-gray-200 flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowDiagnosisModal(true)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Diagnosis
                    </button>
                    <button
                      onClick={() => setShowPrescriptionModal(true)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Prescription
                    </button>
                    <button
                      onClick={() => setShowFileUploadModal(true)}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Upload File
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200">
                    <div className="flex gap-4 px-6">
                      <button
                        onClick={() => setActiveTab('diagnoses')}
                        className={`py-3 px-2 font-medium transition-colors relative ${
                          activeTab === 'diagnoses'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4" />
                          Diagnoses ({selectedRecord.diagnoses.length})
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('prescriptions')}
                        className={`py-3 px-2 font-medium transition-colors relative ${
                          activeTab === 'prescriptions'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Pill className="h-4 w-4" />
                          Prescriptions ({selectedRecord.prescriptions.length})
                        </div>
                      </button>
                      <button
                        onClick={() => setActiveTab('files')}
                        className={`py-3 px-2 font-medium transition-colors relative ${
                          activeTab === 'files'
                            ? 'text-blue-600 border-b-2 border-blue-600'
                            : 'text-gray-600 hover:text-gray-800'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          Medical Files ({selectedRecord.files.length})
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    {activeTab === 'diagnoses' && (
                      <div className="space-y-4">
                        {selectedRecord.diagnoses.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No diagnoses recorded</p>
                          </div>
                        ) : (
                          selectedRecord.diagnoses.map(diagnosis => (
                            <div key={diagnosis.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold text-gray-800">{diagnosis.diagnosis}</h3>
                                  <div className="flex items-center gap-2 mt-1">
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getSeverityColor(diagnosis.severity)}`}>
                                      {diagnosis.severity}
                                    </span>
                                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                      diagnosis.status === 'active' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                      {diagnosis.status}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteDiagnosis(diagnosis.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="space-y-2 text-sm">
                                <div>
                                  <span className="text-gray-500">Doctor:</span> {diagnosis.doctorName}
                                </div>
                                <div>
                                  <span className="text-gray-500">Date:</span> {new Date(diagnosis.date).toLocaleDateString()}
                                </div>
                                <div>
                                  <span className="text-gray-500">Symptoms:</span> {diagnosis.symptoms.join(', ')}
                                </div>
                                <div>
                                  <span className="text-gray-500">Notes:</span> {diagnosis.notes}
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === 'prescriptions' && (
                      <div className="space-y-4">
                        {selectedRecord.prescriptions.length === 0 ? (
                          <div className="text-center py-12 text-gray-500">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No prescriptions recorded</p>
                          </div>
                        ) : (
                          selectedRecord.prescriptions.map(prescription => (
                            <div key={prescription.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h3 className="font-semibold text-gray-800">Prescription</h3>
                                  <div className="text-sm text-gray-500 mt-1">
                                    By: {prescription.doctorName} | Date: {new Date(prescription.date).toLocaleDateString()}
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeletePrescription(prescription.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="space-y-3">
                                <div>
                                  <span className="text-gray-500">Medications:</span>
                                  <div className="mt-2 space-y-2">
                                    {prescription.medications.map((med, idx) => (
                                      <div key={idx} className="bg-gray-50 p-3 rounded">
                                        <p className="font-medium">{med.name}</p>
                                        <p className="text-sm">Dosage: {med.dosage}</p>
                                        <p className="text-sm">Frequency: {med.frequency}</p>
                                        <p className="text-sm">Duration: {med.duration}</p>
                                        <p className="text-sm">Instructions: {med.instructions}</p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                                {prescription.notes && (
                                  <div>
                                    <span className="text-gray-500">Notes:</span>
                                    <p className="text-sm mt-1">{prescription.notes}</p>
                                  </div>
                                )}
                                <div className="text-sm">
                                  <span className="text-gray-500">Refills:</span> {prescription.refills}
                                </div>
                                {prescription.pharmacy && (
                                  <div className="text-sm">
                                    <span className="text-gray-500">Pharmacy:</span> {prescription.pharmacy}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}

                    {activeTab === 'files' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {selectedRecord.files.length === 0 ? (
                          <div className="col-span-full text-center py-12 text-gray-500">
                            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                            <p>No files uploaded</p>
                          </div>
                        ) : (
                          selectedRecord.files.map(file => (
                            <div key={file.id} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className="text-blue-600">
                                    {getFileIcon(file.type)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-gray-800 text-sm">{file.name}</h4>
                                    <p className="text-xs text-gray-500">{formatFileSize(file.fileSize)}</p>
                                  </div>
                                </div>
                                <button
                                  onClick={() => handleDeleteFile(file.id)}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              </div>
                              <div className="text-xs text-gray-500 mb-3">
                                Uploaded: {new Date(file.uploadDate).toLocaleDateString()}
                              </div>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => window.open(file.fileUrl, '_blank')}
                                  className="flex-1 px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors flex items-center justify-center gap-1"
                                >
                                  <Eye className="h-3 w-3" />
                                  View
                                </button>
                                <button
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = file.fileUrl;
                                    link.download = file.fileName;
                                    link.click();
                                  }}
                                  className="flex-1 px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                                >
                                  <Download className="h-3 w-3" />
                                  Download
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Add Diagnosis Modal */}
            {showDiagnosisModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-2xl w-full">
                  <div className="border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add Diagnosis</h2>
                    <button onClick={() => setShowDiagnosisModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleAddDiagnosis} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Diagnosis *</label>
                      <input
                        type="text"
                        required
                        value={formData.diagnosis.diagnosis}
                        onChange={(e) => setFormData({
                          ...formData,
                          diagnosis: { ...formData.diagnosis, diagnosis: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Hypertension, Diabetes, etc."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms (comma-separated)</label>
                      <input
                        type="text"
                        value={formData.diagnosis.symptoms}
                        onChange={(e) => setFormData({
                          ...formData,
                          diagnosis: { ...formData.diagnosis, symptoms: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="e.g., Headache, Fever, Cough"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={formData.diagnosis.notes}
                        onChange={(e) => setFormData({
                          ...formData,
                          diagnosis: { ...formData.diagnosis, notes: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        rows={3}
                        placeholder="Additional notes about the diagnosis..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Severity</label>
                        <select
                          value={formData.diagnosis.severity}
                          onChange={(e) => setFormData({
                            ...formData,
                            diagnosis: { ...formData.diagnosis, severity: e.target.value as any }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                          <option value="critical">Critical</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                          value={formData.diagnosis.status}
                          onChange={(e) => setFormData({
                            ...formData,
                            diagnosis: { ...formData.diagnosis, status: e.target.value as any }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        >
                          <option value="active">Active</option>
                          <option value="resolved">Resolved</option>
                          <option value="chronic">Chronic</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Add Diagnosis
                      </button>
                      <button type="button" onClick={() => setShowDiagnosisModal(false)} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Add Prescription Modal */}
            {showPrescriptionModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-auto">
                <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
                  <div className="border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Add Prescription</h2>
                    <button onClick={() => setShowPrescriptionModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleAddPrescription} className="p-6 space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="block text-sm font-medium text-gray-700">Medications *</label>
                        <button
                          type="button"
                          onClick={addMedicationField}
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          + Add Medication
                        </button>
                      </div>
                      {formData.prescription.medications.map((med, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                          <div className="flex justify-between items-start mb-3">
                            <h4 className="font-medium">Medication {index + 1}</h4>
                            {index > 0 && (
                              <button
                                type="button"
                                onClick={() => removeMedicationField(index)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              placeholder="Medication name"
                              value={med.name}
                              onChange={(e) => updateMedication(index, 'name', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Dosage (e.g., 10mg)"
                              value={med.dosage}
                              onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Frequency (e.g., Twice daily)"
                              value={med.frequency}
                              onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Duration (e.g., 7 days)"
                              value={med.duration}
                              onChange={(e) => updateMedication(index, 'duration', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                              required
                            />
                            <input
                              type="text"
                              placeholder="Instructions (e.g., Take with food)"
                              value={med.instructions}
                              onChange={(e) => updateMedication(index, 'instructions', e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all col-span-2"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                      <textarea
                        value={formData.prescription.notes}
                        onChange={(e) => setFormData({
                          ...formData,
                          prescription: { ...formData.prescription, notes: e.target.value }
                        })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        rows={3}
                        placeholder="Additional instructions or notes..."
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Refills</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.prescription.refills}
                          onChange={(e) => setFormData({
                            ...formData,
                            prescription: { ...formData.prescription, refills: parseInt(e.target.value) }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pharmacy (Optional)</label>
                        <input
                          type="text"
                          value={formData.prescription.pharmacy}
                          onChange={(e) => setFormData({
                            ...formData,
                            prescription: { ...formData.prescription, pharmacy: e.target.value }
                          })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                          placeholder="Preferred pharmacy"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="flex-1 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                        Add Prescription
                      </button>
                      <button type="button" onClick={() => setShowPrescriptionModal(false)} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* File Upload Modal */}
            {showFileUploadModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-lg max-w-lg w-full">
                  <div className="border-b border-gray-200 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Upload Medical File</h2>
                    <button onClick={() => setShowFileUploadModal(false)} className="text-gray-400 hover:text-gray-600">
                      <X className="h-6 w-6" />
                    </button>
                  </div>
                  <form onSubmit={handleFileUpload} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Select Files</label>
                      <input
                        ref={fileInputRef}
                        type="file"
                        multiple
                        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                        onChange={(e) => setUploadedFiles(Array.from(e.target.files || []))}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                      />
                      <p className="text-xs text-gray-500 mt-1">Supported formats: PDF, JPG, PNG, DOC (Max 10MB)</p>
                    </div>
                    {uploadedFiles.length > 0 && (
                      <div className="border border-gray-200 rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Selected Files:</h4>
                        <ul className="space-y-1">
                          {uploadedFiles.map((file, idx) => (
                            <li key={idx} className="text-sm text-gray-600 flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              {file.name} ({formatFileSize(file.size)})
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    <div className="flex gap-3 pt-4">
                      <button type="submit" className="flex-1 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                        Upload Files
                      </button>
                      <button type="button" onClick={() => setShowFileUploadModal(false)} className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors">
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}