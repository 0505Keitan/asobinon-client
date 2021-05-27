import firebase from './index';

// asyncなので一応隔離した
const getIdToken = async () => {
  return await firebase.auth().currentUser?.getIdToken();
};

export default getIdToken;
