import { Router } from 'express';
import { authMiddleware, adminOnly } from '../middleware/auth.middleware';
import { db } from '../config/firebase';

const router = Router();

// POST /api/orders
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, phone, notes, paymentMethod } = req.body;
    if (!items?.length) { res.status(400).json({ message: 'No items in order' }); return; }
    const uid = (req as any).user?.uid || (req as any).user?.id;
    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }
    const orderRef = db.collection('orders').doc();
    const order = {
      id: orderRef.id,
      orderNumber: 'ORD-' + Date.now(),
      userId: uid,
      userName: (req as any).user?.name || (req as any).user?.displayName || '',
      userEmail: (req as any).user?.email || '',
      items,
      totalAmount,
      shippingAddress,
      phone,
      notes: notes || '',
      paymentMethod: paymentMethod || 'cod',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await orderRef.set(order);
    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/my
router.get('/my', authMiddleware, async (req, res) => {
  try {
    const uid = (req as any).user?.uid || (req as any).user?.id;
    if (!uid) { res.status(401).json({ message: 'Unauthorized' }); return; }
    const snap = await db.collection('orders').where('userId', '==', uid).get();
    const orders = snap.docs
      .map(d => d.data())
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders (admin)
router.get('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const snap = await db.collection('orders').get();
    const orders = snap.docs
      .map(d => d.data())
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    res.json(orders);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/orders/:id/status (admin)
router.patch('/:id/status', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { status } = req.body;
    await db.collection('orders').doc(req.params.id).update({ status, updatedAt: new Date().toISOString() });
    res.json({ message: 'Status updated' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/orders/stats (admin)
router.get('/stats', authMiddleware, adminOnly, async (req, res) => {
  try {
    const [ordersSnap, productsSnap, usersSnap] = await Promise.all([
      db.collection('orders').get(),
      db.collection('products').get(),
      db.collection('users').get(),
    ]);
    const orders = ordersSnap.docs.map(d => d.data());
    const products = productsSnap.docs.map(d => d.data());
    const totalRevenue = orders.filter(o => o.status !== 'cancelled').reduce((s, o) => s + (o.totalAmount || 0), 0);
    const recentOrders = [...orders].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 5);
    const lowStockItems = products.filter((p: any) => p.status === 'low_stock' || p.status === 'out_of_stock').slice(0, 5);
    res.json({
      stats: {
        totalOrders: orders.length, totalProducts: products.length, totalUsers: usersSnap.size,
        totalRevenue, pendingOrders: orders.filter(o => o.status === 'pending').length,
        processingOrders: orders.filter(o => o.status === 'processing').length,
        deliveredOrders: orders.filter(o => o.status === 'delivered').length,
        cancelledOrders: orders.filter(o => o.status === 'cancelled').length,
        lowStockProducts: products.filter((p: any) => p.status === 'low_stock').length,
        outOfStockProducts: products.filter((p: any) => p.status === 'out_of_stock').length,
      },
      recentOrders,
      lowStockItems,
    });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
