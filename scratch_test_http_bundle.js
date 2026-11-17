const axios = require('axios');

async function test() {
  try {
    const res = await axios.get('http://localhost:5000/api/v1/products/22c36768-279a-466f-8cba-7b9c3e2cd4d5/bundle');
    console.log('Bundle endpoint status:', res.status);
    console.log('Bundle endpoint data:', res.data.success, 'Recommended count:', res.data.bundle?.recommended?.length);
    console.log('Titles:', res.data.bundle?.recommended?.map(p => p.title));
  } catch (e) {
    console.error('Bundle endpoint failed:', e.response?.status, e.response?.data || e.message);
  }
}

test();
