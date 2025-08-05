const express = require('express');
const admin = require('firebase-admin');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 3000;

// Parse incoming JSON
app.use(bodyParser.json());

// Initialize Firebase Admin SDK with your service account
const serviceAccount = require('./firebase-service-account.json'); // Make sure the file is in the root

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Test route
app.get('/hello', (req, res) => {
  res.json({ message: 'Hello from Render!' });
});

// Push Notification route
app.post('/send-notification', async (req, res) => {
  const { token, title, body } = req.body;

  if (!token || !title || !body) {
    return res.status(400).json({ error: 'Missing token, title or body' });
  }

  const message = {
    notification: {
      title: title,
      body: body,
    },
    token: token,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ success: true, messageId: response });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
