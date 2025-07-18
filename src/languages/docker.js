import * as core from '@actions/core';
import * as exec from '@actions/exec';
import path from 'path';


export async function publishDockerImage({ apiToken, hashId, registryName, dockerContext, dockerfile, dockerTag }) {
  if (!registryName) {
    core.setFailed('Input "registry_name" is required for Docker publishing.');
    return;
  }

  const lowercaseHash = hashId.toLowerCase();
  const repoPath = `docker.repoforge.io/${lowercaseHash}/${registryName}`;
  const taggedImage = `${repoPath}:${dockerTag}`;
  const absContext = path.resolve(dockerContext);
  const dockerfilePath = path.join(absContext, dockerfile);

  core.info(`Logging into RepoForge Docker registry as __token__`);
  await exec.exec(`echo ${apiToken} | docker login ${repoPath} -u __token__ --password-stdin`);

  core.info(`Building Docker image "${registryName}"`);
  await exec.exec(`docker build -t ${registryName} ${absContext} -f ${dockerfilePath}`);

  core.info(`Tagging image as "${taggedImage}"`);
  await exec.exec(`docker tag ${registryName} ${taggedImage}`);

  core.info(`Pushing image to ${taggedImage}`);
  await exec.exec(`docker push ${taggedImage}`);
}
