# MuralPay Frontend

React + TypeScript frontend application built with Vite.

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

- `src/components/` - Reusable React components
- `src/pages/` - Page components (Catalog, Admin)
- `src/services/` - API service layer
- `src/types/` - TypeScript type definitions
- `public/images/` - Product images

## Features

- **Product Catalog**: View all available products with images and prices
- **Admin Portal**: Update product prices (accessible at `/admin`)
- **Purchase Flow**: Skeleton implementation for crypto purchases

## API Configuration

The frontend is configured to connect to the backend API at `http://localhost:8000`. This can be changed in `vite.config.ts` if needed.

