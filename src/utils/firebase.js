import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import 'firebase/storage';

const config = {
    apiKey: 'AIzaSyBYAulgfRKB98GKfvCVS1VQNRzGKD_IJqo',
    authDomain: 'testapi-3a32b.firebaseapp.com',
    databaseURL: 'https://testapi-3a32b.firebaseio.com',
    projectId: 'testapi-3a32b',
    storageBucket: 'testapi-3a32b.appspot.com',
    messagingSenderId: '669498926395',
    appId: '1:669498926395:web:2da04088cf2d574103031e'
};

console.log("Firebase config :", config)

firebase.initializeApp(config);
firebase.auth().languageCode = 'en_EN';

export const createUserProfileDocument = async (userAuth, additionalData) => {
  if (!userAuth) return;

  const userRef = firestore.doc(`users/${userAuth.uid}`);

  const snapShot = await userRef.get();


  if (!snapShot.exists) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();
    try {
      await userRef.set({
        displayName,
        email,
        createdAt,
        ...additionalData,
      });
    } catch (error) {
      console.log('error creating user', error.message);
    }
  } else {
    //set new token
    try {
      if(additionalData) {
        await userRef.update({
          ...additionalData
        })
      }
    } catch(error){
      console.log('error setting new token', error.message)
    }
  }

  return userRef;
};

export const addCollectionAndDocuments = async (collectionKey, objectToAdd) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();
  objectToAdd.forEach((obj) => {
    const newDocRef = collectionRef.doc();
    batch.set(newDocRef, obj);
  });

  await batch.commit();
};

export const createSlugForDocuments = async (collectionKey) => {
  const collectionRef = firestore.collection(collectionKey);

  const batch = firestore.batch();

  const collections = await collectionRef.get();

  collections.docs.forEach((collection, index) => {
    let { items, ...otherProps } = collection.data();

    items.forEach((collectionItem) => {
      let slug = collectionItem.name
        .toLowerCase()
        .split('-')
        .join('_')
        .split(' ')
        .join('-');
      collectionItem.slug = slug;
    });
    batch.set(collection.ref, { items, ...otherProps });
  });

  await batch.commit();
};

export const convertCollectionsSnapshotToMap = (collectionSnapshot) => {
  const transformedCollection = collectionSnapshot.docs.map((doc) => {
    const { title, items } = doc.data();

    return {
      routeName: encodeURI(title),
      id: doc.id,
      title,
      items,
    };
  });

  return transformedCollection.reduce((acc, collection) => {
    acc[collection.title.toLowerCase()] = collection;
    return acc;
  }, {});
};

export const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubcribe = auth.onAuthStateChanged((userAuth) => {
      unsubcribe();
      resolve(userAuth);
    }, reject);
  });
};

export const auth = firebase.auth();
export const firestore = firebase.firestore();

export const googleProvider = new firebase.auth.GoogleAuthProvider();
export const facebookProvider = new firebase.auth.FacebookAuthProvider();
facebookProvider.setCustomParameters({
  display: 'popup',
  prompt: 'select_account'
});
googleProvider.setCustomParameters({ prompt: 'select_account' });
export const signInWithFacebook = () => auth.signInWithPopup(facebookProvider);
export const signInWithGoogle = () => auth.signInWithPopup(googleProvider);

export default firebase;
