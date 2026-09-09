import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET /api/products?category=&featured=&status=&search=&limit=&page=
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const category = searchParams.get('category') ?? undefined;
    const featured  = searchParams.get('featured');
    const status    = searchParams.get('status') ?? 'active';
    const search    = searchParams.get('search') ?? undefined;
    const limit     = Math.min(parseInt(searchParams.get('limit') ?? '50'), 100);
    const page      = Math.max(parseInt(searchParams.get('page') ?? '1'), 1);

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (featured === 'true') where.featured = true;
    if (status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [products, total] = await Promise.all([
      db.product.findMany({
        where,
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
        take: limit,
        skip: (page - 1) * limit,
      }),
      db.product.count({ where }),
    ]);

    return NextResponse.json({ products, total, page, limit });
  } catch (err) {
    console.error('[GET /api/products]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

// POST /api/products  (admin only — no auth middleware yet, add later)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const product = await db.product.create({ data: body });
    return NextResponse.json(product, { status: 201 });
  } catch (err) {
    console.error('[POST /api/products]', err);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
