import { useAuthStore } from 'src/stores/auth.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'resetPassword',
  async cb(e) {
    try {
      const authStore = useAuthStore();
      await authStore.resetPassword(e.payload);
    } catch (error) {
      e.error && e.error(new Error(String(error)))
    }
    finally {
      e.success && e.success()
    }
  },
})
