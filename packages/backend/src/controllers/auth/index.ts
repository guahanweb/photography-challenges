import { handler as loginHandler } from './login';
import { handler as registerHandler } from './register';
import { handler as validateHandler } from './validate';

export const authController = {
  login: loginHandler,
  register: registerHandler,
  validate: validateHandler,
};
