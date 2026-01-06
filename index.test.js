const { findNexusVersion, getEmbeddedMinecraftVersion } = require('./version');

test('throws when nexusUrl is missing', async () => {
  await expect(findNexusVersion({})).rejects.toThrow('nexusUrl is required and must be a string');
});

test('throws when repository is missing', async () => {
  await expect(findNexusVersion({ nexusUrl: 'https://example.com' })).rejects.toThrow('repository is required and must be a string');
});

test('throws when groupId is missing', async () => {
  await expect(findNexusVersion({ nexusUrl: 'https://example.com', repository: 'releases' })).rejects.toThrow('groupId is required and must be a string');
});

test('throws when artifactId is missing', async () => {
  await expect(findNexusVersion({ nexusUrl: 'https://example.com', repository: 'releases', groupId: 'com.example' })).rejects.toThrow('artifactId is required and must be a string');
});

test('getEmbeddedMinecraftVersion extracts version correctly', () => {
  expect(getEmbeddedMinecraftVersion('21.1.42')).toBe('1.21.1');
  expect(getEmbeddedMinecraftVersion('21.0.5')).toBe('1.21.0');
  expect(getEmbeddedMinecraftVersion('26.1.3.4')).toBe('26.1.3');
});

test('returns version when used with real repo', async () => {
  expect(await findNexusVersion({ nexusUrl: 'https://maven.twelveiterations.com', repository: 'maven-releases', groupId: 'net.blay09.mods', artifactId: 'balm-common', version: '8.*' })).toBe('8.0.5+1.20.2')
})
