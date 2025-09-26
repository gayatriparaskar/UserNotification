# SnakeShop - React E-commerce Frontend

A modern React-based e-commerce frontend for a snake shop, built with React, Tailwind CSS, and connected to the NotificationBackend API.

## 🚀 Features

- **Modern React Architecture**: Built with React 18, React Router, and Context API
- **Tailwind CSS**: Beautiful, responsive design with custom styling
- **Real API Integration**: Connected to NotificationBackend for live data
- **Authentication**: User login/registration with JWT tokens
- **Shopping Cart**: Persistent cart with local storage
- **Order Management**: View order history and track orders
- **Product Catalog**: Browse, search, and filter products
- **Care Guide**: Comprehensive snake care information
- **Responsive Design**: Mobile-first approach with Tailwind CSS

## 🛠️ Tech Stack

- **Frontend**: React 18, React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Vite
- **API**: REST API integration with NotificationBackend

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   VITE_API_URL=https://notificationbackend-35f6.onrender.com/api
   ```
   
   For local development, you can also use:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Build for Production**
   ```bash
   npm run build
   ```

## 🔧 Configuration

### API Configuration
The frontend connects to the NotificationBackend API. Make sure the backend is running on `http://localhost:5000`.

### Environment Variables
- `VITE_API_URL`: Backend API URL (default: https://notificationbackend-35f6.onrender.com/api)

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   └── Navbar.jsx      # Navigation component
├── contexts/           # React Context providers
│   ├── AuthContext.jsx # Authentication state
│   ├── CartContext.jsx # Shopping cart state
│   └── ProductContext.jsx # Product data management
├── pages/              # Page components
│   ├── Home.jsx        # Homepage
│   ├── Catalog.jsx     # Product catalog
│   ├── ProductDetail.jsx # Product details
│   ├── Cart.jsx        # Shopping cart
│   ├── Orders.jsx      # Order history
│   ├── CareGuide.jsx   # Snake care guide
│   ├── Login.jsx       # User login
│   └── Register.jsx     # User registration
├── services/           # API services
│   └── api.js          # API client
├── App.jsx             # Main app component
├── main.jsx            # React entry point
└── index.css           # Global styles
```

## 🔌 API Integration

The frontend integrates with the NotificationBackend API:

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Product Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `GET /api/products/categories` - Get product categories

### Order Endpoints
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get single order

### Notification Endpoints
- `GET /api/notifications` - Get user notifications
- `PUT /api/notifications/:id/read` - Mark notification as read

## 🎨 Styling

The project uses Tailwind CSS with custom configuration:

### Custom Colors
- **Primary**: Green tones for snake/nature theme
- **Secondary**: Gold/yellow for accents
- **Gradients**: Custom gradient utilities

### Custom Components
- `.btn` - Button styles
- `.card` - Card components
- `.input` - Form inputs
- `.badge` - Notification badges

## 🚀 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### Development Workflow
1. Start the NotificationBackend server
2. Run `npm run dev` to start the frontend
3. Open `http://localhost:3000` in your browser

## 🔐 Authentication

The app uses JWT tokens for authentication:
- Tokens are stored in localStorage
- Automatic token refresh on API calls
- Protected routes require authentication

## 🛒 Shopping Cart

Features:
- Persistent cart with localStorage
- Real-time updates
- Quantity management
- Cart validation

## 📱 Responsive Design

The app is fully responsive with:
- Mobile-first design approach
- Touch-friendly interactions
- Optimized for all screen sizes
- Progressive Web App features

## 🐍 Snake-Specific Features

- **Care Guide**: Comprehensive snake care information
- **Difficulty Levels**: Beginner, Intermediate, Expert
- **Product Categories**: Pythons, Boas, Colubrids, etc.
- **Specifications**: Detailed snake information
- **Expert Support**: 24/7 reptile expert support

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
- `VITE_API_URL` - Production API URL

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Check the documentation
- Open an issue on GitHub
- Contact the development team

---

**SnakeShop** - Your trusted source for premium snakes and reptile supplies. 🐍✨