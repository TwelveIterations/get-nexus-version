const fetch = require('cross-fetch')

/**
 * Fetch the latest version from a Nexus repository.
 *
 * @param {Object} options - Configuration options
 * @param {string} options.nexusUrl - Base URL of the Nexus server (e.g., 'https://repo.example.com')
 * @param {string} options.repository - Repository name (e.g., 'releases')
 * @param {string} options.groupId - Maven group ID (e.g., 'net.neoforged')
 * @param {string} options.artifactId - Maven artifact ID (e.g., 'neoforge')
 * @param {string?} options.version - Optioanl version pattern to search for
 * @returns {Promise<string|undefined>} The latest version string, or undefined if not found
 */
let findNexusVersion = async function (options) {
    const { nexusUrl, repository, groupId, artifactId, version: versionSearch } = options;

    if (!nexusUrl || typeof nexusUrl !== 'string') {
        throw new Error('nexusUrl is required and must be a string');
    }
    if (!repository || typeof repository !== 'string') {
        throw new Error('repository is required and must be a string');
    }
    if (!groupId || typeof groupId !== 'string') {
        throw new Error('groupId is required and must be a string');
    }
    if (!artifactId || typeof artifactId !== 'string') {
        throw new Error('artifactId is required and must be a string');
    }

    const url = new URL('/service/rest/v1/search', nexusUrl);
    url.searchParams.set('repository', repository);
    url.searchParams.set('group', groupId);
    url.searchParams.set('name', artifactId);
    if (versionSearch) {
        url.searchParams.set('version', versionSearch);
    }
    url.searchParams.set('sort', 'version');

    const response = await fetch(url.toString());
    if (!response.ok) {
        throw new Error(`Nexus API request failed: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (!json.items || json.items.length === 0) {
        return undefined;
    }

    const versions = json.items.map(item => item.version);
    if (versions.length === 0) {
        return undefined;
    }

    return versions[0];
};

/**
 * Extract embedded Minecraft version from an artifact version string.
 * Assumes format like "21.1.42" where "21.1" maps to Minecraft "1.21.1", or "26.1.3.4" where "26.1.3" maps to Minecraft "26.1.3"
 *
 * @param {string} version - The artifact version string
 * @returns {string|undefined} The Minecraft version, or undefined if not extractable
 */
function getEmbeddedMinecraftVersion(version) {
    const match = version.match(/^(\d+)\.(\d+)(?:\.(\d+))?/);
    if (match) {
        const major = match[1];
        const minor = match[2];
        const patch = match[3];
        if (major <= 21) {
            return `1.${major}.${minor}`;
        } else if(major >= 26) {
            return `${major}.${minor}.${patch}`;
        }
    }
    return undefined;
}

module.exports = { findNexusVersion, getEmbeddedMinecraftVersion };
