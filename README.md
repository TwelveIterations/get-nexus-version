## Usage

```yaml
uses: TwelveIterations/get-nexus-version@v1
with:
  nexusUrl: 'https://maven.twelveiterations.com'
  repository: 'maven-releases'
  groupId: 'net.blay09.mods'
  artifactId: 'balm-common'
  version: '21.11.*'
```

## Development

Install the dependencies

```bash
npm install
```

Run the tests :heavy_check_mark:

```bash
$ npm test

 PASS  ./index.test.js
  ✓ throws invalid number (3ms)
  ✓ version 500 ms (504ms)
  ✓ test runs (95ms)
...
```

Package for distribution

```bash
npm run prepare
```