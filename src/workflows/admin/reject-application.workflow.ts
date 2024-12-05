import { useRequestStore } from 'src/stores/request.store';
import { TheWorkflows } from '../the-workflows';
import { useProfileStore } from 'src/stores/profile.store';

TheWorkflows.on({
  type: 'rejectApplication',
  async cb(e) {
    if (!e.payload.data.key) return;
    const requestStore = useRequestStore();
    const profileStore = useProfileStore();

    const profile = await profileStore.getProfile(e.payload.data.key);
    if (profile) {
      await requestStore.rejectRequest(e.payload);
      e.success &&
        e.success({
          ...e.payload,
          status: 'rejected',
        });
    } else if (e.error) {
      e.error(new Error('Profile not found'));
    }
  },
});
