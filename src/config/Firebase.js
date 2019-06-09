import * as firebase from 'firebase'

var config = {
  apiKey: "AIzaSyDsCMDtO9Euuj8zp_WramXj2XQQWSmtr44",
  authDomain: "auctionapp-3f58e.firebaseapp.com",
  databaseURL: "https://auctionapp-3f58e.firebaseio.com",
  projectId: "auctionapp-3f58e",
  storageBucket: "auctionapp-3f58e.appspot.com",
  messagingSenderId: "499850160098"
};

firebase.initializeApp(config);
export default firebase