const axios = require('axios');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../frontend/.env') });
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const base = (process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000').replace(/\/$/, '');
const API = `${base}/api`;

async function main() {
  const email = `TEST_poison_${uuidv4().slice(0, 8)}@example.com`;
  const regResp = await axios.post(`${API}/auth/register`, {
    name: 'TEST_ Poison',
    email,
    password: 'Test@12345'
  });
  const token = regResp.data.token;
  const authHeaders = { Authorization: `Bearer ${token}` };

  try {
    const r = await axios.post(`${API}/cart`, { product_id: 'badid', quantity: 1 }, { headers: authHeaders });
    console.log('POST /cart badid ->', r.status);
  } catch (err) {
    console.log('POST /cart badid ->', err.response ? err.response.status : err.message);
  }

  try {
    const g = await axios.get(`${API}/cart`, { headers: authHeaders });
    console.log('GET /cart after ->', g.status, JSON.stringify(g.data).slice(0, 200));
  } catch (err) {
    console.log('GET /cart after ->', err.response ? err.response.status : err.message);
  }

  try {
    const c = await axios.post(`${API}/checkout`, {
      address: { name: 'x', phone: '9999999999', line1: 'a', city: 'b', state: 'c', pincode: '400001' }
    }, { headers: authHeaders });
    console.log('POST /checkout after ->', c.status, JSON.stringify(c.data).slice(0, 200));
  } catch (err) {
    console.log('POST /checkout after ->', err.response ? err.response.status : err.message);
  }
}

main().catch(console.error);
