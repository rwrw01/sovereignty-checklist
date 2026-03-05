import { test, expect } from '@playwright/test';

test.describe('Security headers', () => {
  test('response includes security headers', async ({ request }) => {
    const res = await request.get('/');
    const headers = res.headers();
    expect(headers['x-content-type-options']).toBe('nosniff');
    expect(headers['x-frame-options']).toBe('DENY');
    expect(headers['referrer-policy']).toBe('strict-origin-when-cross-origin');
    expect(headers['permissions-policy']).toContain('camera=()');
  });

  test('API responses include no-cache headers', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        companyName: 'Header Test BV',
        contactName: 'Test',
        contactEmail: 'test@headers.nl',
      },
    });
    const headers = res.headers();
    expect(headers['cache-control']).toContain('no-store');
  });

  test('no X-Powered-By header exposed', async ({ request }) => {
    const res = await request.get('/');
    expect(res.headers()['x-powered-by']).toBeUndefined();
  });
});

test.describe('Rate limiting', () => {
  test('admin seed rate limited after excessive attempts', async ({ request }) => {
    // Admin seed endpoint has limit of 5/min.
    // Previous tests already consumed some quota; exhaust the rest.
    // Keep sending until we hit 429.
    let hitRateLimit = false;
    for (let i = 0; i < 10; i++) {
      const res = await request.post('/api/v1/admin/seed', {
        data: { username: `ratelimit${i}xxx`, password: 'RateLimitTest2026!!' },
      });
      if (res.status() === 429) {
        hitRateLimit = true;
        const body = await res.json();
        expect(body.error).toContain('Te veel verzoeken');
        expect(res.headers()['retry-after']).toBeTruthy();
        break;
      }
      // Should be 403 (admin already exists)
      expect(res.status()).toBe(403);
    }
    expect(hitRateLimit).toBe(true);
  });
});

test.describe('Input sanitization', () => {
  test('XSS in company name is stored safely (no script execution)', async ({
    request,
  }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        companyName: '<script>alert("xss")</script>',
        contactName: 'XSS Test',
        contactEmail: 'xss@test.nl',
      },
    });
    // Should be accepted (stored as text, rendered safely by React)
    expect(res.status()).toBe(201);
    const body = await res.json();

    // Verify it's stored as-is (React will escape on render)
    const getRes = await request.get(`/api/v1/assessments/${body.token}`);
    const data = await getRes.json();
    expect(data.assessment.companyName).toBe('<script>alert("xss")</script>');
  });

  test('SQL injection in company name is harmless', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        companyName: "'; DROP TABLE assessments; --",
        contactName: 'SQLi Test',
        contactEmail: 'sqli@test.nl',
      },
    });
    // Should be accepted (parameterized queries protect against SQLi)
    expect(res.status()).toBe(201);
  });

  test('oversized notes field is rejected', async ({ request }) => {
    const res = await request.post('/api/v1/assessments', {
      data: {
        assessmentType: 'seal',
        companyName: 'Notes Test BV',
        contactName: 'Test',
        contactEmail: 'notes@test.nl',
      },
    });
    const body = await res.json();
    const token = body.token;

    // Try submitting a note that exceeds 1000 chars
    const longNote = 'A'.repeat(1001);
    const ansRes = await request.put(`/api/v1/assessments/${token}/answers`, {
      data: { answers: [{ questionId: 'sov1_q1', score: 3, notes: longNote }] },
    });
    expect(ansRes.status()).toBe(400);
  });
});
