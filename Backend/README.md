# Backend Setup Instructions

## Prerequisites
1. Node.js installed (version 16 or higher)
2. MongoDB running locally or MongoDB Atlas connection string
3. Clerk account for authentication (optional for testing)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set up Environment Variables
Create a `.env` file in the Backend directory with the following variables:

```env
# MongoDB Connection (required)
MONGODB_URI=mongodb://localhost:27017/blogweb

# Clerk Authentication (optional for testing)
CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here

# ImageKit Configuration (optional for testing)
IK_URL_ENDPOINT=https://ik.imagekit.io/your_endpoint
IK_URL_PUBLIC_KEY=your_public_key
IK_URL_PRIVATE_KEY=your_private_key

# Server Port (optional)
PORT=3000
```

### 3. Start MongoDB
If using local MongoDB:
```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongod
```

### 4. Run the Backend
```bash
npm run dev
```

The server will start on port 3000.

## Testing

### Test Endpoints
- `GET /test` - Check if backend is running
- `GET /test-comment` - Test comment model connection

### Test Comments
1. Start the backend server
2. Navigate to a post in the frontend
3. Try to add a comment
4. Check MongoDB for saved comments

## Troubleshooting

### Common Issues
1. **MongoDB Connection Error**: Make sure MongoDB is running
2. **Authentication Error**: Check Clerk environment variables
3. **Port Already in Use**: Change PORT in .env file

### Debug Mode
The backend now includes detailed logging for comment operations. Check the console for debugging information.

## MongoDB Collections
- `users` - User information
- `posts` - Blog posts
- `comments` - Post comments
