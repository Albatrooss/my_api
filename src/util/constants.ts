import { Robillard } from "./types";

// QUOTE STATUS
export const Q_NEW = 0;
export const Q_VIEWED = 1;
export const Q_CONTACTED = 2;
export const Q_WORK_DONE = 3;
export const Q_PAID = 4;

export const statusStr = ['New', 'Viewed', 'Contacted', 'Work Done', 'Paid'];

export const __prod__ = process.env.NODE_ENV === 'production';
export const COOKIE_NAME = 'qid';

export const MEMBERS: Record<Robillard, Robillard> = {
  tim: 'caitlin',
  caitlin: 'tim',
  andrew: 'kyla',
  kyla: 'andrew',
  adam: 'hannah',
  hannah: 'adam',
  hugh: 'patti',
  patti: 'hugh'
}