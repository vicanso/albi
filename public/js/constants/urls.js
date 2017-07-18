import * as globals from '../helpers/globals';

const appUrlPrefix = globals.get('CONFIG.appUrlPrefix');

export const VIEW_LOGIN = `${appUrlPrefix}/login`;
export const VIEW_REGISTER = `${appUrlPrefix}/register`;
export const VIEW_ADMIN = `${appUrlPrefix}/admin`;
