import { firebaseService } from 'src/services/firebase.service';
import { TheWorkflows } from '../the-workflows';
import { useAuthStore } from 'src/stores/auth.store';

TheWorkflows.on({
  type: 'logOut',
  loggable: 'operation',
  async cb(e) {
    try {
      await firebaseService.signOut();
      const authStore = useAuthStore();
      await authStore.getUser();
      e.success();
    } catch (error) {
      e.error(new Error(String(error)));
    }
  },
});
