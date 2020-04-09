#!/usr/bin/env node

const CLI = require('../lib/CLI');
CLI.init().catch(e => {
  console.error('Error occurred while running CLI command:');
  console.error(e);
});
