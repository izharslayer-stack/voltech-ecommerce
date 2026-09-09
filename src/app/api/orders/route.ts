import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

// GET /api/orders — returns orders for authenticated customer
export async function GET(req: NextRequest) {
  try {
    const auth  = req.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const payload = token ? await verifyToken<{ sub: string }>(token) : null;

    if (!payload) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

    const orders = await db.order.findMany({
      where: { customerId: payload.sub },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ orders });
  } catch (err) {
    console.error('[GET /api/orders]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST /api/orders — create a new order (guest or authenticated)
export async function POST(req: NextRequest) {
  try {
    const auth  = req.headers.get('authorization') ?? '';
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
    const payload = token ? await verifyToken<{ sub: string }>(token) : null;

    const body = await req.json();
    const { id, items, customer, shipping, subtotal, shippingCost, total } = body;

    if (!id || !items || !customer || !shipping) {
      return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
    }

    const order = await db.order.create({
      data: {
        id,
        customerId:      payload?.sub ?? null,
        customerName:    customer.name,
        customerEmail:   customer.email,
        customerPhone:   customer.phone ?? null,
        shippingAddress: shipping.address,
        shippingCity:    shipping.city,
        shippingState:   shipping.state ?? null,
        shippingPostal:  shipping.postalCode,
        shippingCountry: shipping.country,
        subtotal,
        shippingCost:    shippingCost ?? 0,
        total,
        status:          'pending',
        items: {
          create: items.map((item: {
            product: { id: string; name: string; image: string; category: string; price: number };
            quantity: number;
          }) => ({
            productId:       item.product.id,
            productName:     item.product.name,
            productImage:    item.product.image,
            productCategory: item.product.category,
            unitPrice:       item.product.price,
            quantity:        item.quantity,
          })),
        },
      },
      include: { items: true },
    });

    return NextResponse.json(order, { status: 201 });
  } catch (err) {
    console.error('[POST /api/orders]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
