import express from 'express';
import cors from 'cors';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Data directory
const DATA_DIR = path.join(process.cwd(), 'data', 'db');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
    console.log(`📁 Data directory exists: ${DATA_DIR}`);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
    // Initialize empty files
    await fs.writeFile(path.join(DATA_DIR, 'bookings.json'), JSON.stringify([], null, 2));
    await fs.writeFile(path.join(DATA_DIR, 'feedback.json'), JSON.stringify([], null, 2));
    await fs.writeFile(path.join(DATA_DIR, 'contacts.json'), JSON.stringify([], null, 2));
    await fs.writeFile(path.join(DATA_DIR, 'courses.json'), JSON.stringify([], null, 2));
    console.log(`📁 Created data directory: ${DATA_DIR}`);
  }
}

// Helper function to read JSON file
async function readJSONFile(filename) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.access(filePath);
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist, create it with empty array
    if (error.code === 'ENOENT') {
      await fs.writeFile(path.join(DATA_DIR, filename), JSON.stringify([], null, 2));
      return [];
    }
    console.error(`Error reading ${filename}:`, error);
    return [];
  }
}

// Helper function to write JSON file
async function writeJSONFile(filename, data) {
  try {
    const filePath = path.join(DATA_DIR, filename);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Error writing ${filename}:`, error);
    throw error;
  }
}

// Bookings API
app.get('/api/bookings', async (req, res) => {
  try {
    console.log('GET /api/bookings');
    const bookings = await readJSONFile('bookings.json');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

app.post('/api/bookings', async (req, res) => {
  try {
    console.log('POST /api/bookings', req.body);
    const bookings = await readJSONFile('bookings.json');
    const newBooking = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    bookings.push(newBooking);
    await writeJSONFile('bookings.json', bookings);
    res.status(201).json(newBooking);
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
});

app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bookings = await readJSONFile('bookings.json');
    const index = bookings.findIndex((b) => b.id === id);
    if (index === -1) return res.status(404).json({ error: 'Booking not found' });
    bookings[index] = { ...bookings[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeJSONFile('bookings.json', bookings);
    res.json(bookings[index]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
});

// Feedback API
app.get('/api/feedback', async (req, res) => {
  try {
    console.log('GET /api/feedback');
    const feedback = await readJSONFile('feedback.json');
    res.json(feedback);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feedback' });
  }
});

app.post('/api/feedback', async (req, res) => {
  try {
    console.log('POST /api/feedback', req.body);
    const feedback = await readJSONFile('feedback.json');
    const newFeedback = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      approved: false,
      status: 'pending'
    };
    feedback.push(newFeedback);
    await writeJSONFile('feedback.json', feedback);
    console.log('Feedback saved successfully');
    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Failed to create feedback' });
  }
});

app.put('/api/feedback/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await readJSONFile('feedback.json');
    const index = feedback.findIndex((f) => f.id === id);
    if (index === -1) return res.status(404).json({ error: 'Feedback not found' });
    feedback[index] = { ...feedback[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeJSONFile('feedback.json', feedback);
    res.json(feedback[index]);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).json({ error: 'Failed to update feedback' });
  }
});

// Contacts API
app.get('/api/contacts', async (req, res) => {
  try {
    console.log('GET /api/contacts');
    const contacts = await readJSONFile('contacts.json');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

app.post('/api/contacts', async (req, res) => {
  try {
    console.log('POST /api/contacts', req.body);
    const contacts = await readJSONFile('contacts.json');
    const newContact = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      read: false
    };
    contacts.push(newContact);
    await writeJSONFile('contacts.json', contacts);
    res.status(201).json(newContact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.put('/api/contacts/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const contacts = await readJSONFile('contacts.json');
    const index = contacts.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Contact not found' });
    contacts[index] = { ...contacts[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeJSONFile('contacts.json', contacts);
    res.json(contacts[index]);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// Courses API (CRUD)
app.get('/api/courses', async (req, res) => {
  try {
    console.log('GET /api/courses');
    const courses = await readJSONFile('courses.json');
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch courses' });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    console.log('POST /api/courses', JSON.stringify(req.body, null, 2));
    const courses = await readJSONFile('courses.json');
    const newCourse = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    courses.push(newCourse);
    await writeJSONFile('courses.json', courses);
    console.log('✅ Course created successfully:', newCourse.id);
    res.status(201).json(newCourse);
  } catch (error) {
    console.error('❌ Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course', details: error.message });
  }
});

app.put('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const courses = await readJSONFile('courses.json');
    const index = courses.findIndex((c) => c.id === id);
    if (index === -1) return res.status(404).json({ error: 'Course not found' });
    courses[index] = { ...courses[index], ...req.body, updatedAt: new Date().toISOString() };
    await writeJSONFile('courses.json', courses);
    res.json(courses[index]);
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

app.delete('/api/courses/:id', async (req, res) => {
  try {
    const { id } = req.params;
    let courses = await readJSONFile('courses.json');
    const before = courses.length;
    courses = courses.filter((c) => c.id !== id);
    if (courses.length === before) return res.status(404).json({ error: 'Course not found' });
    await writeJSONFile('courses.json', courses);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API is running' });
});

// Debug route to see all registered routes
app.get('/api/routes', (req, res) => {
  res.json({
    routes: ['/api/bookings', '/api/feedback', '/api/contacts', '/api/courses', '/api/health']
  });
});

// Catch-all for undefined routes
app.use('/api/*', (req, res) => {
  console.log(`⚠️  Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: 'Route not found', path: req.originalUrl });
});

// Initialize and start server
async function startServer() {
  await ensureDataDir();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 File-based DB API server running on http://127.0.0.1:${PORT}`);
    console.log(`📁 Data directory: ${DATA_DIR}`);
    console.log(`✅ Server is ready to accept connections`);
  });
}

startServer().catch(console.error);