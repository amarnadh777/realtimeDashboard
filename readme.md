Description:
This full-stack web application allows users to interact with real-time data visualizations and create/edit flowcharts with persistence. It features:

OTP-based Authentication: Secure signup and login via One-Time Passwords (OTP) for a smooth user experience.

Live Data Visualization: Real-time chart updates, simulating sensor data for live tracking and monitoring.

Flowchart Editor: An interactive tool for creating, editing, and saving flowcharts, with data persistence to the MongoDB database.

🚀 Installation

1. Clone the Repository
Start by cloning the repository to your local machine:
git clone https://github.com/your-username/your-repo.git
cd your-repo


2. Install Backend Dependencies
Navigate to the /server folder and install the backend dependencies:
cd server
npm install

3. Install Frontend Dependencies
Navigate to the /client folder and install the frontend dependencies:
cd client
npm install
🔑 Environment Variables
4. Start the Backend Server
Once the dependencies are installed, you can start the backend server. Navigate to the /server folder and run:

cd server
npm run dev

5. Start the Frontend Client
Now, navigate to the /client folder and start the frontend React app:

cd client
npm start


🔑 Environment Variables
PORT=5000
DB_URI=your_mongodb_connection_uri
JWT_SECRET=your_jwt_secret_key

MAIL_USER = "your email"
MAIL_PASSWORD="your app password"



