
# Amrut

  

Amrut is a daily reflection app designed to encourage users to reflect on gratitude. The app sends a daily text message prompt to users, who can respond with their reflections. These responses are then stored in their personal profile, accessible via the text interface.

  

## Features

  

-  **Daily Reflection Prompts:** Sends a scheduled SMS to users prompting them to reflect on something positive.

-  **User Authentication:** Secure signup and login functionality.

-  **Real-time Data Storage:** Responses are saved in real time, allowing users to view past reflections.

-  **Responsive Web Interface:** Users can interact with the service through the text interface.

  

## Technologies Used

  

-  **Node.js** and **Express** for backend services.

-  **Firebase Firestore** for data storage

-  **Twilio SMS API** for sending and receiving text messages.

-  **Heroku** for hosting the application.

  

## Local Setup

  

### Prerequisites

  

- Node.js installed on your machine.

- A Twilio account for handling SMS services.

- Firebase project setup for authentication and database.

- Ngrok setup for secure tunnel to localhost

  

### Installation

  

1.  **Clone the repository:**

```
git clone https://github.com/your-username/amrut.git
cd amrut
```

  

2.  **Install dependencies:**

```
npm install
```

3. **Set up environment variables:**

Create a .env file in the root directory and update it with your Firebase and Twilio credentials:

```
FIREBASE_API_KEY=your_firebase_api_key

TWILIO_ACCOUNT_SID=your_twilio_account_sid

TWILIO_AUTH_TOKEN=your_twilio_auth_token
```

4. **Run the application:**

```
npm start
```

This will start the server locally on http://localhost:3000.
  

5. **Setup Twilio Webhook**

Run ngrok and paste updated webhook url in Twilio

  

### Usage

Sign up/Log in: First, users need to sign up or log in through the web interface.

Receive and Respond to Prompts: Users will receive a daily text message and can respond directly via SMS.

View Reflections: Users can view their past reflections on the text interface.

  

### Contributing

  

1. Fork the Project

2. Create your Feature Branch (git checkout -b feature/AmazingFeature)

3. Commit your Changes (git commit -m 'Add some AmazingFeature')

4. Push to the Branch (git push origin feature/AmazingFeature)

5. Open a Pull Request

  

### License

Distributed under the MIT License. See LICENSE for more information.

  

### Contact

Vatsal Rami - vatsalrami@gmail.com

  

Project Link: https://www.seekamrut.com