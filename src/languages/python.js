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

  await exec.exec(command.join(' '));
}
