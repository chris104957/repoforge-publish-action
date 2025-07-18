import * as core from '@actions/core';
import { publishPythonPackage } from './languages/python.js';

async function run() {
  try {
    const packageType = core.getInput('package_type') || 'python';
    const apiToken = core.getInput('api_token', { required: true });
    const hashId = core.getInput('hash_id', { required: true });
    const packageDir = core.getInput('package_dir', { required: true });

    switch (packageType.toLowerCase()) {
      case 'python':
        await publishPythonPackage({ apiToken, hashId, packageDir });
        break;
      default:
        core.setFailed(`Unsupported package_type: ${packageType}`);
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
