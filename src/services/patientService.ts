import { db } from '@/lib/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { Patient } from '@/types';  // Change this line

const COLLECTION_NAME = 'patients';

export const patientService = {
  // Get all patients
  async getAllPatients(): Promise<Patient[]> {
    const q = query(collection(db, COLLECTION_NAME), orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
  },

  // Get patient by ID
  async getPatientById(id: string): Promise<Patient | null> {
    const docRef = doc(db, COLLECTION_NAME, id);
    const snapshot = await getDocs(query(collection(db, COLLECTION_NAME), where('id', '==', id)));
    if (snapshot.empty) return null;
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Patient;
  },

  // Add new patient
  async addPatient(patient: Omit<Patient, 'id' | 'createdAt'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...patient,
      createdAt: Timestamp.now(),
      lastVisit: new Date().toISOString().split('T')[0]
    });
    return docRef.id;
  },

  // Update patient
  async updatePatient(id: string, patient: Partial<Patient>): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, patient);
  },

  // Delete patient
  async deletePatient(id: string): Promise<void> {
    const docRef = doc(db, COLLECTION_NAME, id);
    await deleteDoc(docRef);
  },

  // Search patients
  async searchPatients(searchTerm: string): Promise<Patient[]> {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('name', '>=', searchTerm),
      where('name', '<=', searchTerm + '\uf8ff')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Patient));
  }
};