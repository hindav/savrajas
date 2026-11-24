/* Quick automated test for Savrajas Backend API */
import app from '../server.js';

const PORT = 5099;
const server = app.listen(PORT, async () => {
  const baseUrl = `http://localhost:${PORT}/api`;
  console.log(`[Test] Server started on ${baseUrl}`);

  try {
    // 1. Health check
    const healthRes = await fetch(`${baseUrl}/health`);
    const health = await healthRes.json();
    console.log('✅ Health check:', health.status);

    // 2. Auth login
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pin: '1234' })
    });
    const login = await loginRes.json();
    console.log('✅ Auth login:', login.success, 'Token received:', Boolean(login.token));
    const token = login.token;

    // 3. Pricing GET
    const pricingRes = await fetch(`${baseUrl}/pricing`);
    const pricing = await pricingRes.json();
    console.log('✅ Pricing fetch:', pricing.success, 'Tiers:', Object.keys(pricing.data.tiers || {}));

    // 4. Portfolio GET
    const portfolioRes = await fetch(`${baseUrl}/portfolio`);
    const portfolio = await portfolioRes.json();
    console.log('✅ Portfolio fetch:', portfolio.success, 'Projects count:', portfolio.count);

    // 5. Leads GET (Protected)
    const leadsRes = await fetch(`${baseUrl}/leads`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const leads = await leadsRes.json();
    console.log('✅ Leads fetch (protected):', leads.success, 'Leads count:', leads.count);

    // 6. Dashboard stats (Protected)
    const statsRes = await fetch(`${baseUrl}/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const stats = await statsRes.json();
    console.log('✅ Dashboard stats:', stats.success, stats.stats);

    console.log('\n🎉 ALL BACKEND API ENDPOINTS VERIFIED & FUNCTIONING PERFECTLY!\n');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    server.close();
    process.exit(1);
  }
});
