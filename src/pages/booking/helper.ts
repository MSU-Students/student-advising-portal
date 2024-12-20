import { IBooking, IProfile } from 'src/entities';
import { useProfileStore } from 'src/stores/profile.store';
import { ref } from 'vue';

export function statusColor(status: IBooking['status']) {
  switch (status) {
    case 'accepted':
      return 'positive';
    case 'pending':
      return 'warning';
    case 'rejected':
    default:
      return 'negative';
  }
}

export const profileOptions = ref<IProfile[]>([]);
export const loading = ref(false);
export async function searchAttendees(keyword: string) {
  const profileStore = useProfileStore();
  profileOptions.value = [];
  loading.value = true;
  profileOptions.value = await profileStore.findProfiles(keyword);
  loading.value = false;
}

export async function searchStudents(keyword: string) {
  const profileStore = useProfileStore();
  profileOptions.value = [];
  loading.value = true;
  profileOptions.value = await profileStore.findProfiles(keyword, 'student');
  loading.value = false;
}

export async function searchAdvisers(keyword: string) {
  const profileStore = useProfileStore();
  profileOptions.value = [];
  loading.value = true;
  profileOptions.value = await profileStore.findProfiles(keyword, 'adviser');
  loading.value = false;
}
