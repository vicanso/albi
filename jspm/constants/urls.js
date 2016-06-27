'use strict';
import * as globals from '../helpers/globals';
const appUrlPrfix = globals.get('CONFIG.appUrlPrefix');

export const HOME = `${appUrlPrfix}/`;

export const LOGIN = `${appUrlPrfix}/login`;

export const REGISTER = `${appUrlPrfix}/register`;
