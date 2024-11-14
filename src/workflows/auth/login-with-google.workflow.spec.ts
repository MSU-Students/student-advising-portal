import { firebaseService } from 'src/services/firebase.service';
import { TheWorkflows } from '../the-workflows'
import { User } from 'firebase/auth';
import { IProfile } from 'src/entities';
import { createPinia, setActivePinia } from 'pinia';

describe('login with google', () => {
  beforeEach(() => {
    // creates a fresh pinia and makes it active
    // so it's automatically picked up by any useStore() call
    // without having to pass it to it: `useStore(pinia)`
    setActivePinia(createPinia())
  })
  beforeAll(() => {
    import('src/workflows/auth/login-with-google.workflow');
  })
  it('should allow login with google successfully', (done) => {
    const loginSpy = jest.spyOn(firebaseService, 'signInWithGoogleAccount');
    const getProfileSpy = jest.spyOn(firebaseService, 'get');
    loginSpy.mockResolvedValue({
      operationType: 'signIn',
      providerId: '',
      user: {
        displayName: ''
      } as User
    });
    getProfileSpy.mockResolvedValue({
      fullName: 'test'
    } as IProfile)
    TheWorkflows.emit({
      type: 'loginWithGoogle',
      arg: {
        success: () => {
          expect(loginSpy).toHaveBeenCalled();
          done();
        },
      }
    })
  })
  it('should failed when use cancels the signin', (done) => {
    const loginSpy = jest.spyOn(firebaseService, 'signInWithGoogleAccount');
    loginSpy.mockRejectedValue('cancelled');
    TheWorkflows.emit({
      type: 'loginWithGoogle',
      arg: {
        success: () => {
          //
        },
        error(err) {
          expect(err).toBeTruthy();
          done();
        }
      }
    })
  })
})
