import { IBooking } from 'src/entities';

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
