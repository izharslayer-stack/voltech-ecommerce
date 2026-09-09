import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken } from '@/lib/jwt';

export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization') ?? '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });

  const payload = await verifyToken<{ sub: string }>(token);
  if (!payload) return NextResponse.json({ error: 'Invalid or expired token.' }, { status: 401 });

  const customer = await db.customer.findUnique({ where: { id: payload.sub } });
  if (!customer) return NextResponse.json({ error: 'User not found.' }, { status: 404 });

  return NextResponse.json({
    id: customer.id,
    email: customer.email,
    firstName: customer.firstName,
    lastName: customer.lastName,
    createdAt: customer.createdAt.toISOString(),
  });
}
