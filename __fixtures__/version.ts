import { jest } from '@jest/globals'

export const findNexusVersion =
  jest.fn<typeof import('../src/version.js').findNexusVersion>()
