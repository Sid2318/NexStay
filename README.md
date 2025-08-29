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
- **AI-Powered Chat Assistant**: Get instant help with bookings, questions, and information through our intelligent chatbot

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
- **Smart Chatbot**: 24/7 AI assistant using Groq's Llama-3.1-8B-Instant model
- **Adaptive Chat**: Automatic fallback to basic responses if AI service is unavailable

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

### AI & Machine Learning

- **Groq API**: Ultra-fast LLM inference for the chatbot
- **Llama-3.1-8B-Instant**: State-of-the-art language model for intelligent responses
- **LangGraph**: Graph-based conversational memory for context awareness
- **Python Integration**: Seamless integration of Python ML capabilities with Node.js backend

### Authentication

- **Session-based Authentication**: Secure user sessions
- **bcrypt**: For password hashing and security

## Project Structure

```
NexStay/
├── backend/                 # Node.js/Express backend
│   ├── controllers/         # Route controllers
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── utils/               # Utility functions
│   │   ├── chatbot/         # Python chatbot files
│   │   └── pdf/             # PDF generation utilities
│   ├── uploads/             # Property images storage
│   ├── views/               # EJS templates
│   └── app.js               # Main application file
│
├── frontend/                # React frontend application
│   ├── public/              # Static files
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── services/        # API service functions
│   │   ├── styles/          # CSS and styling
│   │   └── App.jsx          # Main React component
│
├── CHATBOT_README.md        # Chatbot documentation
└── README.md                # Project documentation
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
cd backend
npm install
```

3. Install frontend dependencies

```bash
cd frontend
npm install
```

4. Set up environment variables

   - Create `.env` file in the backend directory with the following variables:

   ```
   MONGODB_URI=your_mongodb_connection_string
   SESSION_SECRET=your_session_secret
   PORT=3000
   GROQ_API_KEY=your_groq_api_key
   ```

5. Set up the AI chatbot (optional)

   ```bash
   cd backend
   pip install -r utils/chatbot/requirements.txt
   node utils/chatbot/setup.js
   ```

6. Start the development server

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

### AI-Powered Chat Assistant

The chatbot provides intelligent assistance with:

- Answering questions about properties and bookings
- Providing guidance on using the platform
- Offering travel recommendations
- Assisting with payment and reservation issues
- Automatically adapting to user needs

Key technical features:

- Uses Groq's Llama-3.1-8B-Instant language model
- Maintains conversation context
- Falls back to basic responses if AI is unavailable
- Displays chat status (AI Powered/Basic Mode)
- Remembers conversations during user sessions

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
- **Advanced AI Features**:
  - Integration with booking system to allow direct reservations through chat
  - Multi-language support for international travelers
  - Personalized recommendations based on user preferences
  - Integration with local attraction and event information

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
- AI technology powered by Groq's Llama-3.1-8B-Instant model
- Thanks to all contributors who participated in this project
