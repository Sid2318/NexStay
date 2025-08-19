# NexStay

![NexStay Logo](public/images/NexStay.png)

A modern property rental platform inspired by Airbnb, built with the MERN stack (MongoDB, Express, React, Node.js). NexStay provides a seamless experience for both guests looking to book accommodations and hosts managing their property listings.

## Features

### For Guests

- **Browse Properties**: Explore a wide range of accommodations with detailed listings
- **Property Details**: View high-quality images, descriptions, locations, and ratings
- **Favorites System**: Save properties to your favorites for quick access later
- **Booking System**: Reserve properties with a streamlined booking process
- **PDF Download**: Download property details as PDF for offline reference
- **Booking Management**: View and manage all your bookings in one place

### For Hosts

- **Property Management**: Add, edit, and manage your property listings
- **Image Upload**: Upload high-quality images of your properties
- **Listing Analytics**: View performance metrics for your listings
- **Booking Overview**: Manage reservations and guest communications

### General Features

- **Responsive Design**: Optimized UI for desktop, tablet, and mobile devices
- **Modern UI**: Clean, minimal design with intuitive navigation
- **User Authentication**: Secure login and registration system
- **User Profiles**: Personalized user experience with profile management

## Technology Stack

### Frontend

- **React**: JavaScript library for building the user interface
- **React Router**: For handling routing in the single-page application
- **Axios**: For making HTTP requests to the backend API
- **Tailwind CSS**: For styling with utility-first CSS framework
- **Modern CSS**: Custom styling with CSS variables and modern techniques

### Backend

- **Node.js**: JavaScript runtime for the server
- **Express.js**: Web application framework for Node.js
- **MongoDB**: NoSQL database for storing application data
- **Mongoose**: MongoDB object modeling for Node.js
- **Multer**: For handling file uploads
- **PDFKit**: For generating PDF documents

### Authentication

- **Session-based Authentication**: Secure user sessions
- **bcrypt**: For password hashing and security

## Project Structure

```
NexStay/
├── frontend/                 # React frontend application
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Page components
│   │   ├── styles/           # CSS and styling
│   │   └── ...
├── controllers/              # Express route controllers
├── models/                   # MongoDB models
├── routes/                   # Express routes
├── utils/                    # Utility functions
├── public/                   # Static assets
│   └── images/               # Image assets
├── views/                    # EJS templates (legacy)
├── uploads/                  # Uploaded files
├── app.js                    # Express app entry point
└── package.json              # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- MongoDB

### Installation

1. Clone the repository

```bash
git clone https://github.com/Sid2318/NexStay.git
cd NexStay
```

2. Install backend dependencies

```bash
npm install
```

3. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

4. Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nexstay
SESSION_SECRET=your_session_secret
```

5. Start the development server

```bash
# Start backend server
npm run dev

# In another terminal, start the frontend
cd frontend
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

## User Types

- **Guest**: Users who can browse and book properties
- **Host**: Users who can list and manage their properties
- **Admin**: Super users who can manage the entire platform

## Features in Detail

### Property Listings

Properties include details such as:

- Property name and description
- Location information
- Price per night
- Rating system
- Image gallery
- Availability calendar

### Booking Process

1. User selects property
2. Chooses dates
3. Reviews booking details
4. Selects payment method
5. Confirms booking

### User Management

- User registration and login
- Profile management
- Role-based access control

## Future Enhancements

- **Search Filters**: Advanced filtering options for property search
- **Reviews System**: Allow guests to leave reviews after their stay
- **Messaging System**: In-app communication between guests and hosts
- **Payment Integration**: Real-time payment processing
- **Calendar Sync**: Integration with external calendars
- **Mobile App**: Native mobile applications for iOS and Android

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Design inspired by Airbnb's user interface
- Thanks to all contributors who participated in this project
