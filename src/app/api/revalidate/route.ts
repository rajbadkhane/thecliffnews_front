import { timingSafeEqual } from 'node:crypto';
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

const MAX_SLUG_LENGTH = 250;
const MAX_BODY_LENGTH = 16_384;

type RevalidationPayload = {
  slug: string;
  language: 'ENGLISH' | 'HINDI';
  categorySlug?: string;
};

function unauthorizedResponse(): NextResponse {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
}

function invalidPayloadResponse(): NextResponse {
  return NextResponse.json({ error: 'Invalid revalidation payload' }, { status: 400 });
}

function isSafeSlug(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.length <= MAX_SLUG_LENGTH &&
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/i.test(value)
  );
}

function isSecretMatch(expected: string, received: string): boolean {
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);

  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return timingSafeEqual(expectedBuffer, receivedBuffer);
}

function parsePayload(value: unknown): RevalidationPayload | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null;

  const payload = value as Record<string, unknown>;
  const { slug, language, categorySlug } = payload;
  const allowedKeys = new Set(['slug', 'language', 'categorySlug']);
  if (Object.keys(payload).some((key) => !allowedKeys.has(key))) return null;

  if (!isSafeSlug(slug)) return null;
  if (language !== 'ENGLISH' && language !== 'HINDI') return null;
  if (categorySlug !== undefined && !isSafeSlug(categorySlug)) return null;

  return {
    slug,
    language,
    ...(categorySlug !== undefined ? { categorySlug } : {}),
  };
}

function buildPaths(payload: RevalidationPayload): string[] {
  const locale = payload.language === 'ENGLISH' ? 'en' : 'hi';
  const paths = [
    `/${locale}/article/${payload.slug}`,
    `/${locale}`,
    '/',
    '/sitemap.xml',
    '/news-sitemap.xml',
  ];

  if (payload.categorySlug) {
    paths.push(`/${locale}/category/${payload.categorySlug}`);
  }

  return [...new Set(paths)];
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const expectedSecret = process.env.REVALIDATION_SECRET;
  if (!expectedSecret) {
    return NextResponse.json(
      { error: 'Revalidation is not configured' },
      { status: 500 }
    );
  }

  const receivedSecret = request.headers.get('x-revalidation-secret');
  if (!receivedSecret || !isSecretMatch(expectedSecret, receivedSecret)) {
    return unauthorizedResponse();
  }

  try {
    const body = await request.text();
    if (body.length === 0 || body.length > MAX_BODY_LENGTH) {
      return invalidPayloadResponse();
    }

    let parsedJson: unknown;
    try {
      parsedJson = JSON.parse(body);
    } catch {
      return invalidPayloadResponse();
    }

    const payload = parsePayload(parsedJson);
    if (!payload) return invalidPayloadResponse();

    const paths = buildPaths(payload);
    for (const path of paths) {
      revalidatePath(path);
    }

    return NextResponse.json({ revalidated: true, paths }, { status: 200 });
  } catch {
    return NextResponse.json(
      { error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
