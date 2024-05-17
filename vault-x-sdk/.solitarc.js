const path = require('path');
const programDir = path.join(__dirname, '..', 'programs/vault-x');
const idlDir = path.join(__dirname, 'idl');
const sdkDir = path.join(__dirname, 'src', 'generated');
const binaryInstallDir = path.join(__dirname, '.crates');

module.exports = {
  idlGenerator: 'anchor',
  programName: 'vaultx',
  programId: 'GLdveVwYn2cSsuj5DTARPC8RLrTkCDRq484e8C91Zd7A',
  idlDir,
  sdkDir,
  binaryInstallDir,
  programDir,
};
