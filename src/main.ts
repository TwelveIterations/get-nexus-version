import * as core from '@actions/core'
import { findNexusVersion } from './version.js'

export async function run(): Promise<void> {
  try {
    const nexusUrl: string = core.getInput('nexusUrl', { required: true })
    const repository: string = core.getInput('repository', { required: true })
    const groupId: string = core.getInput('groupId', { required: true })
    const artifactId: string = core.getInput('artifactId', { required: true })
    const version: string | undefined = core.getInput('version', {
      required: true
    })

    if (version) {
      core.info(
        `Finding latest version for ${groupId}:${artifactId} matching ${version} from ${nexusUrl}...`
      )
    } else {
      core.info(
        `Finding latest version for ${groupId}:${artifactId} from ${nexusUrl}...`
      )
    }

    const result = await findNexusVersion({
      nexusUrl,
      repository,
      groupId,
      artifactId,
      version
    })

    if (result) {
      core.setOutput('version', result)
    } else {
      core.setFailed(`No matching ${artifactId} version found`)
    }
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) core.setFailed(error.message)
  }
}
