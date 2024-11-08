import { Firestore, collection } from 'firebase/firestore';

export function getCollections(fbStore: Firestore) {
  return {
    'profiles': () => collection(fbStore, 'profiles'),
    'bookings': () => collection(fbStore, 'bookings'),
  };
}
