import { useAuthStore } from 'src/stores/auth.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'resetPassword',
  async cb(e) {
    try {
      const authStore = useAuthStore();
      await authStore.resetPassword(e.payload.oobCode, e.payload.newPassword);
      e.success && e.success()
    } catch (error) {
      e.error && e.error(new Error(String(error)))
    }
  },
})
