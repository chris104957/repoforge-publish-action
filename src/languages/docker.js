import * as core from '@actions/core';
import * as exec from '@actions/exec';

export async function publishDockerImage({ apiToken, hashId, registryName, dockerTag = "latest" }) {
  if (!registryName) {
    core.setFailed('Input "registry_name" is required for Docker publishing.');
    return;
  }

  const lowercaseHash = hashId.toLowerCase();
  const repoPath = `docker.repoforge.io/${lowercaseHash}/${registryName}`;
  const taggedImage = `${repoPath}:${dockerTag}`;

  core.info(`Logging into RepoForge Docker registry as __token__`);
  await exec.exec(`echo ${apiToken} | docker login ${repoPath} -u __token__ --password-stdin`);

  core.info(`Building Docker image "${registryName}"`);
  await exec.exec(`docker build -t ${registryName} .`);

  core.info(`Tagging image as "${taggedImage}"`);
  await exec.exec(`docker tag ${registryName} ${taggedImage}`);

  core.info(`Pushing image to ${taggedImage}`);
  await exec.exec(`docker push ${taggedImage}`);
}
