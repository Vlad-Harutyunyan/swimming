# File-Based Database

This project uses a simple file-based database system that stores data in JSON files. This is perfect for static sites or when you don't have access to a traditional database.

## How It Works

- Data is stored in `data/db/` directory as JSON files:
  - `bookings.json` - All course bookings
  - `feedback.json` - Customer feedback/testimonials
  - `contacts.json` - Contact form submissions

## Running the Application

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start both frontend and backend:**
   ```bash
   npm run dev
   ```
   
   This starts:
   - Frontend (Vite) on `http://localhost:3000`
   - Backend API (Express) on `http://localhost:3001`

3. **Development only frontend:**
   ```bash
   npm run dev:client
   ```

4. **Development only backend:**
   ```bash
   npm run dev:server
   ```

## API Endpoints

### Bookings
- `GET /api/bookings` - Get all bookings
- `POST /api/bookings` - Create a new booking

### Feedback
- `GET /api/feedback` - Get all feedback
- `POST /api/feedback` - Submit new feedback

### Contacts
- `GET /api/contacts` - Get all contact messages
- `POST /api/contacts` - Submit a contact form

## Data Structure

### Booking
```json
{
  "id": "uuid",
  "childName": "string",
  "childAge": "string",
  "parentName": "string",
  "email": "string",
  "phone": "string",
  "selectedCourse": "string",
  "preferredTime": "string",
  "notes": "string",
  "createdAt": "ISO date",
  "status": "pending"
}
```

### Feedback
```json
{
  "id": "uuid",
  "name": "string",
  "childName": "string",
  "course": "string",
  "rating": "number (1-5)",
  "comment": "string",
  "email": "string",
  "createdAt": "ISO date",
  "approved": "boolean"
}
```

### Contact
```json
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "phone": "string",
  "subject": "string",
  "message": "string",
  "createdAt": "ISO date",
  "read": "boolean"
}
```

## Advantages

✅ No database setup required  
✅ Easy to backup (just copy JSON files)  
✅ Perfect for static sites  
✅ Human-readable data format  
✅ Easy to migrate to a real database later  

## Limitations

⚠️ Not suitable for high-traffic applications  
⚠️ Concurrent writes can cause data loss (use locks for production)  
⚠️ No built-in relationships or queries  

## Migration to Real Database

When you're ready to move to a real database, you can:
1. Keep the same API structure
2. Replace file operations with database queries
3. Import existing JSON data into your database

The frontend code won't need any changes!
