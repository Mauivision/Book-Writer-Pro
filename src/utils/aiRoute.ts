import { NextResponse } from 'next/server';

export function aiErrorResponse(error: unknown, fallback: string, status = 502) {
  const message =
    error instanceof Error && error.message.trim() ? error.message : fallback;
  return NextResponse.json({ error: message }, { status });
}
