import { handler as createHandler } from './create';
import { handler as getHandler } from './get';
import { handler as updateHandler } from './update';
import { handler as deleteHandler } from './delete';
import { handler as listHandler } from './list';
import { handler as instanceCreateHandler } from './instance.create';
import { handler as instanceDeleteHandler } from './instance.delete';
import { handler as instanceGetHandler } from './instance.get';
import { handler as instanceUpdateHandler } from './instance.update';
import { handler as instanceListUserHandler } from './instance.list-user';
import { handler as instanceListMentorHandler } from './instance.list-mentor';
import { handler as instanceAddSubmissionHandler } from './instance.add-submission';
import { handler as instanceGetSubmissionsHandler } from './instance.get-submissions';
import { handler as instanceAddMessageHandler } from './instance.add-message';
import { handler as instanceGetMessagesHandler } from './instance.get-messages';

export const projectController = {
  // Project Definition CRUD
  project: {
    create: createHandler,
    get: getHandler,
    update: updateHandler,
    delete: deleteHandler,
    list: listHandler,
  },

  // Project Instance Management
  instance: {
    create: instanceCreateHandler,
    delete: instanceDeleteHandler,
    get: instanceGetHandler,
    update: instanceUpdateHandler,
    listUser: instanceListUserHandler,
    listMentor: instanceListMentorHandler,
    addSubmission: instanceAddSubmissionHandler,
    getSubmissions: instanceGetSubmissionsHandler,
    addMessage: instanceAddMessageHandler,
    getMessages: instanceGetMessagesHandler,
  },
};
