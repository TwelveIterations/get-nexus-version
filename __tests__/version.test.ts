/**
 * Unit tests for src/version.ts
 */
import { jest } from '@jest/globals'
import { findNexusVersion } from '../src/version.js'

// Mock node-fetch
const mockFetch = jest.fn()
jest.unstable_mockModule('node-fetch', () => ({
  default: mockFetch
}))

describe('version.ts', () => {
  beforeEach(() => {
    mockFetch.mockClear()
  })

  it('Throws when nexusUrl is missing', async () => {
    await expect(
      findNexusVersion({
        nexusUrl: '',
        repository: 'releases',
        groupId: 'com.example',
        artifactId: 'my-artifact'
      })
    ).rejects.toThrow('nexusUrl is not a string')
  })

  it('Throws when repository is missing', async () => {
    await expect(
      findNexusVersion({
        nexusUrl: 'https://nexus.example.com',
        repository: '',
        groupId: 'com.example',
        artifactId: 'my-artifact'
      })
    ).rejects.toThrow('repository is not a string')
  })

  it('Throws when groupId is missing', async () => {
    await expect(
      findNexusVersion({
        nexusUrl: 'https://nexus.example.com',
        repository: 'releases',
        groupId: '',
        artifactId: 'my-artifact'
      })
    ).rejects.toThrow('groupId is not a string')
  })

  it('Throws when artifactId is missing', async () => {
    await expect(
      findNexusVersion({
        nexusUrl: 'https://nexus.example.com',
        repository: 'releases',
        groupId: 'com.example',
        artifactId: ''
      })
    ).rejects.toThrow('artifactId is not a string')
  })
})
