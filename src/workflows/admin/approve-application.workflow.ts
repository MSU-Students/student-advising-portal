import { useRequestStore } from 'src/stores/request.store';
import { TheWorkflows } from '../the-workflows';
import { useProfileStore } from 'src/stores/profile.store';

TheWorkflows.on({
  type: 'approveApplication',
  loggable: 'operation',
  async cb(e) {
    if (!e.payload.data.key) return;
    const requestStore = useRequestStore();
    const profileStore = useProfileStore();

    const profile = await profileStore.getProfile(e.payload.data.key);
    if (profile) {
      await profileStore.register({
        ...profile,
        ...e.payload.data,
      });
      await requestStore.approveRequest(e.payload);
      e.success &&
        e.success({
          ...e.payload,
          status: 'approved',
        });
    } else if (e.error) {
      e.error(new Error('Profile not found'));
    }
  },
});
