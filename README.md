# GravyTrain Restaurant Demo

GravyTrain is a full-stack restaurant demo application built with Express, React, and Node.js. This project integrates a Stripe Payment Server with a Strapi-powered CMS, and it features a custom PIXI JS particle effect that animates looping train smoke in the logo. This combination sets GravyTrain apart by demonstrating secure payment processing, dynamic content management.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [File Structure](#file-structure)
- [Installation & Setup](#installation--setup)
  - [Environment Variables](#environment-variables)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Running the Application](#running-the-application)
  - [Development](#development)
  - [Production Build](#production-build)
- [Deployment](#deployment)
- [Additional Notes](#additional-notes)
- [License](#license)

---

## Overview

GravyTrain is a production-ready demo simulating a modern restaurant application. It features:
- **Frontend:** Built with Vite and React for a fast, responsive UI.
- **Backend:** Powered by Express and Node.js with two core services:
  - **Stripe Payment Server:** For secure payment processing.
  - **Strapi CMS:** For dynamic restaurant data management.
- **Custom Animation:** A PIXI JS-powered particle effect creates looping train smoke in the logo, enhancing the visual appeal.

---

## Features

- **Express-Based API:** A robust Node.js/Express backend integrated with Stripe for payments.
- **Strapi CMS Integration:** Manages dishes, orders, payments, and restaurant data.
- **Dynamic Particle Animation:** Uses PIXI JS to render a continuous train smoke effect in the logo.
- **Optimized Frontend:** Built with Vite and React (with Hot Module Replacement) for rapid development.
- **Responsive Design:** Ensures an optimal user experience on all devices.
- **Full-Stack Integration:** Seamlessly combines modern payment processing with dynamic content management.

---

## Tech Stack

- **Frontend:** React, Vite, PIXI JS, JavaScript/TypeScript
- **Backend:** Express, Node.js
- **Payment Service:** Stripe Payment Server
- **CMS/Database:** Strapi
- **Styling:** Customize your styling (e.g., Tailwind CSS or custom CSS)
- **Routing & Types:** React Router with custom type definitions

---

## File Structure
<pre>
.
├── app/                      # Static assets and main React entry point
│   ├── app.css
│   ├── root.jsx
│   ├── routes.js
│   └── welcome/              # Welcome page and logo resources
│       ├── logo-dark.svg
│       ├── logo-light.svg
│       └── welcome.jsx
├── backend/                  # Backend services
│   ├── start-backend.js      # Unified script to launch backend services
│   ├── strapi-server/        # Strapi CMS for restaurant data
│   │   ├── api/              # API endpoints (dish, order, payment, restaurant)
│   │   ├── config/           # Strapi configuration (database, admin, routes)
│   │   ├── data/             # Demo data and uploads (images)
│   │   ├── database/         # Migrations and schema files
│   │   ├── public/           # Public assets for Strapi (e.g., robots.txt)
│   │   └── package.json
│   └── stripe-server/        # Express server handling Stripe payments
│       ├── create-payment-intent.js
│       ├── log-stripe.js
│       └── stripe-server.js
├── public/                   # Frontend public assets
│   ├── images/               # Demo images and logos
│   └── site.webmanifest
├── src/                      # React source code
│   ├── App.jsx
│   ├── components/           # Reusable UI components (cart, checkout, etc.)
│   ├── effects/              # Visual effects, including PIXI JS train smoke animation
│   ├── hooks/                # Custom hooks (e.g., useRestaurantID.jsx)
│   └── routes/               # Frontend route components (checkout, homepage, etc.)
├── styles/                   # Global CSS styling
│   └── globals.css
├── .dockerignore
├── .gitignore
├── README.md
├── package.json              # Root package dependencies (frontend)
├── package-lock.json
└── vite.config.js            # Vite configuration for building the React app
</pre>


## Installation & Setup

### Environment Variables

Store sensitive configuration information in environment variables. Use these sample files for guidance:
- **Backend:** Copy `backend/.env.example` to `backend/.env` and fill in your Stripe API keys, database credentials, etc.
- **Stripe Server:** In `backend/stripe-server`, create an `.env` file with your Stripe credentials.
- **Frontend:** Configure any required environment variables as per [Vite's documentation](https://vitejs.dev/guide/env-and-mode.html).

### Backend Setup

1. **Install Dependencies:**
   ```bash
   cd backend
   npm install
   ```
2. **Setup Strapi Server:**
   - Navigate to `backend/strapi-server` and update configuration files in the `config/` directory.
   - Copy `.env.example` to `.env` if needed.
3. **Setup Stripe Server:**
   ```bash
   cd stripe-server
   npm install
   ```

### Frontend Setup

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Customize the Application:**
   Modify files in `app/` and `src/` to tailor the UI and routing for your restaurant demo.

---

## Running the Application

### Development

- **Frontend:** Run the development server with:
  ```bash
  npm run dev
  ```
- **Backend Services:** In separate terminal windows, run:
  ```bash
  # Run the Stripe Payment Server:
  cd backend/stripe-server
  node stripe-server.js

  # Run the Strapi CMS in development mode:
  cd ../strapi-server
  npm run develop
  ```
Alternatively, use the unified `start-backend.js` script if configured.

### Production Build

1. **Build the Frontend:**
   ```bash
   npm run build
   ```
2. **Run the Backend Services:** Ensure production environment variables are set.
   - Start the Stripe server:
     ```bash
     cd backend/stripe-server
     node stripe-server.js
     ```
   - Start the Strapi server:
     ```bash
     cd ../strapi-server
     npm run start
     ```

---

### Manual Deployment

For manual deployment:
1. Build the frontend and backend separately.
2. Set the appropriate environment variables.
3. Deploy your Node.js applications (Stripe and Strapi servers) to your chosen hosting platform.

---

## Additional Notes

- **Demo Media:** The uploads in `backend/strapi-server/data/uploads` contain demo images essential for showcasing the application. They are organized by size (small, medium, large, thumbnails). Optimize these images or consider using Git LFS if repository size becomes a concern.
- **Animated Logo:** The PIXI JS-powered train smoke effect adds a dynamic, eye-catching element to the logo.
- **Customization:** GravyTrain is fully customizable. Modify the UI, API endpoints, and backend settings as needed. Contributions and suggestions are welcome.

---

## License

This project is licensed under the MIT License. 
