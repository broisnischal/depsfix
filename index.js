#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const { program } = require("commander");

program
  .version("1.0.0")
  .description("Move @types/* dependencies to devDependencies in package.json")
  .action(() => {
    const packageJsonPath = path.join(process.cwd(), "package.json");

    if (!fs.existsSync(packageJsonPath)) {
      console.error("❌ package.json not found in this directory.");
      process.exit(1);
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));

    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.dependencies = packageJson.dependencies || {};

    const typesPackages = Object.keys(packageJson.dependencies).filter((pkg) =>
      pkg.startsWith("@types/"),
    );

    if (typesPackages.length === 0) {
      console.log("✅ No @types/* packages found in dependencies.");
      process.exit(0);
    }

    typesPackages.forEach((pkg) => {
      packageJson.devDependencies[pkg] = packageJson.dependencies[pkg];
      delete packageJson.dependencies[pkg];
    });

    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));

    console.log("✅ Moved @types/* packages to devDependencies.");
  });

program.parse(process.argv);
