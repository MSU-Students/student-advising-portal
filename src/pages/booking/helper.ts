import { Notify } from 'quasar';
import { TheDialogs } from 'src/dialogs/the-dialogs';
import { IBooking, IConsultationBooking, IProfile } from 'src/entities';
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
export const advisersOptions = ref<IProfile[]>([]);
export const adviseesOptions = ref<IProfile[]>([]);
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
  adviseesOptions.value = await profileStore.findProfiles(keyword, 'student');
  loading.value = false;
}

export async function searchAdvisers(keyword: string) {
  const profileStore = useProfileStore();
  profileOptions.value = [];
  loading.value = true;
  advisersOptions.value = await profileStore.findProfiles(keyword, 'adviser');
  loading.value = false;
}

export function approveConsulation(booking: IConsultationBooking) {
  console.log(booking);
}
export function rejectConsulation(booking: IConsultationBooking) {
  TheDialogs.emit({
    type: 'rejectConsultationDialog',
    arg: {
      payload: booking,
      success: () => {
        Notify.create({
          icon: 'info',
          color: 'warning',
          message: 'Booking is rejected',
        });
      },
    },
  });
}
