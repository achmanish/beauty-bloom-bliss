# Élégance - Luxury Beauty & Skincare E-commerce Platform

A modern, responsive e-commerce platform for beauty and skincare products, built with React, TypeScript, and Supabase.

## Features

- **Product Catalog**: Browse luxury beauty and skincare products with advanced filtering
- **User Authentication**: Secure login/registration system
- **Shopping Cart**: Smart cart management with quantity controls
- **Checkout System**: Multiple payment options including Cash on Delivery
- **Admin Dashboard**: Complete store management interface
- **Order Management**: Track orders and delivery status
- **Wishlist**: Save favorite products for later
- **Search**: Real-time product search functionality
- **Responsive Design**: Mobile-first responsive design

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Build Tool**: Vite
- **UI Components**: shadcn/ui
- **State Management**: React Context API
- **Routing**: React Router DOM
- **Forms**: React Hook Form with validation

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repository-url>
cd elegance-ecommerce
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the root directory and add your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:8080`

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # shadcn/ui components
│   ├── account/        # User account components
│   ├── admin/          # Admin dashboard components
│   ├── checkout/       # Checkout process components
│   └── ...
├── pages/              # Route components
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── services/           # API services
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Key Features

### User Experience
- Multi-language support (English/Nepali)
- Nepal-centric design with local currency (NPR)
- Mobile-responsive interface
- Real-time search and filtering

### E-commerce Functionality
- Product catalog with categories
- Shopping cart with quantity management
- Secure checkout process
- Order tracking and history
- Wishlist management

### Admin Features
- Product management
- Order processing
- Customer management
- Sales analytics
- Coupon management

### Payment & Shipping
- Multiple payment gateways
- Cash on Delivery option
- Flexible shipping options
- Real-time cost calculation

## Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
```

### Deploy to Netlify

```bash
npm run build
# Upload the dist/ folder to Netlify
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact [your-email@example.com]