# Portfolio Contracts

This directory is the public, canonical source for contracts exchanged among
PRIME, The Portal, VELYQUA, Game Platform and Authority Engine.

Contract rules:

- Semantic versions are strings and use full `major.minor.patch` form (`"1.0.0"`).
- Consumers pin `contract_version` and the SHA-256 hashes in `manifest.json`.
- JavaScript, TypeScript and Python validators are generated from the schemas.
- Product-local contracts must not reuse these canonical filenames.
- Breaking suite changes increment `contract_version`; bundle `2.0.0` standardizes every envelope on `schema_version: "1.0.0"`.
- A schema change requires a new version; existing versions are immutable.

Run `node scripts/generate.mjs` after changing a schema. The generator updates
all validator bundles and the manifest deterministically.
