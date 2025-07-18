import * as core from '@actions/core';
import { publishPythonPackage } from './languages/python.js';
import { publishDockerImage } from './languages/docker.js';

async function run() {
  try {
    const packageType = core.getInput('package_type') || 'python';
    const apiToken = core.getInput('api_token', { required: true });
    const hashId = core.getInput('hash_id', { required: true });
    const packageDir = core.getInput('package_dir', { required: true });
    const dockerTag = core.getInput('docker_tag', { required: false });
    const registryName = core.getInput('registry_name', { required: false });

    switch (packageType.toLowerCase()) {
      case 'python':
        await publishPythonPackage({ apiToken, hashId, packageDir });
        break;
      case 'docker':
        await publishDockerImage({ apiToken, hashId, registryName, dockerTag });
        break;
      default:
        core.setFailed(`Unsupported package_type: ${packageType}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
