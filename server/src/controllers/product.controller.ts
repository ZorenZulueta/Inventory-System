import { Request, Response } from 'express';
import { db } from '../config/firebase';
import { Product } from '../types';
import { v4 as uuidv4 } from 'uuid';

const COLLECTION = 'products';

// GET /api/products  — list with search, filter, pagination
export const getProducts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { search, category, page = '1', limit = '10' } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);

    let query: FirebaseFirestore.Query = db.collection(COLLECTION);

    if (category && category !== '') {
      query = query.where('category', '==', category);
    }

    const snapshot = await query.get();
    let products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Product[];
    products.sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    // Search by name (client-side, Firestore free tier doesn't support full-text)
    if (search) {
      const searchLower = (search as string).toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    const total = products.length;
    const start = (pageNum - 1) * limitNum;
    const paginated = products.slice(start, start + limitNum);

    res.json({
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

// GET /api/products/:id
export const getProductById = async (req: Request, res: Response): Promise<void> => {
  try {
    const doc = await db.collection(COLLECTION).doc(req.params.id).get();
    if (!doc.exists) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch product' });
  }
};

// POST /api/products
export const createProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, category, quantity, price } = req.body;

    const imageUrl = req.file
      ? `/uploads/${req.file.filename}`
      : '';

    const product: Omit<Product, 'id'> = {
      name,
      description,
      category,
      quantity: Number(quantity),
      price: Number(price),
      imageUrl,
      createdBy: req.user!.uid,
      createdAt: undefined,
      updatedAt: undefined,
    };

    const docRef = await db.collection(COLLECTION).add({
      ...product,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    res.status(201).json({ id: docRef.id, ...product, message: 'Product created' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to create product' });
  }
};

// PUT /api/products/:id
export const updateProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    const { name, description, category, quantity, price } = req.body;
    const updates: Partial<Product> = {};

    if (name !== undefined) updates.name = name;
    if (description !== undefined) updates.description = description;
    if (category !== undefined) updates.category = category;
    if (quantity !== undefined) updates.quantity = Number(quantity);
    if (price !== undefined) updates.price = Number(price);
    if (req.file) updates.imageUrl = `/uploads/${req.file.filename}`;

    await docRef.update({ ...updates, updatedAt: new Date() });

    res.json({ message: 'Product updated', id: req.params.id, ...updates });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update product' });
  }
};

// DELETE /api/products/:id
export const deleteProduct = async (req: Request, res: Response): Promise<void> => {
  try {
    const docRef = db.collection(COLLECTION).doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    await docRef.delete();
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete product' });
  }
};

// GET /api/products/categories  — unique categories list
export const getCategories = async (_req: Request, res: Response): Promise<void> => {
  try {
    const snapshot = await db.collection(COLLECTION).get();
    const categories = [...new Set(snapshot.docs.map(d => d.data().category as string))];
    res.json(categories.filter(Boolean));
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch categories' });
  }
};


