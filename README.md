# Social Media Backend API

A RESTful API backend for the social media application, providing secure authentication, user management, and posts/comments CRUD operations. Built with Node.js, Express, and MongoDB with OAuth2 authentication and serverless deployment capabilities.

## 🚀 Features

- **RESTful API**: Complete CRUD operations for users, posts, and comments
- **OAuth2 Authentication**: Google account integration with JWT tokens
- **User Management**: Profile creation, friend connections, and user data handling
- **Post System**: Create, read, update, and delete posts with like functionality
- **Comment System**: Nested comments on posts with full CRUD support
- **Security**: Password hashing with bcrypt and JWT-based authentication
- **Serverless Ready**: Configured for serverless deployment with AWS Lambda
- **CORS Support**: Cross-origin resource sharing for frontend integration

## 🛠️ Tech Stack

### Core Framework
- **Node.js**: JavaScript runtime environment
- **Express.js**: Fast, unopinionated web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **Mongoose**: MongoDB object modeling for Node.js

### Authentication & Security
- **JSON Web Tokens (JWT)**: Secure token-based authentication
- **bcryptjs**: Password hashing and verification
- **OAuth2**: Google account authentication flow
- **Cookie Parser**: HTTP cookie parsing middleware

### Development & Deployment
- **Serverless Framework**: Infrastructure as code for AWS Lambda
- **serverless-http**: Serverless wrapper for Express applications
- **dotenv**: Environment variable management
- **CORS**: Cross-origin resource sharing middleware

## 📁 Project Structure

```
├── controllers/              # Business logic handlers
│   ├── authController.js    # Authentication logic
│   ├── googleController.js  # Google OAuth handling
│   ├── peopleController.js  # User management operations
│   └── postController.js    # Post and comment operations
├── middleware/              # Custom middleware
│   └── verifyJWT.js        # JWT token verification
├── models/                 # MongoDB schemas
│   ├── peopleModel.js      # User data schema
│   └── postModel.js        # Post and comment schemas
├── routes/                 # API route definitions
│   ├── authRoutes.js       # Authentication endpoints
│   ├── peopleRoute.js      # User-related routes
│   └── postRoute.js        # Post and comment routes
├── index.js                # Serverless entry point
├── server.js               # Express server configuration
├── serverless.yml          # Serverless deployment config
└── package.json            # Project dependencies
```

## 🚦 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB database (local or cloud)
- Google OAuth2 credentials
- AWS CLI (for serverless deployment)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd social-media-backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with required environment variables:
```env
ENVIRONMENT=DEV
PORT=5000
BACKEND_URL=http://localhost:5000
FRONTEND_URL=http://localhost:3000/social-hub-frontend/
DATABASE_URI=<mongodb+srv...>
IMAGE_BACKEND_URL=<IMAGE_BACKEND_URL>
AWS_S3_URL=<AWS_S3_BUCKET_URL>
AWS_ACCESS_KEY=<AWS_ACCESS_KEY>
AWS_SECRET_KEY=<AWS_SECRET_KEY>
AWS_BUCKET_NAME=<AWS_BUCKET_NAME>
GOOGLE_OAUTH_CLIENT_ID=<XXXXX.apps.googleusercontent.com>
GOOGLE_OAUTH_CLIENT_SECRET=<GOOGLE_OAUTH_CLIENT_SECRET>
```

4. Start the development server:
```bash
npm start
```

The API will be available at `http://localhost:5000`

## 📜 Available Scripts

- `npm start` - Start the Express server
- `npm run dev` - Start with nodemon for development

## 🔗 API Endpoints

### Authentication Routes (`/api/auth`)
- `GET /google` - Google OAuth initiation
- `POST /logingoogle` - Google OAuth callback
- `POST /refresh` - User registration
- `POST /login` - User login
- `POST /logout` - User logout

### People Routes (`/api/people`)
- `GET /getall` — Get all people
- `POST /createpeople` — Create new person (also triggers login)
- `GET /getpeoplebyid/:peopleId` — Get person by ID
- `GET /getuser` — Get current user (requires JWT)
- `PATCH /updatepeople/:peopleId` — Update person (requires JWT)
- `DELETE /deletepeople/:peopleId` — Delete person (requires JWT)
- `PATCH /addfriend/:peopleId` — Add friend (requires JWT)
- `PATCH /removefriend/:peopleId` — Remove friend (requires JWT)

### Post Routes (`/api/post`)
- `GET /` — Get all posts
- `POST /` — Create new post (requires JWT)
- `GET /p/:postId` — Get post by ID
- `GET /pid` — Get post(s) by query
- `PATCH /likepost/:postId` — Like/unlike a post
- `PATCH /updatepost/:postId` — Update post (requires JWT)
- `DELETE /deletepost/:postId` — Delete post (requires JWT)
- `PATCH /pc/:postId` — Add comment to post (requires JWT)
- `DELETE /dc/:postId` — Delete comment from post (requires JWT)

## 🔐 Authentication Flow

1. **Google OAuth**: Users authenticate via Google OAuth2
2. **JWT Generation**: Server generates JWT tokens upon successful authentication
3. **Token Verification**: Protected routes verify JWT tokens via middleware
4. **Session Management**: Cookies store authentication state
5. **Security**: bcrypt handles password hashing for additional security

## 🗄️ Database Models

### User Model (peopleModel.js)
```javascript
{
  googleId: String,
  email: String,
  name: String,
  avatar: String,
  friends: [ObjectId],
  createdAt: Date
}
```

### Post Model (postModel.js)
```javascript
{
  author: ObjectId,
  content: String,
  likes: [ObjectId],
  comments: [{
    author: ObjectId,
    content: String,
    createdAt: Date
  }],
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 Middleware

### JWT Verification (`verifyJWT.js`)
- Validates JWT tokens in request headers
- Extracts user information from tokens
- Protects authenticated routes
- Handles token expiration and errors

## ☁️ Serverless Deployment

The API is configured for serverless deployment using the Serverless Framework:

1. **AWS Lambda**: Serverless function execution
2. **API Gateway**: HTTP API routing
3. **Auto-scaling**: Automatic scaling based on demand
4. **Cost-effective**: Pay-per-execution pricing model

### Deployment Commands
```bash
# Deploy to AWS
npm run deploy

# Deploy to specific stage
serverless deploy --stage production
```

## 🛡️ Security Features

- **Password Hashing**: bcrypt for secure password storage
- **JWT Authentication**: Stateless token-based authentication
- **CORS Configuration**: Controlled cross-origin access
- **Input Validation**: Request validation and sanitization
- **Environment Variables**: Secure configuration management

## 📱 CORS Configuration

The API is configured to work with the React frontend:
- Allowed origins: Frontend application URL
- Credentials support: Cookie-based authentication
- HTTP methods: GET, POST, PUT, DELETE
- Headers: Authorization, Content-Type

---

Built with Node.js, Express, and MongoDB for scalable social media functionality
