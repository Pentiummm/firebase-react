// The Cloud Functions for Firebase SDK to create Cloud Functions and setup triggers.
const functions = require('firebase-functions');

// The Firebase Admin SDK to access the Firebase Realtime Database.
var admin = require('firebase-admin');

var serviceAccount = require('./fir-function-api-d01b6-firebase-adminsdk-f63wb-c1c8a93703.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
	databaseURL: 'https://fir-function-api-d01b6.firebaseio.com',
});

const firebaseConfig = {
	apiKey: 'AIzaSyCPiEPpq60IQpBqZzjwcQA9OeNOUnGwMmo',
	authDomain: 'fir-function-api-d01b6.firebaseapp.com',
	databaseURL: 'https://fir-function-api-d01b6.firebaseio.com',
	projectId: 'fir-function-api-d01b6',
	storageBucket: 'fir-function-api-d01b6.appspot.com',
	messagingSenderId: '380534330287',
	appId: '1:380534330287:web:8fe6bee2543e08e96f955a',
	measurementId: 'G-GRYHKDJ9PE',
};
const express = require('express');
const app = express();

const firebase = require('firebase');
firebase.initializeApp(firebaseConfig);

const db = admin.firestore();

app.get('/screams', (req, res) => {
	db.collection('screams')
		.orderBy('createdAt', 'desc')
		.get()
		.then(data => {
			let screams = [];
			data.forEach(doc => {
				screams.push({
					screamId: doc.id,
					body: doc.data().body,
					userHandle: doc.data().userHandle,
					createdAt: doc.data().createdAt,
				});
			});
			return res.json(screams);
		})
		.catch(err => console.error(err));
});
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

app.post('/scream', (req, res) => {
	if (req.method !== 'POST') {
		return res.status(400).json({ error: 'Method not allowed' });
	}
	const newScream = {
		body: req.body.body,
		userHandle: req.body.userHandle,
		createdAt: new Date().toISOString(),
	};

	db.collection('screams')
		.add(newScream)
		.then(doc => {
			res.json({ message: `document ${doc.id} created successfully` });
		})
		.catch(err => {
			res.status(500).json({ error: 'Something went wrong' });
			console.error(err);
		});
});

// Signup route
app.post('/signup', (req, res) => {
	const newUser = {
		email: req.body.email,
		password: req.body.password,
		confirmPassword: req.body.confirmPassword,
		handle: req.body.handle,
	};

	// TODO validate data
	firebase
		.auth()
		.createUserWithEmailAndPassword(newUser.email, newUser.password)
		.then(data => {
			return res.status(201).json({ message: `user ${data.user.uid} signed up successfully` });
		})
		.catch(err => {
			console.error(err);
			return res.status(500).json({ error: 'err.code' });
		});
});

exports.api = functions.region('asia-east2').https.onRequest(app);
