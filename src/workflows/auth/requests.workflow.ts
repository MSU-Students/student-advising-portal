import { useRequestStore } from 'src/stores/request.store';
import { TheWorkflows } from '../the-workflows';

TheWorkflows.on({
  type: 'createRequest',
  loggable: 'operation',
  cb(e) {
    try {
      const requestStore = useRequestStore();
      if (e.applicant) {
        requestStore.createRequest(e.applicant);
      }
      e.success();
    } catch (error) {
      e.error(new Error(String(error)));
    }
  },
});
