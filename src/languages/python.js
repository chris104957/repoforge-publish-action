import * as core from '@actions/core';
import * as exec from '@actions/exec';
import path from 'path';

export async function publishPythonPackage({ apiToken, hashId, packageDir, failOnConflict }) {
  const uploadUrl = `https://api.repoforge.io/${hashId}/`;
  const absPath = path.resolve(packageDir);

  core.info(`Publishing Python package from: ${absPath}`);
  core.info(`Using RepoForge repository URL: ${uploadUrl}`);

  const command = [
    'python',
    '-m',
    'twine',
    'upload',
    '--repository-url',
    uploadUrl,
    '-u',
    '__token__',
    '-p',
    apiToken,
    `${absPath}/*`,
  ];
  

  let output = '';
  const options = {
    listeners: {
      stdout: (data) => {
        output += data.toString();
      },
      stderr: (data) => {
        output += data.toString(); // sometimes twine writes to stderr too
      },
    },
    ignoreReturnCode: true,
  };

  const exitCode = await exec.exec(command.join(' '), [], options);

  if (exitCode === 0) {
    core.info('Package published successfully.');
  } else if (output.includes('409') || output.toLowerCase().includes('conflict')) {
    const msg = 'Package version already exists (409 Conflict).';
    if (failOnConflict) {
      core.setFailed(`${msg} Failing as per configuration.`);
    } else {
      core.warning(`${msg} Skipping upload.`);
    }
  } else {
    core.setFailed(`twine upload failed:\n${output}`);
  }

}
