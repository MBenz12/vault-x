/**
 * © 2024 Blockpal LLC
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

type ErrorWithCode = Error & { code: number }
type MaybeErrorWithCode = ErrorWithCode | null | undefined

const createErrorFromCodeLookup: Map<number, () => ErrorWithCode> = new Map()
const createErrorFromNameLookup: Map<string, () => ErrorWithCode> = new Map()

/**
 * InvalidRoleCount: 'Invalid role count. Valid role count is between 1 and MAX_VAULT_ROLES'
 *
 * @category Errors
 * @category generated
 */
export class InvalidRoleCountError extends Error {
  readonly code: number = 0x1770
  readonly name: string = 'InvalidRoleCount'
  constructor() {
    super(
      'Invalid role count. Valid role count is between 1 and MAX_VAULT_ROLES'
    )
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidRoleCountError)
    }
  }
}

createErrorFromCodeLookup.set(0x1770, () => new InvalidRoleCountError())
createErrorFromNameLookup.set(
  'InvalidRoleCount',
  () => new InvalidRoleCountError()
)

/**
 * InvalidFounderThreshold: 'Invalid founder threshold'
 *
 * @category Errors
 * @category generated
 */
export class InvalidFounderThresholdError extends Error {
  readonly code: number = 0x1771
  readonly name: string = 'InvalidFounderThreshold'
  constructor() {
    super('Invalid founder threshold')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidFounderThresholdError)
    }
  }
}

createErrorFromCodeLookup.set(0x1771, () => new InvalidFounderThresholdError())
createErrorFromNameLookup.set(
  'InvalidFounderThreshold',
  () => new InvalidFounderThresholdError()
)

/**
 * Unauthorized: 'Unauthorized action attempted'
 *
 * @category Errors
 * @category generated
 */
export class UnauthorizedError extends Error {
  readonly code: number = 0x1772
  readonly name: string = 'Unauthorized'
  constructor() {
    super('Unauthorized action attempted')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, UnauthorizedError)
    }
  }
}

createErrorFromCodeLookup.set(0x1772, () => new UnauthorizedError())
createErrorFromNameLookup.set('Unauthorized', () => new UnauthorizedError())

/**
 * MissingAccount: 'Missing account required for transaction'
 *
 * @category Errors
 * @category generated
 */
export class MissingAccountError extends Error {
  readonly code: number = 0x1773
  readonly name: string = 'MissingAccount'
  constructor() {
    super('Missing account required for transaction')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, MissingAccountError)
    }
  }
}

createErrorFromCodeLookup.set(0x1773, () => new MissingAccountError())
createErrorFromNameLookup.set('MissingAccount', () => new MissingAccountError())

/**
 * FounderAlreadyExists: 'Founder already exists'
 *
 * @category Errors
 * @category generated
 */
export class FounderAlreadyExistsError extends Error {
  readonly code: number = 0x1774
  readonly name: string = 'FounderAlreadyExists'
  constructor() {
    super('Founder already exists')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, FounderAlreadyExistsError)
    }
  }
}

createErrorFromCodeLookup.set(0x1774, () => new FounderAlreadyExistsError())
createErrorFromNameLookup.set(
  'FounderAlreadyExists',
  () => new FounderAlreadyExistsError()
)

/**
 * MemberAlreadyExists: 'Member already exists'
 *
 * @category Errors
 * @category generated
 */
export class MemberAlreadyExistsError extends Error {
  readonly code: number = 0x1775
  readonly name: string = 'MemberAlreadyExists'
  constructor() {
    super('Member already exists')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, MemberAlreadyExistsError)
    }
  }
}

createErrorFromCodeLookup.set(0x1775, () => new MemberAlreadyExistsError())
createErrorFromNameLookup.set(
  'MemberAlreadyExists',
  () => new MemberAlreadyExistsError()
)

/**
 * FounderNotFound: 'Founder does not exist'
 *
 * @category Errors
 * @category generated
 */
export class FounderNotFoundError extends Error {
  readonly code: number = 0x1776
  readonly name: string = 'FounderNotFound'
  constructor() {
    super('Founder does not exist')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, FounderNotFoundError)
    }
  }
}

createErrorFromCodeLookup.set(0x1776, () => new FounderNotFoundError())
createErrorFromNameLookup.set(
  'FounderNotFound',
  () => new FounderNotFoundError()
)

/**
 * MemberNotFound: 'Member does not exist'
 *
 * @category Errors
 * @category generated
 */
export class MemberNotFoundError extends Error {
  readonly code: number = 0x1777
  readonly name: string = 'MemberNotFound'
  constructor() {
    super('Member does not exist')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, MemberNotFoundError)
    }
  }
}

createErrorFromCodeLookup.set(0x1777, () => new MemberNotFoundError())
createErrorFromNameLookup.set('MemberNotFound', () => new MemberNotFoundError())

/**
 * InvalidStaleTransactionIndex: 'Invalid stale transaction index'
 *
 * @category Errors
 * @category generated
 */
export class InvalidStaleTransactionIndexError extends Error {
  readonly code: number = 0x1778
  readonly name: string = 'InvalidStaleTransactionIndex'
  constructor() {
    super('Invalid stale transaction index')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidStaleTransactionIndexError)
    }
  }
}

createErrorFromCodeLookup.set(
  0x1778,
  () => new InvalidStaleTransactionIndexError()
)
createErrorFromNameLookup.set(
  'InvalidStaleTransactionIndex',
  () => new InvalidStaleTransactionIndexError()
)

/**
 * InvalidProgram: 'Account is not part of the program'
 *
 * @category Errors
 * @category generated
 */
export class InvalidProgramError extends Error {
  readonly code: number = 0x1779
  readonly name: string = 'InvalidProgram'
  constructor() {
    super('Account is not part of the program')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidProgramError)
    }
  }
}

createErrorFromCodeLookup.set(0x1779, () => new InvalidProgramError())
createErrorFromNameLookup.set('InvalidProgram', () => new InvalidProgramError())

/**
 * AlreadyApproved: 'Member already approved the transaction'
 *
 * @category Errors
 * @category generated
 */
export class AlreadyApprovedError extends Error {
  readonly code: number = 0x177a
  readonly name: string = 'AlreadyApproved'
  constructor() {
    super('Member already approved the transaction')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AlreadyApprovedError)
    }
  }
}

createErrorFromCodeLookup.set(0x177a, () => new AlreadyApprovedError())
createErrorFromNameLookup.set(
  'AlreadyApproved',
  () => new AlreadyApprovedError()
)

/**
 * AlreadyRejected: 'Member already rejected the transaction'
 *
 * @category Errors
 * @category generated
 */
export class AlreadyRejectedError extends Error {
  readonly code: number = 0x177b
  readonly name: string = 'AlreadyRejected'
  constructor() {
    super('Member already rejected the transaction')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AlreadyRejectedError)
    }
  }
}

createErrorFromCodeLookup.set(0x177b, () => new AlreadyRejectedError())
createErrorFromNameLookup.set(
  'AlreadyRejected',
  () => new AlreadyRejectedError()
)

/**
 * AlreadyCancelled: 'Member already cancelled the transaction'
 *
 * @category Errors
 * @category generated
 */
export class AlreadyCancelledError extends Error {
  readonly code: number = 0x177c
  readonly name: string = 'AlreadyCancelled'
  constructor() {
    super('Member already cancelled the transaction')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AlreadyCancelledError)
    }
  }
}

createErrorFromCodeLookup.set(0x177c, () => new AlreadyCancelledError())
createErrorFromNameLookup.set(
  'AlreadyCancelled',
  () => new AlreadyCancelledError()
)

/**
 * InvalidVaultTransactionMessage: 'Transaction message is malformed'
 *
 * @category Errors
 * @category generated
 */
export class InvalidVaultTransactionMessageError extends Error {
  readonly code: number = 0x177d
  readonly name: string = 'InvalidVaultTransactionMessage'
  constructor() {
    super('Transaction message is malformed')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidVaultTransactionMessageError)
    }
  }
}

createErrorFromCodeLookup.set(
  0x177d,
  () => new InvalidVaultTransactionMessageError()
)
createErrorFromNameLookup.set(
  'InvalidVaultTransactionMessage',
  () => new InvalidVaultTransactionMessageError()
)

/**
 * ProtectedAccount: 'Cannot modify protected account'
 *
 * @category Errors
 * @category generated
 */
export class ProtectedAccountError extends Error {
  readonly code: number = 0x177e
  readonly name: string = 'ProtectedAccount'
  constructor() {
    super('Cannot modify protected account')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, ProtectedAccountError)
    }
  }
}

createErrorFromCodeLookup.set(0x177e, () => new ProtectedAccountError())
createErrorFromNameLookup.set(
  'ProtectedAccount',
  () => new ProtectedAccountError()
)

/**
 * InvalidAccount: 'Invalid account provided'
 *
 * @category Errors
 * @category generated
 */
export class InvalidAccountError extends Error {
  readonly code: number = 0x177f
  readonly name: string = 'InvalidAccount'
  constructor() {
    super('Invalid account provided')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidAccountError)
    }
  }
}

createErrorFromCodeLookup.set(0x177f, () => new InvalidAccountError())
createErrorFromNameLookup.set('InvalidAccount', () => new InvalidAccountError())

/**
 * InvalidAllowlist: 'Invalid allowlist provided'
 *
 * @category Errors
 * @category generated
 */
export class InvalidAllowlistError extends Error {
  readonly code: number = 0x1780
  readonly name: string = 'InvalidAllowlist'
  constructor() {
    super('Invalid allowlist provided')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidAllowlistError)
    }
  }
}

createErrorFromCodeLookup.set(0x1780, () => new InvalidAllowlistError())
createErrorFromNameLookup.set(
  'InvalidAllowlist',
  () => new InvalidAllowlistError()
)

/**
 * InvalidNumberOfAccounts: 'Wrong number of accounts provided'
 *
 * @category Errors
 * @category generated
 */
export class InvalidNumberOfAccountsError extends Error {
  readonly code: number = 0x1781
  readonly name: string = 'InvalidNumberOfAccounts'
  constructor() {
    super('Wrong number of accounts provided')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidNumberOfAccountsError)
    }
  }
}

createErrorFromCodeLookup.set(0x1781, () => new InvalidNumberOfAccountsError())
createErrorFromNameLookup.set(
  'InvalidNumberOfAccounts',
  () => new InvalidNumberOfAccountsError()
)

/**
 * InvalidTransactionStatus: 'Invalid transaction status for voting'
 *
 * @category Errors
 * @category generated
 */
export class InvalidTransactionStatusError extends Error {
  readonly code: number = 0x1782
  readonly name: string = 'InvalidTransactionStatus'
  constructor() {
    super('Invalid transaction status for voting')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidTransactionStatusError)
    }
  }
}

createErrorFromCodeLookup.set(0x1782, () => new InvalidTransactionStatusError())
createErrorFromNameLookup.set(
  'InvalidTransactionStatus',
  () => new InvalidTransactionStatusError()
)

/**
 * InvalidInstructionAccount: 'Invalid instruction account'
 *
 * @category Errors
 * @category generated
 */
export class InvalidInstructionAccountError extends Error {
  readonly code: number = 0x1783
  readonly name: string = 'InvalidInstructionAccount'
  constructor() {
    super('Invalid instruction account')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, InvalidInstructionAccountError)
    }
  }
}

createErrorFromCodeLookup.set(
  0x1783,
  () => new InvalidInstructionAccountError()
)
createErrorFromNameLookup.set(
  'InvalidInstructionAccount',
  () => new InvalidInstructionAccountError()
)

/**
 * AdminCannotBeFounder: 'Administrator cannot be a founder'
 *
 * @category Errors
 * @category generated
 */
export class AdminCannotBeFounderError extends Error {
  readonly code: number = 0x1784
  readonly name: string = 'AdminCannotBeFounder'
  constructor() {
    super('Administrator cannot be a founder')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AdminCannotBeFounderError)
    }
  }
}

createErrorFromCodeLookup.set(0x1784, () => new AdminCannotBeFounderError())
createErrorFromNameLookup.set(
  'AdminCannotBeFounder',
  () => new AdminCannotBeFounderError()
)

/**
 * AdminCannotBeMember: 'Administrator cannot be a member'
 *
 * @category Errors
 * @category generated
 */
export class AdminCannotBeMemberError extends Error {
  readonly code: number = 0x1785
  readonly name: string = 'AdminCannotBeMember'
  constructor() {
    super('Administrator cannot be a member')
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, AdminCannotBeMemberError)
    }
  }
}

createErrorFromCodeLookup.set(0x1785, () => new AdminCannotBeMemberError())
createErrorFromNameLookup.set(
  'AdminCannotBeMember',
  () => new AdminCannotBeMemberError()
)

/**
 * Attempts to resolve a custom program error from the provided error code.
 * @category Errors
 * @category generated
 */
export function errorFromCode(code: number): MaybeErrorWithCode {
  const createError = createErrorFromCodeLookup.get(code)
  return createError != null ? createError() : null
}

/**
 * Attempts to resolve a custom program error from the provided error name, i.e. 'Unauthorized'.
 * @category Errors
 * @category generated
 */
export function errorFromName(name: string): MaybeErrorWithCode {
  const createError = createErrorFromNameLookup.get(name)
  return createError != null ? createError() : null
}
