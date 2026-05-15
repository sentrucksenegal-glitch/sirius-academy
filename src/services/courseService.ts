import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  where, 
  orderBy,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Course, COURSES } from '@/types';

const COLLECTION_NAME = 'courses';

export const courseService = {
  async getCourses(onlyVisible = false): Promise<Course[]> {
    try {
      let q = query(collection(db, COLLECTION_NAME), orderBy('order', 'asc'));
      if (onlyVisible) {
        q = query(collection(db, COLLECTION_NAME), where('visible', '==', true), orderBy('order', 'asc'));
      }
      const snapshot = await getDocs(q);
      
      // If collection is empty, seed it with default courses then return them
      if (snapshot.empty) {
        await this.seedCourses();
        return this.getCourses(onlyVisible);
      }

      return snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Course[];
    } catch (error) {
      console.error("Error fetching courses:", error);
      return [];
    }
  },

  async getCourse(id: string): Promise<Course | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Course;
      }
      return null;
    } catch (error) {
      console.error("Error fetching course:", error);
      return null;
    }
  },

  async addCourse(course: Omit<Course, 'id'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(db, COLLECTION_NAME), course);
      return docRef.id;
    } catch (error) {
      console.error("Error adding course:", error);
      throw error;
    }
  },

  async updateCourse(id: string, updates: Partial<Course>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error("Error updating course:", error);
      throw error;
    }
  },

  async deleteCourse(id: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error("Error deleting course:", error);
      throw error;
    }
  },

  async toggleVisibility(id: string, currentVisibility: boolean): Promise<void> {
    return this.updateCourse(id, { visible: !currentVisibility });
  },

  async seedCourses(): Promise<void> {
    try {
      for (const course of COURSES) {
        const { id, ...courseData } = course;
        await setDoc(doc(db, COLLECTION_NAME, id), courseData);
      }
      console.log("Courses seeded successfully");
    } catch (error) {
      console.error("Error seeding courses:", error);
    }
  }
};
