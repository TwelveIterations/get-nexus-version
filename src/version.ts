export async function findNexusVersion(options: {
  nexusUrl: string
  repository: string
  groupId: string
  artifactId: string
  version?: string
}): Promise<string | undefined> {
  const {
    nexusUrl,
    repository,
    groupId,
    artifactId,
    version: versionSearch
  } = options
  if (!nexusUrl || typeof nexusUrl !== 'string') {
    throw new Error('nexusUrl is not a string')
  }
  if (!repository || typeof repository !== 'string') {
    throw new Error('repository is not a string')
  }
  if (!groupId || typeof groupId !== 'string') {
    throw new Error('groupId is not a string')
  }
  if (!artifactId || typeof artifactId !== 'string') {
    throw new Error('artifactId is not a string')
  }
  if (versionSearch && typeof versionSearch !== 'string') {
    throw new Error('version is not a string')
  }

  const url = new URL('/service/rest/v1/search', nexusUrl)
  url.searchParams.set('repository', repository)
  url.searchParams.set('group', groupId)
  url.searchParams.set('name', artifactId)
  if (versionSearch) {
    url.searchParams.set('version', versionSearch)
  }
  url.searchParams.set('sort', 'version')

  const response = await fetch(url.toString())
  if (!response.ok) {
    throw new Error(
      `Nexus API request failed: ${response.status} ${response.statusText}`
    )
  }

  const json = (await response.json()) as { items: { version: string }[] }

  if (!json.items || json.items.length === 0) {
    return undefined
  }

  const versions = json.items.map((item) => item.version)
  if (versions.length === 0) {
    return undefined
  }

  return versions[0]
}
