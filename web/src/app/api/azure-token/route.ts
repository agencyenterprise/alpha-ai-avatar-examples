import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const speechKey = process.env.AZURE_SPEECH_KEY ?? '';
    const speechRegion = process.env.AZURE_SPEECH_REGION ?? '';

    const headers = {
      'Ocp-Apim-Subscription-Key': speechKey,
      'Content-Type': 'application/x-www-form-urlencoded',
    };

    const response = await fetch(`https://${speechRegion}.api.cognitive.microsoft.com/sts/v1.0/issueToken`, {
      method: 'POST',
      headers: headers,
    });

    const tokenResponse = await response.text();
    return NextResponse.json({ token: tokenResponse, region: speechRegion });
  } catch (error: unknown) {
    return NextResponse.json({ error: (error as Error).message }, { status: 400 });
  }
}

export const dynamic = 'force-dynamic';
