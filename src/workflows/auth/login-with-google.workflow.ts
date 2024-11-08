import { useAuthStore } from 'src/stores/auth.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'loginWithGoogle',
  async cb(e) {
    try {
      const authStore = useAuthStore();
      await authStore.loginWithGoogle();
      e.success();
    } catch (error) {
      e.error(new Error(String(error)));
    }
  },
})
