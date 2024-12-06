import { useAuthStore } from 'src/stores/auth.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'signUpWithEmail',
  loggable: 'post-operation',
  async cb(e) {
    try {
      const authStore = useAuthStore();
      await authStore.signUpAccount(e.payload);
      if (e.success) {
        e.success();
      }
    } catch (err) {
      if (e.error) {
        e.error(new Error(String(err)));
      }
    }
  },
});
