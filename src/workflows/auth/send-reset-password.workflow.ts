import { useAuthStore } from 'src/stores/auth.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'sendResetPassword',
  async cb(e) {
    try {
      const authStore = useAuthStore();
      await authStore.sendResetPassword(e.payload);
      e.success && e.success()
    } catch (error) {
      e.error && e.error(new Error(String(error)))
    }
  },
})
