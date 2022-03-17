
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors({ origin: true }));
var serviceAccount = require("./permission.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://booking-test-1-d618e.firebaseio.com"
});
const db = admin.firestore();


app.post('/bookings', (req, res) => {
    (async () => {
        try {
            const document = db.collection('boxes').doc(req.body.boxId);
            let item = await document.get();
            let response = item.data();
            console.log(response)
            if(!response.isAvailable) {
                return res.status(400).send("box is not available");
            }
          await db.collection('bookings').doc('/' + req.body.id + '/')
              .create(req.body);
              await document.update({
                  isAvailable: false
              });
      
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
      
  });

  app.post('/users', (req, res) => {
    (async () => {
        try {
          await db.collection('users').doc('/' + req.body.userId + '/')
              .create(req.body);
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();

      
      
  });

  app.post('/boxes', (req, res) => {
    (async () => {
        try {
          await db.collection('boxes').doc('/' + req.body.boxId + '/')
              .create(req.body);
          return res.status(200).send();
        } catch (error) {
          console.log(error);
          return res.status(500).send(error);
        }
      })();
      
  });



exports.app = functions.https.onRequest(app);
