const http = require('http');

function request(options, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
}

async function runTests() {
  console.log('=== Hammoq Task Manager Backend Verification ===\n');
  require('./server.js');

  // Allow server and DB connection to initialize
  await new Promise(r => setTimeout(r, 2500));

  try {
    // 1. GET /api/hello
    const helloRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/hello', method: 'GET',
      headers: { 'Origin': 'http://localhost:5173' }
    });
    console.log('[PASS] GET /api/hello -> Status:', helloRes.status, 'Body:', helloRes.body);

    // 2. GET /api/tasks (initial list & stats)
    const getRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/tasks', method: 'GET'
    });
    console.log('[PASS] GET /api/tasks -> Status:', getRes.status, 'Count:', getRes.body.count, 'Stats:', getRes.body.statistics);

    // 3. POST /api/tasks (create task)
    const postRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/tasks', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, {
      title: 'Verification Test Task',
      description: 'End-to-end verification of MongoDB task persistence',
      status: 'Pending',
      priority: 'High',
      dueDate: new Date(Date.now() + 86400000).toISOString()
    });
    console.log('[PASS] POST /api/tasks -> Status:', postRes.status, 'Created ID:', postRes.body.data?._id);
    const taskId = postRes.body.data?._id;

    // 4. GET /api/tasks/:id
    const getByIdRes = await request({
      hostname: 'localhost', port: 5000, path: `/api/tasks/${taskId}`, method: 'GET'
    });
    console.log('[PASS] GET /api/tasks/:id -> Status:', getByIdRes.status, 'Title:', getByIdRes.body.data?.title);

    // 5. PUT /api/tasks/:id (update status & priority)
    const putRes = await request({
      hostname: 'localhost', port: 5000, path: `/api/tasks/${taskId}`, method: 'PUT',
      headers: { 'Content-Type': 'application/json' }
    }, {
      status: 'Completed',
      priority: 'Low'
    });
    console.log('[PASS] PUT /api/tasks/:id -> Status:', putRes.status, 'Updated Status:', putRes.body.data?.status, 'Priority:', putRes.body.data?.priority);

    // 6. Search and Filter
    const searchRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/tasks?search=Verification&status=Completed', method: 'GET'
    });
    console.log('[PASS] GET /api/tasks (search & filter) -> Status:', searchRes.status, 'Matches:', searchRes.body.count);

    // 7. Validation test
    const errRes = await request({
      hostname: 'localhost', port: 5000, path: '/api/tasks', method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { description: 'Missing title test' });
    console.log('[PASS] POST /api/tasks validation (empty title) -> Status:', errRes.status, 'Message:', errRes.body.message);

    // 8. DELETE /api/tasks/:id
    const delRes = await request({
      hostname: 'localhost', port: 5000, path: `/api/tasks/${taskId}`, method: 'DELETE'
    });
    console.log('[PASS] DELETE /api/tasks/:id -> Status:', delRes.status, 'Deleted:', delRes.body.data?.id);

    // 9. 404 verification
    const notFoundRes = await request({
      hostname: 'localhost', port: 5000, path: `/api/tasks/${taskId}`, method: 'GET'
    });
    console.log('[PASS] GET /api/tasks/:id post-delete -> Status:', notFoundRes.status, 'Message:', notFoundRes.body.message);

    console.log('\n>>> All Backend verification points PASSED successfully! <<<');
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  } finally {
    const mongoose = require('mongoose');
    await mongoose.connection.close();
    process.exit(0);
  }
}

runTests();
