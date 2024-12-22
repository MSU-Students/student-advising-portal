import { ILoggable, IProfile } from 'src/entities';
import { firebaseService } from 'src/services/firebase.service';
import { Auth } from './workflows/auth/definition';
import { Admin } from './workflows/admin/definition';

type WorkflowStructs = Auth | Admin;

export async function translateLogToNotification(log: ILoggable) {
  const opKey =
    typeof log.operator == 'object' ? log.operator.key : log.operator;
  const operator = (await firebaseService.get('profiles', opKey!)) as
    | IProfile
    | undefined;
  const type = log.type as WorkflowStructs['type'];
  const badge = operator?.avatar;
  let title = `${type}`;
  let body = '';
  if (log.kind == 'operation') {
    const operation = {
      type: type,
      arg: log.data,
    } as WorkflowStructs;
    switch (operation.type) {
      case 'approveApplication':
        title = `Your request ${operation.arg.payload.data.type} account has been approved`;
        body = `${operator?.fullName || 'User'} approved your request ${
          operation.arg.payload.data.type
        } account`;
        break;
      case 'rejectApplication':
        title = `Your request ${operation.arg.payload.data.type} account has been rejected`;
        body = `${operator?.fullName || 'User'} rejected your request ${
          operation.arg.payload.data.type
        } account, ${operation.arg.payload.remarks}`;
        break;
    }
  }
  return {
    title,
    body,
    badge,
    date: log.date,
  };
}
