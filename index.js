const core = require('@actions/core');
const { findNexusVersion } = require("./version");

async function run() {
  try {
    const nexusUrl = core.getInput('nexusUrl', { required: true });
    const repository = core.getInput('repository', { required: true });
    const groupId = core.getInput('groupId', { required: true });
    const artifactId = core.getInput('artifactId', { required: true });
    const version = core.getInput('version', { required: true });

    if(version) {
      core.info(`Finding latest version for ${groupId}:${artifactId} matching ${version} from ${nexusUrl}...`);
    } else {
      core.info(`Finding latest version for ${groupId}:${artifactId} from ${nexusUrl}...`);
    }

    const result = await findNexusVersion({
      nexusUrl,
      repository,
      groupId,
      artifactId,
      version,
    });

    if (result) {
      core.setOutput('version', result);
    } else {
      core.setFailed('No matching version found');
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
