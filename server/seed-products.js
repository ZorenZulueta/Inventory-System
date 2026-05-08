const https = require('https');

const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiJnVHhJMnNnZUpZaDVDWlNHclVadCIsImVtYWlsIjoiamVtQGdtYWlsLmNvbSIsInJvbGUiOiJhZG1pbiIsImlhdCI6MTc3ODE5ODEwNCwiZXhwIjoxNzc4ODAyOTA0fQ.WbU50IXsMIm6bED3N3wUDA9PHD_p5TaO_l0c7zGczik';
const BASE_URL = 'inventory-system-1-mopu.onrender.com';

const products = [
  { name: 'Ballpen Blue', description: 'Standard blue ballpoint pen', category: 'School', quantity: 500, price: 15 },
  { name: 'Notebook 80 Leaves', description: 'Intermediate notebook 80 leaves', category: 'School', quantity: 200, price: 45 },
  { name: 'Folder Long', description: 'Expandable long folder', category: 'Office', quantity: 300, price: 12 },
  { name: 'Stapler', description: 'Heavy duty stapler', category: 'Office', quantity: 50, price: 185 },
  { name: 'Bond Paper 500s', description: 'A4 bond paper 500 sheets', category: 'Office', quantity: 100, price: 280 },
  { name: 'Whiteboard Marker', description: 'Erasable whiteboard marker', category: 'School', quantity: 150, price: 35 },
  { name: 'Scissors', description: 'Stainless steel scissors', category: 'School', quantity: 80, price: 55 },
  { name: 'Correction Tape', description: 'Mini correction tape', category: 'School', quantity: 120, price: 28 },
  { name: 'Ruler 12 inch', description: 'Transparent plastic ruler', category: 'School', quantity: 200, price: 20 },
  { name: 'Staple Wire', description: 'Standard staple wire #35', category: 'Office', quantity: 250, price: 18 },
];

async function addProduct(product) {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify(product);
    const options = {
      hostname: BASE_URL,
      path: '/api/products',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Length': Buffer.byteLength(body)
      }
    };
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        console.log(`${res.statusCode} - ${product.name}: ${data.substring(0, 80)}`);
        resolve(data);
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  console.log('Adding sample products...\n');
  for (const p of products) {
    await addProduct(p);
    await new Promise(r => setTimeout(r, 500));
  }
  console.log('\nDone!');
})();




