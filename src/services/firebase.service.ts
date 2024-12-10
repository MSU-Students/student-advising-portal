import { FirebaseOptions, initializeApp } from 'firebase/app';
import {
  getAuth,
  connectAuthEmulator,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  updateProfile,
  signInWithCredential,
  AuthCredential,
  User,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  UserCredential,
  signInAnonymously,
  sendPasswordResetEmail,
  confirmPasswordReset,
} from 'firebase/auth';

import {
  getFirestore,
  doc,
  getDocs,
  query,
  where,
  updateDoc,
  connectFirestoreEmulator,
  setDoc,
  deleteDoc,
  writeBatch,
  getDocFromServer,
  onSnapshot,
  getCountFromServer,
  getAggregateFromServer,
  sum,
  AggregateSpec,
  average,
  limit,
  QueryConstraint,
  orderBy,
  count,
  FieldPath,
  startAfter,
  startAt,
} from 'firebase/firestore';
import {
  connectStorageEmulator,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  UploadTask,
} from 'firebase/storage';
import {
  getDatabase,
  connectDatabaseEmulator,
  ref as refDb,
  onValue,
} from 'firebase/database';

import { WhereFilterOp } from './firebase-operators';
import { Observable, Subject, retry } from 'rxjs';
import { Models } from './firebase.models';
import { getCollections } from './firebase.collections';
import firebase from '../../firebase.json';
export enum AccessStatus {
  offline = 1,
  online = 2,
  authorized = 4,
  unAuthorized = 8,
  expired = 16,
}
const dbConfig = JSON.parse(
  typeof process.env.DB_CONFIG == 'string'
    ? process.env.DB_CONFIG
    : '{"apiKey":"AIzaSyAnTpKMfEF1aNHOoiGbqNHTdL2ihKr7jDk","authDomain":"gonana-o.firebaseapp.com","projectId":"gonana-o","storageBucket":"gonana-o.firebasestorage.app","messagingSenderId":"301350859500","appId":"1:301350859500:web:b20ddc5d5860ebb9c3abc9","measurementId":"G-ZB0G111937"}'
) as FirebaseOptions;
// Initialize Firebase
const app = initializeApp({
  ...dbConfig,
});
// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
export const fbStore = getFirestore(app);
const fbDb = getDatabase(app);
const fbStorage = getStorage(app);

const googleProvider = new GoogleAuthProvider();

if (/development/i.test(process.env.NODE_ENV) && !process.env.USE_LIVE) {
  if (firebase.emulators) {
    type EmulatorConfig = { [key: string]: { port: number } };
    const emulators = firebase.emulators as unknown as EmulatorConfig;
    if (emulators.auth) {
      connectAuthEmulator(auth, 'http://localhost:' + emulators.auth.port);
    }
    if (emulators.firestore) {
      connectFirestoreEmulator(fbStore, 'localhost', emulators.firestore.port);
    }
    if (emulators.database) {
      connectDatabaseEmulator(fbDb, 'localhost', emulators.database.port);
    }
    if (emulators.storage) {
      connectStorageEmulator(fbStorage, 'localhost', emulators.storage.port);
    }
  }
}

const imagesStorageRef = ref(fbStorage, 'images');
const attachmentsStorageRef = ref(fbStorage, 'attachments');
const collections = getCollections(fbStore);

type Colls = typeof collections;
type ModelName = keyof Colls;
export type QueryOptions = {
  limits?: number;
  previous?: unknown;
  next?: unknown;
  firstItem?: unknown;
  lastVisible?: unknown;
  prevFirstVisible?: unknown;
  firstVisible?: unknown;
  size?: number;
  orderBy?: string;
  order?: 'asc' | 'desc';
};
class FirebaseService {
  constructor() {
    this.accessObs = new Subject();
    const connRef = refDb(fbDb, '.info/connected');
    onValue(connRef, (snap) => {
      if (snap.val() === true) {
        this.setAccessStatus(AccessStatus.online);
      } else {
        this.setAccessStatus(AccessStatus.offline);
      }
    });
  }
  private accessObs?: Subject<AccessStatus>;
  accessStatus = AccessStatus.online;
  setAccessStatus(value: AccessStatus) {
    if (value & AccessStatus.offline) {
      this.accessStatus = this.accessStatus ^ AccessStatus.online;
    } else if (value & AccessStatus.online) {
      this.accessStatus = this.accessStatus | AccessStatus.online;
    }
    if (value & AccessStatus.unAuthorized) {
      this.accessStatus = this.accessStatus ^ AccessStatus.authorized;
    } else if (value & AccessStatus.authorized) {
      this.accessStatus = this.accessStatus | AccessStatus.authorized;
    }
    this.accessObs?.next(value | this.accessStatus);
  }
  subscribe(cb: (online: AccessStatus) => void) {
    return this.accessObs?.subscribe(cb);
  }
  auth() {
    return auth.currentUser;
  }
  refreshToken() {
    return auth.currentUser?.getIdToken(/* forceRefresh */ true);
  }
  async checkTokenRefresh() {
    return auth.currentUser?.getIdTokenResult().then((idTokenResult) => {
      // Compare idTokenResult.expirationTime with current time
      // If the token is about to expire, refresh it
      if (
        idTokenResult &&
        new Date(idTokenResult.expirationTime).getTime() < Date.now()
      ) {
        // Call the function to refresh the token
        return this.refreshToken();
      }
    });
  }
  authenticate() {
    return new Promise<User | null>((resolve) => {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.checkTokenRefresh().then(() => {
            this.setAccessStatus(AccessStatus.authorized);
          });
        } else {
          this.setAccessStatus(AccessStatus.unAuthorized);
        }
        resolve(user);
      });
    });
  }
  async validateAuth() {
    if (!(this.accessStatus & AccessStatus.authorized || !auth.currentUser)) {
      await this.authenticate();
    } else {
      await this.checkTokenRefresh();
    }
  }
  async signOut() {
    this.setAccessStatus(AccessStatus.unAuthorized);
    return signOut(auth);
  }
  async signInWithSession(cred: AuthCredential) {
    const res = await signInWithCredential(auth, cred);
    res && this.setAccessStatus(AccessStatus.authorized);
    return res;
  }
  signInAnonymously(): Promise<UserCredential> {
    return signInAnonymously(auth);
  }
  async signInWithEmailAndPass(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }
  async signInWithGoogleAccount() {
    const res = await signInWithPopup(auth, googleProvider);
    this.setAccessStatus(AccessStatus.authorized);
    return res;
  }
  async createUserWithEmailPass(email: string, password: string) {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await sendEmailVerification(cred.user);
    this.setAccessStatus(AccessStatus.authorized);
    return cred;
  }
  async resendEmailVerification() {
    const cred = await this.authenticate();
    if (cred) {
      await sendEmailVerification(cred);
    } else {
      throw new Error('No user is currently signed in.');
    }
  }

  async sendForgetPassword(email: string) {
    return sendPasswordResetEmail(auth, email);
  }

  async resetPassword(oobCode: string, newPassword: string) {
    return confirmPasswordReset(auth, oobCode, newPassword);
  }

  async uploadImage(file: File, options?: { task?: UploadTask; path: string }) {
    const fileRef = ref(
      imagesStorageRef,
      options ? `${options.path}/${file.name}` : file.name
    );
    const uploadTask = uploadBytesResumable(fileRef, file);
    if (options) options.task = uploadTask;
    return new Promise<string>((resolve, reject) => {
      uploadTask.then((snap) => {
        resolve(getDownloadURL(snap.ref));
      });
      uploadTask.catch(reject);
    });
  }
  async uploadFile(file: File, options?: { task?: UploadTask; path: string }) {
    const fileRef = ref(
      attachmentsStorageRef,
      options ? `${options.path}/${file.name}` : file.name
    );
    const upload = await uploadBytes(fileRef, file, {
      contentType: file.type,
    });
    return getDownloadURL(upload.ref);
  }

  async updateProfile(displayName: string, photoURL?: string) {
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName,
        photoURL,
      });
    }
  }
  async get(modelName: ModelName, id: string): Promise<Models> {
    const docRef = doc(fbStore, modelName, id);
    const docSnap = await getDocFromServer(docRef);
    if (docSnap.exists()) {
      return docSnap.data() as Models;
    }
    return undefined;
  }
  streamWith<T>(
    modelName: ModelName,
    filter: { [field: string]: string | string[] } = {},
    options?: QueryOptions
  ) {
    const { queryRef, collectionRef } = this.getQueryFromFilter(
      modelName,
      filter,
      options
    );
    return new Observable<T[]>((subscriber) => {
      onSnapshot(queryRef || collectionRef, {
        complete: () => subscriber.complete(),
        next: (snapshot) => {
          const records = snapshot.docs.map((doc) => {
            return { ...doc.data(), id: doc.id } as unknown as T;
          });
          if (snapshot.metadata.fromCache) {
            subscriber.next();
            return;
          }
          const lastVisible = snapshot.docs[snapshot.docs.length - 1];
          if (options) {
            options.firstVisible = snapshot.docs[0];
            options.firstItem = options.firstItem || options.firstVisible;
            options.lastVisible = lastVisible;
          }
          subscriber.next(records);
        },
        error: (err) => subscriber.error(err),
      });
    }).pipe(
      retry({
        delay: 1000 * 5,
      })
    );
  }
  async findAll(
    modelName: ModelName,
    filter: { [field: string]: string } = {},
    options?: QueryOptions
  ): Promise<Models[] | undefined> {
    const { queryRef, collectionRef } = this.getQueryFromFilter(
      modelName,
      filter,
      options
    );
    const docsRef = await getDocs(queryRef || collectionRef);
    if (docsRef.empty) {
      return !docsRef.metadata.fromCache ? [] : undefined;
    } else {
      if (options) {
        options.size = docsRef.size;
        options.lastVisible = docsRef.docs[docsRef.docs.length - 1];
      }
      return docsRef.docs.map((d) => d.data() as Models);
    }
  }
  async count(modelName: ModelName, filter?: Record<string, string>) {
    const query = this.getQueryFromFilter(modelName, filter || {});
    const result = await getCountFromServer(
      query.queryRef || query.collectionRef
    );
    return result.data().count;
  }
  async aggregate(
    modelName: ModelName,
    specs: Record<string, string>,
    filter?: Record<string, string>
  ) {
    const query = this.getQueryFromFilter(modelName, filter || {});
    const specVariables = Object.keys(specs);
    const aggregateSpecs = {
      ...specVariables.reduce((prev, curr) => {
        if (/^(average|mean)/.test(curr)) {
          prev[curr.replace('.', '')] = average(specs[curr]);
        } else if (/^(sum|total)/.test(curr)) {
          prev[curr.replace('.', '')] = sum(specs[curr]);
        } else if (/^(count)/.test(curr)) {
          prev[curr.replace('.', '')] = count();
        }
        return prev;
      }, {} as AggregateSpec),
    };
    const result = await getAggregateFromServer(
      query.queryRef || query.collectionRef,
      aggregateSpecs
    );
    if (specVariables.length == 1) {
      return result.data()[specVariables[0].replace('.', '')];
    } else {
      return result.data();
    }
  }
  private getQueryFromFilter(
    modelName: ModelName,
    filter: { [field: string]: string | string[] },
    options?: QueryOptions
  ) {
    const collectionRef = collections[modelName]();
    const { limits } = options ?? {};
    const supOps = /(.*) (==|<|<=|>=|!=|in|array-contains)$/;
    const conditions: QueryConstraint[] = Object.keys(filter)
      .filter((f) => typeof filter[f] !== 'undefined')
      .map((f) => {
        const match = supOps.exec(f);
        if (match) {
          const OPERAND = 1,
            OPERATOR = 2;
          const operand = /\./.test(match[OPERAND])
            ? new FieldPath(...match[OPERAND].split('.'))
            : match[OPERAND];
          const operator = match[OPERATOR] as WhereFilterOp;
          return where(operand, operator, filter[f]);
        }
        return where(f, '==', filter[f]);
      });
    if (typeof options?.orderBy == 'string') {
      conditions.push(orderBy(options?.orderBy, options.order ?? 'asc'));
    }
    if (typeof limits == 'number') {
      conditions.push(limit(limits));
    }
    if (options?.next) {
      conditions.push(startAfter(options?.next));
    } else if (options?.previous) {
      conditions.push(startAt(options?.previous));
    }

    const queryRef =
      conditions.length > 0 && query(collectionRef, ...conditions);
    return { queryRef, collectionRef };
  }

  async create(modelName: ModelName, value: Models) {
    await this.validateAuth();
    if (value) {
      const docRef = doc(fbStore, modelName + '/' + value.key);
      await new Promise<void>((res, rej) => {
        try {
          const clone = this.clone(value);
          setDoc(docRef, clone).then(() => {
            res();
          });
          const unsubscribe = onSnapshot(docRef, () => {
            unsubscribe();
            setTimeout(() => {
              rej('timeout');
            }, 5 * 1000);
          });
        } catch (error) {
          rej(error);
        }
      });
    }
    return value;
  }
  clone<T>(val: T) {
    return JSON.parse(JSON.stringify(val)) as T;
  }
  async update(modelName: ModelName, id: string, value: Models) {
    await this.validateAuth();
    const docRef = doc(fbStore, modelName, id);
    if (value) {
      await updateDoc(docRef, { ...this.clone(value) });
    }
  }
  async patch(modelName: ModelName, id: string, prop: string, value: unknown) {
    await this.validateAuth();
    const docRef = doc(fbStore, modelName, id);
    if (typeof value !== 'undefined') {
      const data = {
        [prop]: typeof value == 'object' ? this.clone(value) : value,
      };
      await updateDoc(docRef, data);
      return true;
    }
    return false;
  }
  async delete(modelName: ModelName, id: string) {
    await this.validateAuth();
    const docRef = doc(fbStore, modelName, id);
    await deleteDoc(docRef);
  }
  async deleteCollection(modelName: ModelName) {
    await this.validateAuth();
    const batch = writeBatch(fbStore);
    const docRef = doc(fbStore, modelName);
    batch.delete(docRef);
    return batch.commit();
  }
}

export const firebaseService = new FirebaseService();
