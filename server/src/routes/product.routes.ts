import { Router } from 'express';
import { body } from 'express-validator';
import multer from 'multer';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories,
} from '../controllers/product.controller';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';

const router = Router();

// Multer setup for image upload
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, process.env.UPLOAD_DIR || 'uploads');
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${uuidv4()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: Number(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

/**
 * @swagger
 * /products:
 *   get:
 *     tags: [Products]
 *     summary: Get all products with search, filter, pagination
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of products
 */
router.get('/', authMiddleware, getProducts);

/**
 * @swagger
 * /products/categories:
 *   get:
 *     tags: [Products]
 *     summary: Get all unique categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', authMiddleware, getCategories);

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get a single product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Not found
 */
router.get('/:id', authMiddleware, getProductById);

/**
 * @swagger
 * /products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product (Admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [name, category, quantity, price]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               quantity:
 *                 type: number
 *               price:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created
 */
router.post(
  '/',
  authMiddleware,
  adminOnly,
  upload.single('image'),
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('quantity').isNumeric().withMessage('Quantity must be a number'),
    body('price').isNumeric().withMessage('Price must be a number'),
  ],
  createProduct
);

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update a product (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product updated
 */
router.put('/:id', authMiddleware, adminOnly, upload.single('image'), updateProduct);

/**
 * @swagger
 * /products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete a product (Admin only)
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted
 */
router.delete('/:id', authMiddleware, adminOnly, deleteProduct);

export default router;
