import * as core from '@actions/core';
import * as exec from '@actions/exec';
import path from 'path';

export async function publishPythonPackage({ apiToken, hashId, packageDir }) {
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
  
  let stderr = '';
  const options = {
    listeners: {
      stderr: (data) => {
        stderr += data.toString();
      },
    },
    ignoreReturnCode: true, // Allow us to handle non-zero codes manually
  };

  const exitCode = await exec.exec(command.join(' '), [], options);

  if (exitCode === 0) {
    core.info('Package published successfully.');
  } else if (stderr.includes('409') || stderr.toLowerCase().includes('file already exists')) {
    core.warning('Package version already exists — skipping upload.');
  } else {
    core.setFailed(`twine upload failed:\n${stderr}`);
  }

}
