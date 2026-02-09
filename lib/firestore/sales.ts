import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  onSnapshot,
  Unsubscribe,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Sale } from '@/types';

const COLLECTION_NAME = 'sales';

// Convert Firestore timestamp to Date
const convertTimestamp = (data: any) => {
  if (data?.createdAt && data.createdAt.toDate) {
    data.createdAt = data.createdAt.toDate();
  }
  return data;
};

// Create a new sale
export const createSale = async (
  saleData: Omit<Sale, 'id' | 'createdAt'>
): Promise<string> => {
  try {
    const newSale = {
      ...saleData,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newSale);
    return docRef.id;
  } catch (error) {
    console.error('Error creating sale:', error);
    throw error;
  }
};

// Get a sale by ID
export const getSale = async (saleId: string): Promise<Sale | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, saleId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    return {
      id: docSnap.id,
      ...convertTimestamp(docSnap.data()),
    } as Sale;
  } catch (error) {
    console.error('Error getting sale:', error);
    throw error;
  }
};

// Get all sales for a project
export const getProjectSales = async (
  projectId: string,
  limitCount?: number
): Promise<Sale[]> => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const sales: Sale[] = [];

    querySnapshot.forEach((doc) => {
      sales.push({
        id: doc.id,
        ...convertTimestamp(doc.data()),
      } as Sale);
    });

    return sales;
  } catch (error) {
    console.error('Error getting project sales:', error);
    throw error;
  }
};

// Get sales by seller
export const getSalesBySeller = async (
  projectId: string,
  soldBy: string,
  limitCount?: number
): Promise<Sale[]> => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId),
      where('soldBy', '==', soldBy),
      orderBy('createdAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    const querySnapshot = await getDocs(q);
    const sales: Sale[] = [];

    querySnapshot.forEach((doc) => {
      sales.push({
        id: doc.id,
        ...convertTimestamp(doc.data()),
      } as Sale);
    });

    return sales;
  } catch (error) {
    console.error('Error getting sales by seller:', error);
    throw error;
  }
};

// Real-time listener for project sales
export const subscribeToProjectSales = (
  projectId: string,
  callback: (sales: Sale[]) => void,
  limitCount?: number
): Unsubscribe => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId),
      orderBy('createdAt', 'desc')
    );

    if (limitCount) {
      q = query(q, limit(limitCount));
    }

    return onSnapshot(q, (querySnapshot) => {
      const sales: Sale[] = [];
      querySnapshot.forEach((doc) => {
        sales.push({
          id: doc.id,
          ...convertTimestamp(doc.data()),
        } as Sale);
      });
      callback(sales);
    });
  } catch (error) {
    console.error('Error subscribing to sales:', error);
    throw error;
  }
};

// Get sales statistics for a project
export const getProjectSalesStats = async (
  projectId: string,
  startDate?: Date,
  endDate?: Date
): Promise<{
  totalSales: number;
  totalRevenue: number;
  totalQuantity: number;
}> => {
  try {
    let q = query(
      collection(db, COLLECTION_NAME),
      where('projectId', '==', projectId)
    );

    if (startDate) {
      q = query(q, where('createdAt', '>=', Timestamp.fromDate(startDate)));
    }
    if (endDate) {
      q = query(q, where('createdAt', '<=', Timestamp.fromDate(endDate)));
    }

    const querySnapshot = await getDocs(q);
    let totalSales = 0;
    let totalRevenue = 0;
    let totalQuantity = 0;

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      totalSales += 1;
      totalRevenue += data.total || 0;
      totalQuantity += data.qty || 0;
    });

    return {
      totalSales,
      totalRevenue,
      totalQuantity,
    };
  } catch (error) {
    console.error('Error getting sales stats:', error);
    throw error;
  }
};
