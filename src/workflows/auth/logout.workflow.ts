import { firebaseService } from 'src/services/firebase.service';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'logOut',
  async cb(e) {
    try {
      await firebaseService.signOut();
      e.success();
    } catch (error) {
      e.error(new Error(String(error)));
    }
  },
})
