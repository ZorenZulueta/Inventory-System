import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';
import { db } from '../config/firebase';

const router = Router();

// GET /api/orders/stats — Admin dashboard stats
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    // get all from Firestore
    const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
      db.collection('orders').get(),
      db.collection('products').get(),
      db.collection('users').get(),
    ]);

    const orders = ordersSnap.docs.map(d => d.data());
    const products = productsSnap.docs.map(d => d.data());

    const totalRevenue = orders
      .filter(o => o.status !== 'cancelled')
      .reduce((s, o) => s + (o.totalAmount || 0), 0);

    const recentOrders = [...orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    const lowStockItems = products
      .filter(p => p.status === 'low_stock' || p.status === 'out_of_stock')
      .slice(0, 5);

    res.json({
      stats: {
        totalOrders: orders.length,
        totalProducts: products.length,
        totalUsers: usersSnap.size,
        totalRevenue,
        pendingOrders: orders.filter(o => o.status === 'pending').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        lowStockProducts: products.filter(p => p.status === 'low_stock').length,
        outOfStockProducts: products.filter(p => p.status === 'out_of_stock').length,
      },
      recentOrders,
      lowStockItems,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;