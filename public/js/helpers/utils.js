import * as globals from './globals';

export function convertError(err) {
  const app = globals.get('CONFIG.app');
  if (err.response) {
    const data = err.response.body;
    const code = (data.code || 'unknown').replace(`${app}-`, '');
    const id = err.response.get('X-Response-Id').substring(0, 4);
    return `${data.message} [${code}] [${id}]`; 
  }
  return err.message;
}
