// server.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, 'db.json');

const readDB = () => {
  try {
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading DB:', error);
    return { tickets: [], users: [], activities: [], categories: [], notifications: [] };
  }
};

const writeDB = (data) => {
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
};

import express from 'express';
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

function normalizeText(text) {
  if (!text) return '';
  return text
    .normalize('NFKC')
    .replace(/[ًٌٍَُِّ]/g, '')
    .trim();
}

app.get('/users', (req, res) => {
  const db = readDB();
  let users = db.users || [];
  
  const search = req.query.search;
  if (search) {
    const searchNormalized = normalizeText(search).toLowerCase();
    users = users.filter(u => {
      const name = normalizeText(u.name || '').toLowerCase();
      const nameFa = normalizeText(u.nameFa || '').toLowerCase();
      const email = normalizeText(u.email || '').toLowerCase();
      const idStr = String(u.id);
      return name.includes(searchNormalized) || 
             nameFa.includes(searchNormalized) || 
             email.includes(searchNormalized) || 
             idStr.includes(search);
    });
  }
  
  const role = req.query.role;
  if (role) {
    users = users.filter(u => u.role === role);
  }
  
  const status = req.query.status;
  if (status) {
    users = users.filter(u => u.status === status);
  }
  
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const total = users.length;
  const paginatedUsers = users.slice(start, end);
  
  const usersWithoutPassword = paginatedUsers.map(({ password, ...user }) => user);
  
  res.setHeader('X-Total-Count', total);
  res.setHeader('X-Total-Pages', Math.ceil(total / limit));
  res.json(usersWithoutPassword);
});

app.get('/users/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const user = (db.users || []).find(u => u.id === id);
  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.post('/users', (req, res) => {
  const db = readDB();
  const users = db.users || [];
  let maxId = 0;
  users.forEach(u => {
    if (u.id > maxId) maxId = u.id;
  });
  const newUser = { ...req.body, id: maxId + 1 };
  users.push(newUser);
  db.users = users;
  writeDB(db);
  res.status(201).json(newUser);
});

app.put('/users/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = (db.users || []).findIndex(u => u.id === id);
  
  if (index !== -1) {
    db.users[index] = { 
      ...db.users[index], 
      ...req.body,
      id: db.users[index].id
    };
    writeDB(db);
    const { password, ...userWithoutPassword } = db.users[index];
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.patch('/users/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = (db.users || []).findIndex(u => u.id === id);
  
  if (index !== -1) {
    db.users[index] = { 
      ...db.users[index], 
      ...req.body,
      id: db.users[index].id
    };
    writeDB(db);
    const { password, ...userWithoutPassword } = db.users[index];
    res.json(userWithoutPassword);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

app.delete('/users/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.users = (db.users || []).filter(u => u.id !== id);
  writeDB(db);
  res.status(204).send();
});

app.get('/tickets', (req, res) => {
  const db = readDB();
  let tickets = db.tickets || [];
  tickets.sort((a, b) => a.id - b.id);
  
  const search = req.query.search;
  if (search) {
    const searchNormalized = normalizeText(search).toLowerCase();
    tickets = tickets.filter(t => {
      const subject = normalizeText(t.subject || '').toLowerCase();
      const subjectFa = normalizeText(t.subjectFa || '').toLowerCase();
      const idStr = String(t.id);
      return subject.includes(searchNormalized) || 
             subjectFa.includes(searchNormalized) || 
             idStr.includes(search);
    });
  }
  
  const status = req.query.status;
  if (status) {
    tickets = tickets.filter(t => t.status === status);
  }
  
  const priority = req.query.priority;
  if (priority) {
    tickets = tickets.filter(t => t.priority === priority);
  }
  
  const userId = req.query.userId;
  if (userId) {
    tickets = tickets.filter(t => t.userId === Number(userId));
  }
  
  const category = req.query.category;
  if (category) {
    tickets = tickets.filter(t => t.category === category);
  }
  
  const page = parseInt(req.query._page) || 1;
  const limit = parseInt(req.query._limit) || 10;
  const start = (page - 1) * limit;
  const end = start + limit;
  
  const total = tickets.length;
  const paginatedTickets = tickets.slice(start, end);
  
  res.setHeader('X-Total-Count', total);
  res.setHeader('X-Total-Pages', Math.ceil(total / limit));
  res.json(paginatedTickets);
});

app.get('/tickets/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const ticket = (db.tickets || []).find(t => t.id === id);
  if (ticket) {
    res.json(ticket);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

app.post('/tickets', (req, res) => {
  const db = readDB();
  const tickets = db.tickets || [];
  
  let maxId = 0;
  tickets.forEach(t => {
    if (t.id > maxId) maxId = t.id;
  });
  const newId = maxId + 1;
  
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const today = `${year}-${month}-${day}`;
  
  console.log('📅 Creating ticket with date:', today);
  
  const newTicket = {
    id: newId,
    subject: req.body.subject || 'بدون موضوع',
    subjectFa: req.body.subjectFa || req.body.subject || 'بدون موضوع',
    category: req.body.category || 'general',
    status: req.body.status || 'open',
    priority: req.body.priority || 'medium',
    userId: req.body.userId || 1,
    userName: req.body.userName || 'کاربر',
    userNameFa: req.body.userNameFa || req.body.userName || 'کاربر',
    created: today,
    updated: today,
    desc: req.body.desc || '',
    descFa: req.body.descFa || req.body.desc || '',
    assignee: req.body.assignee || '',
    replies: 0,
    responses: []
  };
  
  tickets.push(newTicket);
  db.tickets = tickets;
  writeDB(db);
  
  console.log('✅ Ticket created with ID:', newId, 'Date:', today);
  res.status(201).json(newTicket);
});

app.put('/tickets/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = (db.tickets || []).findIndex(t => t.id === id);
  if (index !== -1) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const today = `${year}-${month}-${day}`;
    
    db.tickets[index] = {
      ...db.tickets[index],
      ...req.body,
      updated: today
    };
    writeDB(db);
    res.json(db.tickets[index]);
  } else {
    res.status(404).json({ error: 'Ticket not found' });
  }
});

app.delete('/tickets/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.tickets = (db.tickets || []).filter(t => t.id !== id);
  writeDB(db);
  res.status(204).send();
});

app.get('/activities', (req, res) => {
  const db = readDB();
  const activities = db.activities || [];
  activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  res.json(activities);
});

app.get('/activities/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const activity = (db.activities || []).find(a => a.id === id);
  if (activity) {
    res.json(activity);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.post('/activities', (req, res) => {
  const db = readDB();
  const activities = db.activities || [];
  
  let maxId = 0;
  activities.forEach(a => {
    if (a.id > maxId) maxId = a.id;
  });
  
  const newActivity = {
    id: maxId + 1,
    userId: req.body.userId || 0,
    userName: req.body.userName || 'کاربر',
    action: req.body.action || 'Unknown',
    actionFa: req.body.actionFa || 'ناشناخته',
    timestamp: req.body.timestamp || new Date().toISOString(),
    details: req.body.details || ''
  };
  
  activities.push(newActivity);
  db.activities = activities;
  writeDB(db);
  res.status(201).json(newActivity);
});

app.put('/activities/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = (db.activities || []).findIndex(a => a.id === id);
  if (index !== -1) {
    db.activities[index] = { ...db.activities[index], ...req.body };
    writeDB(db);
    res.json(db.activities[index]);
  } else {
    res.status(404).json({ error: 'Activity not found' });
  }
});

app.delete('/activities/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.activities = (db.activities || []).filter(a => a.id !== id);
  writeDB(db);
  res.status(204).send();
});

app.get('/categories', (req, res) => {
  const db = readDB();
  res.json(db.categories || []);
});

app.get('/categories/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const category = (db.categories || []).find(c => c.id === id);
  if (category) {
    res.json(category);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.post('/categories', (req, res) => {
  const db = readDB();
  const categories = db.categories || [];
  
  let maxId = 0;
  categories.forEach(c => {
    if (c.id > maxId) maxId = c.id;
  });
  
  const newCategory = {
    id: maxId + 1,
    name: req.body.name || 'Unknown',
    nameFa: req.body.nameFa || 'ناشناخته',
    slug: req.body.slug || 'unknown',
    description: req.body.description || '',
    descriptionFa: req.body.descriptionFa || '',
    count: req.body.count || 0,
    icon: req.body.icon || 'QuestionOutlined'
  };
  
  categories.push(newCategory);
  db.categories = categories;
  writeDB(db);
  res.status(201).json(newCategory);
});

app.put('/categories/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = (db.categories || []).findIndex(c => c.id === id);
  if (index !== -1) {
    db.categories[index] = { ...db.categories[index], ...req.body };
    writeDB(db);
    res.json(db.categories[index]);
  } else {
    res.status(404).json({ error: 'Category not found' });
  }
});

app.delete('/categories/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.categories = (db.categories || []).filter(c => c.id !== id);
  writeDB(db);
  res.status(204).send();
});

app.get('/notifications', (req, res) => {
  const db = readDB();
  const notifications = db.notifications || [];
  notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json(notifications);
});

app.get('/notifications/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const notification = (db.notifications || []).find(n => n.id === id);
  if (notification) {
    res.json(notification);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.post('/notifications', (req, res) => {
  const db = readDB();
  const notifications = db.notifications || [];
  
  let maxId = 0;
  notifications.forEach(n => {
    if (n.id > maxId) maxId = n.id;
  });
  
  const newNotification = {
    id: maxId + 1,
    userId: req.body.userId || 0,
    title: req.body.title || 'نوتیف جدید',
    titleEn: req.body.titleEn || 'New notification',
    message: req.body.message || '',
    messageEn: req.body.messageEn || '',
    type: req.body.type || 'general',
    isRead: req.body.isRead || false,
    link: req.body.link || '',
    createdAt: req.body.createdAt || new Date().toISOString(),
  };
  
  notifications.push(newNotification);
  db.notifications = notifications;
  writeDB(db);
  res.status(201).json(newNotification);
});

app.patch('/notifications/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  const index = (db.notifications || []).findIndex(n => n.id === id);
  
  if (index !== -1) {
    db.notifications[index] = { ...db.notifications[index], ...req.body };
    writeDB(db);
    res.json(db.notifications[index]);
  } else {
    res.status(404).json({ error: 'Notification not found' });
  }
});

app.delete('/notifications/:id', (req, res) => {
  const db = readDB();
  const id = parseInt(req.params.id);
  db.notifications = (db.notifications || []).filter(n => n.id !== id);
  writeDB(db);
  res.status(204).send();
});

app.delete('/notifications/user/:userId', (req, res) => {
  const db = readDB();
  const userId = parseInt(req.params.userId);
  db.notifications = (db.notifications || []).filter(n => n.userId !== userId);
  writeDB(db);
  res.status(204).send();
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = readDB();
  const users = db.users || [];
  
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    return res.status(401).json({ error: 'ایمیل یا رمز عبور اشتباه است' });
  }
  
  const { password: _, ...userWithoutPassword } = user;
  const token = `mock-token-${user.id}-${Date.now()}`;
  
  res.json({ user: userWithoutPassword, token });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Users: http://localhost:${PORT}/users`);
  console.log(`🎫 Tickets: http://localhost:${PORT}/tickets`);
  console.log(`📋 Activities: http://localhost:${PORT}/activities`);
  console.log(`📂 Categories: http://localhost:${PORT}/categories`);
  console.log(`🔔 Notifications: http://localhost:${PORT}/notifications`);
  console.log(`🔐 Login: POST http://localhost:${PORT}/login`);
});