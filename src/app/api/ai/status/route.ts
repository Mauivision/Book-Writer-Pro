import { NextResponse } from 'next/server';
import { publicProviderStatus } from '@/utils/aiGateway';
import { isAccessGateEnabled } from '@/utils/accessGate';
import { sanitizeClientProviderConfig } from '@/utils/aiProvider';
import type { AIProviderConfig } from '@/utils/aiProvider';

export async function GET() {
  return NextResponse.json({
    ...publicProviderStatus(),
    gateEnabled: isAccessGateEnabled(),
  });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    providerConfig?: Partial<AIProviderConfig>;
  };
  return NextResponse.json({
    ...publicProviderStatus(sanitizeClientProviderConfig(body.providerConfig)),
    gateEnabled: isAccessGateEnabled(),
  });
}
