import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
import {
  defaultProviderTypeFromEnv,
  publicProviderSnapshot,
  resolveServerProviderConfig,
} from '@/utils/aiGateway';
import { isAccessGateEnabled } from '@/utils/accessGate';

export async function GET() {
  try {
    const config = resolveServerProviderConfig();
    return NextResponse.json({
      ...publicProviderSnapshot(config),
      selectedBy: process.env.AI_PROVIDER?.trim()
        ? 'AI_PROVIDER'
        : 'default',
      defaultProvider: defaultProviderTypeFromEnv(),
      gateEnabled: isAccessGateEnabled(),
    });
  } catch (error) {
    return NextResponse.json(
      {
        provider: defaultProviderTypeFromEnv(),
        gateEnabled: isAccessGateEnabled(),
        error: error instanceof Error ? error.message : 'Provider is not configured.',
      },
      { status: 200 }
    );
  }
}
