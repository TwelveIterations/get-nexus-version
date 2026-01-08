/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * To mock dependencies in ESM, you can create fixtures that export mock
 * functions and objects. For example, the core module is mocked in this test,
 * so that the actual '@actions/core' module is not imported.
 */
import { jest } from '@jest/globals'
import * as core from '../__fixtures__/core.js'
import { findNexusVersion } from '../__fixtures__/version.js'

// Mocks should be declared before the module being tested is imported.
jest.unstable_mockModule('@actions/core', () => core)
jest.unstable_mockModule('../src/version.js', () => ({ findNexusVersion }))

// The module being tested should be imported dynamically. This ensures that the
// mocks are used in place of any actual dependencies.
const { run } = await import('../src/main.js')

describe('main.ts', () => {
  beforeEach(() => {
    // Set the action's inputs as return values from core.getInput().
    core.getInput.mockImplementation((name: string) => {
      const inputs: Record<string, string> = {
        nexusUrl: 'https://nexus.example.com',
        repository: 'releases',
        groupId: 'com.example',
        artifactId: 'my-artifact',
        version: '1.0.*'
      }
      return inputs[name] || ''
    })

    // Mock findNexusVersion to return a version.
    findNexusVersion.mockImplementation(() => Promise.resolve('1.0.5'))
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('Sets the version output when a version is found', async () => {
    await run()

    // Verify findNexusVersion was called with correct parameters.
    expect(findNexusVersion).toHaveBeenCalledWith({
      nexusUrl: 'https://nexus.example.com',
      repository: 'releases',
      groupId: 'com.example',
      artifactId: 'my-artifact',
      version: '1.0.*'
    })

    // Verify the version output was set.
    expect(core.setOutput).toHaveBeenCalledWith('version', '1.0.5')
  })

  it('Sets a failed status when no version is found', async () => {
    // Mock findNexusVersion to return undefined.
    findNexusVersion.mockClear().mockResolvedValueOnce(undefined)

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith(
      'No matching my-artifact version found'
    )
  })

  it('Sets a failed status when an error occurs', async () => {
    // Mock findNexusVersion to throw an error.
    findNexusVersion
      .mockClear()
      .mockRejectedValueOnce(new Error('Nexus API request failed: 500'))

    await run()

    // Verify that the action was marked as failed.
    expect(core.setFailed).toHaveBeenCalledWith('Nexus API request failed: 500')
  })
})
