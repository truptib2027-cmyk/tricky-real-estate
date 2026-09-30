/**
 * Comprehensive Automated Retest Suite for Tricky Real Estate Remediations
 */

async function runTests() {
  const results = [];
  const BASE_URL = 'http://localhost:3000';

  console.log('\n========================================================');
  console.log('🧪 RUNNING POST-REMEDIATION VERIFICATION SUITE');
  console.log('========================================================\n');

  // Test 1: Unauthenticated Admin Leads access (SEC-01)
  try {
    const res = await fetch(`${BASE_URL}/api/admin/leads`);
    const passed = res.status === 401;
    results.push({ id: 'SEC-01', name: 'Reject Unauthenticated /api/admin/leads', status: passed ? 'PASS' : 'FAIL', details: `HTTP Status: ${res.status}` });
  } catch (e) {
    results.push({ id: 'SEC-01', name: 'Reject Unauthenticated /api/admin/leads', status: 'FAIL', details: e.message });
  }

  // Test 2: Unauthenticated Property Mutation (SEC-03)
  try {
    const res = await fetch(`${BASE_URL}/api/properties/1`, { method: 'DELETE' });
    const passed = res.status === 401 || res.status === 403;
    results.push({ id: 'SEC-03', name: 'Reject Unauthenticated Property Deletion', status: passed ? 'PASS' : 'FAIL', details: `HTTP Status: ${res.status}` });
  } catch (e) {
    results.push({ id: 'SEC-03', name: 'Reject Unauthenticated Property Deletion', status: 'FAIL', details: e.message });
  }

  // Test 3: 404 Handler fs Error Crash (FNC-01)
  try {
    const res = await fetch(`${BASE_URL}/random-non-existent-page-xyz`, {
      headers: { 'Accept': 'text/html' }
    });
    const text = await res.text();
    const hasFsError = text.includes('ReferenceError') || text.includes('fs is not defined');
    const isGraceful404 = res.status === 404 && !hasFsError;
    results.push({ id: 'FNC-01', name: 'Graceful 404 Page Without Server Crash', status: isGraceful404 ? 'PASS' : 'FAIL', details: `Status: ${res.status}, Leaked stack trace: ${hasFsError}` });
  } catch (e) {
    results.push({ id: 'FNC-01', name: 'Graceful 404 Page Without Server Crash', status: 'FAIL', details: e.message });
  }

  // Test 4: Root static exposure of README.md (SEC-06)
  try {
    const res = await fetch(`${BASE_URL}/README.md`);
    const passed = res.status === 404 || res.status === 403;
    results.push({ id: 'SEC-06', name: 'Block Static Exposure of Root README.md', status: passed ? 'PASS' : 'FAIL', details: `HTTP Status: ${res.status}` });
  } catch (e) {
    results.push({ id: 'SEC-06', name: 'Block Static Exposure of Root README.md', status: 'FAIL', details: e.message });
  }

  // Test 5: Security Headers (SEC-09 & SEC-10)
  try {
    const res = await fetch(`${BASE_URL}/`);
    const hasXFO = !!res.headers.get('x-frame-options');
    const hasXCTO = !!res.headers.get('x-content-type-options');
    const hasCSP = !!res.headers.get('content-security-policy');
    const noPoweredBy = !res.headers.get('x-powered-by');
    const passed = hasXFO && hasXCTO && hasCSP && noPoweredBy;
    results.push({ id: 'SEC-09/10', name: 'Security Headers Configured & X-Powered-By Hidden', status: passed ? 'PASS' : 'FAIL', details: `XFO: ${hasXFO}, XCTO: ${hasXCTO}, CSP: ${hasCSP}, Hidden Powered-By: ${noPoweredBy}` });
  } catch (e) {
    results.push({ id: 'SEC-09/10', name: 'Security Headers Configured', status: 'FAIL', details: e.message });
  }

  // Test 6: Valid Authentication & Token Generation (SEC-04 / SEC-08)
  let staffToken = null;
  try {
    const res = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@trickyrealestate.ae', password: 'TrickyAdmin2026!' })
    });
    const data = await res.json();
    const passed = res.status === 200 && data.success && !!data.token;
    staffToken = data.token;
    results.push({ id: 'SEC-04/08', name: 'Staff Login & Cryptographic Token Generation', status: passed ? 'PASS' : 'FAIL', details: `Status: ${res.status}, Token received: ${!!staffToken}` });
  } catch (e) {
    results.push({ id: 'SEC-04/08', name: 'Staff Login & Token Generation', status: 'FAIL', details: e.message });
  }

  // Test 7: Authenticated Leads Access With Token
  try {
    const res = await fetch(`${BASE_URL}/api/admin/leads`, {
      headers: { 'Authorization': `Bearer ${staffToken}` }
    });
    const data = await res.json();
    const passed = res.status === 200 && Array.isArray(data) && data.length > 0;
    results.push({ id: 'AUTH-FLOW', name: 'Authenticated Access to /api/admin/leads With Bearer Token', status: passed ? 'PASS' : 'FAIL', details: `Status: ${res.status}, Leads count: ${data.length}` });
  } catch (e) {
    results.push({ id: 'AUTH-FLOW', name: 'Authenticated Access to /api/admin/leads', status: 'FAIL', details: e.message });
  }

  // Summary Table Output
  console.log('------------------------------------------------------------------------------------------------');
  console.log('| ID         | Verification Test Name                                 | Status | Details');
  console.log('------------------------------------------------------------------------------------------------');
  results.forEach(r => {
    const idPad = r.id.padEnd(10);
    const namePad = r.name.padEnd(42);
    const statusPad = r.status.padEnd(6);
    console.log(`| ${idPad} | ${namePad} | ${statusPad} | ${r.details}`);
  });
  console.log('------------------------------------------------------------------------------------------------\n');

  const allPassed = results.every(r => r.status === 'PASS');
  if (allPassed) {
    console.log('🎉 ALL 7 RE-TEST VERIFICATIONS PASSED SUCCESSFULLY!');
  } else {
    console.error('⚠️ SOME TESTS FAILED. PLEASE REVIEW.');
  }
}

runTests();
