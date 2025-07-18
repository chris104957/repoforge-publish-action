import * as core from '@actions/core';
import { publishPythonPackage } from './languages/python.js';
import { publishDockerImage } from './languages/docker.js';

async function run() {
  try {
    const packageType = core.getInput('package_type') || 'python';
    const apiToken = core.getInput('api_token', { required: true });
    const hashId = core.getInput('hash_id', { required: true });
    
    switch (packageType.toLowerCase()) {
      case 'python':
        const packageDir = core.getInput('package_dir', { required: true });
        await publishPythonPackage({ apiToken, hashId, packageDir });
        break;
      case 'docker':
        const dockerTag = core.getInput('docker_tag', { required: false });
        const registryName = core.getInput('registry_name', { required: true });
        const dockerContext = core.getInput('docker_context', { required: false });
        const dockerfile = core.getInput('dockerfile', { required: false });
    
    
        await publishDockerImage({ apiToken, hashId, registryName, dockerTag, dockerContext, dockerfile });
        break;
      default:
        core.setFailed(`Unsupported package_type: ${packageType}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
