import { NextResponse } from 'next/server';

export function successResponse<T>(data: T, meta?: Record<string, unknown>) {
  return NextResponse.json(
    { data, meta: { dataset_validated: process.env.NEXT_PUBLIC_DATASET_VALIDATED === 'true', ...meta } },
    { 
      status: 200,
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' }
    }
  );
}

export function errorResponse(message: string, status: number) {
  return NextResponse.json(
    { error: message, status },
    { status }
  );
}
