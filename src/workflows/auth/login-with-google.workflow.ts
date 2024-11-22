import { useAuthStore } from 'src/stores/auth.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'loginWithGoogle',
  async cb(e) {
    try {
      const authStore = useAuthStore();
      await authStore.loginWithGoogle();
      const profile = await authStore.getUser();
      if (profile) {
        e.success(profile);
      } else {
        if (e.error) e.error(new Error('Something went wrong'));
      }
    } catch (error) {
      if (e.error) e.error(new Error(String(error)));
    }
  },
})
