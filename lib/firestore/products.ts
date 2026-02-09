import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Product } from '@/types';
import * as bcrypt from 'bcryptjs';

const COLLECTION_NAME = 'products';

// Generate unique barcode if not provided
const generateBarcode = (): string => {
  return `BC${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
};

// Convert Firestore timestamp to Date
const convertTimestamp = (data: any) => {
  if (data?.createdAt && data.createdAt.toDate) {
    data.createdAt = data.createdAt.toDate();
  }
  if (data?.updatedAt && data.updatedAt.toDate) {
    data.updatedAt = data.updatedAt.toDate();
  }
  return data;
};

// Create a new product
export const createProduct = async (
  productData: Omit<Product, 'id' | 'passwordHash' | 'createdAt' | 'updatedAt' | 'barcode'> & {
    password: string;
    barcode?: string;
    imageUrl?: string;
    imagePublicId?: string;
  }
): Promise<string> => {
  try {
    const barcode = productData.barcode || generateBarcode();
    const passwordHash = await bcrypt.hash(productData.password, 10);

    const newProduct = {
      name: productData.name,
      price: productData.price,
      stock: productData.stock,
      barcode,
      isLive: productData.isLive ?? true,
      passwordHash,
      projectId: productData.projectId,
      imageUrl: productData.imageUrl || null,
      imagePublicId: productData.imagePublicId || null,
      createdAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), newProduct);
    return docRef.id;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Get a product by ID
export const getProduct = async (productId: string): Promise<Product | null> => {
  try {
    const docRef = doc(db, COLLECTION_NAME, productId);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }

    const data = docSnap.data();
    // Don't expose passwordHash in the returned object
    const { passwordHash, ...productData } = data;

    return {
      id: docSnap.id,
      ...convertTimestamp(productData),
      passwordHash: passwordHash, // Keep for verification purposes
    } as Product;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Get all products for a project
export const getProjectProducts = async (
  projectId: string,
  liveOnly: boolean = false
): Promise<Product[]> => {
  try {
    let q;
    if (liveOnly) {
      q = query(
        collection(db, COLLECTION_NAME),
        where('projectId', '==', projectId),
        where('isLive', '==', true)
      );
    } else {
      q = query(
        collection(db, COLLECTION_NAME),
        where('projectId', '==', projectId)
      );
    }

    const querySnapshot = await getDocs(q);
    const products: Product[] = [];

    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const { passwordHash, ...productData } = data;
      products.push({
        id: doc.id,
        ...convertTimestamp(productData),
        passwordHash: passwordHash,
      } as Product);
    });

    return products;
  } catch (error) {
    console.error('Error getting project products:', error);
    throw error;
  }
};

// Update a product (requires password verification)
export const updateProduct = async (
  productId: string,
  updates: Partial<Omit<Product, 'id' | 'passwordHash'>> & {
    password?: string;
    currentPassword: string;
  }
): Promise<void> => {
  try {
    const product = await getProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(
      updates.currentPassword,
      product.passwordHash
    );

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const docRef = doc(db, COLLECTION_NAME, productId);
    const updateData: any = {
      ...updates,
      updatedAt: Timestamp.now(),
    };

    // Hash new password if provided
    if (updates.password) {
      updateData.passwordHash = await bcrypt.hash(updates.password, 10);
    }

    // Handle image fields
    if (updates.imageUrl !== undefined) {
      updateData.imageUrl = updates.imageUrl;
    }
    if (updates.imagePublicId !== undefined) {
      updateData.imagePublicId = updates.imagePublicId;
    }

    // Remove fields that shouldn't be updated
    delete updateData.currentPassword;
    delete updateData.id;
    delete updateData.passwordHash; // Keep existing if not changing

    await updateDoc(docRef, updateData);
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product (requires password verification)
export const deleteProduct = async (
  productId: string,
  password: string
): Promise<void> => {
  try {
    const product = await getProduct(productId);
    if (!product) {
      throw new Error('Product not found');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, product.passwordHash);

    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    await deleteDoc(doc(db, COLLECTION_NAME, productId));
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Verify product password
export const verifyProductPassword = async (
  productId: string,
  password: string
): Promise<boolean> => {
  try {
    const product = await getProduct(productId);
    if (!product) {
      return false;
    }

    return await bcrypt.compare(password, product.passwordHash);
  } catch (error) {
    console.error('Error verifying product password:', error);
    return false;
  }
};
