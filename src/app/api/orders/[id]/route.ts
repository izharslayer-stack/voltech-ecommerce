import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// GET /api/orders/[id]
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth  = req.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const payload = token ? await verifyToken<{ sub: string }>(token) : null;

    const order = await db.order.findUnique({
      where: { id: params.id },
      include: { items: { include: { product: true } } },
    });

    if (!order) return NextResponse.json({ error: 'Order not found.' }, { status: 404 });

    // Only the owner or admin can see the order
    if (payload?.sub !== order.customerId) {
      return NextResponse.json({ error: 'Forbidden.' }, { status: 403 });
    }

    return NextResponse.json(order);
  } catch (err) {
    console.error('[GET /api/orders/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// PATCH /api/orders/[id] — update status (admin)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await req.json();
    const order = await db.order.update({
      where: { id: params.id },
      data: { status },
    });
    return NextResponse.json(order);
  } catch (err) {
    console.error('[PATCH /api/orders/[id]]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
