/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { ErrorWithLogs, initCusper } from '@metaplex-foundation/cusper';
import { errorFromCode } from './generated';

const cusper = initCusper(errorFromCode);

export function translateAndThrowAnchorError(err: unknown): never {
  if (!isErrorWithLogs(err)) {
    throw err;
  }

  const translatedError = cusper.errorFromProgramLogs(err.logs) ?? err;

  if (typeof Error.captureStackTrace === 'function') {
    Error.captureStackTrace(translatedError, translateAndThrowAnchorError);
  }

  (translatedError as unknown as ErrorWithLogs).logs = err.logs;

  throw translatedError;
}

export const isErrorWithLogs = (err: unknown): err is ErrorWithLogs => {
  return Boolean(
    err && typeof err === 'object' && 'logs' in err && Array.isArray(err.logs)
  );
};
