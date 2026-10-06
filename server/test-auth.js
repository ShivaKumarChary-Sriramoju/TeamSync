async function runTests() {
  const email = `test${Date.now()}@example.com`;
  const password = 'password123';
  const baseUrl = 'http://localhost:5000/api';
  
  try {
    console.log('Testing Registration...');
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email, password })
    });
    console.log('Register status:', regRes.status);
    console.log('Register data:', await regRes.json());
    
    console.log('\nTesting Login...');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    console.log('Login status:', loginRes.status);
    console.log('Login data:', await loginRes.json());
    
    const setCookie = loginRes.headers.get('set-cookie');
    console.log('\nReceived cookies:', setCookie);

    console.log('\nTesting Refresh...');
    const refreshRes = await fetch(`${baseUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Cookie': setCookie || ''
      }
    });
    console.log('Refresh status:', refreshRes.status);
    console.log('Refresh data:', await refreshRes.json());

    console.log('\nTesting Logout...');
    const logoutRes = await fetch(`${baseUrl}/auth/logout`, { method: 'POST' });
    console.log('Logout status:', logoutRes.status);
    console.log('Logout data:', await logoutRes.json());
  } catch(e) {
    console.error(e);
  }
}

runTests();
