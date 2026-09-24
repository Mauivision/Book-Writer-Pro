import { NextResponse } from 'next/server';
import {
  ACCESS_COOKIE_NAME,
  isAccessGateEnabled,
  isValidSessionToken,
} from '@/utils/accessGate';
import { cookies } from 'next/headers';

export async function GET() {
  const gateEnabled = isAccessGateEnabled();
  if (!gateEnabled) {
    return NextResponse.json({
      gateEnabled: false,
      authenticated: true,
    });
  }

  const token = cookies().get(ACCESS_COOKIE_NAME)?.value;
  return NextResponse.json({
    gateEnabled: true,
    authenticated: await isValidSessionToken(token),
  });
}
