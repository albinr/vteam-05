module.exports = {
    collectCoverage: true,
    coverageDirectory: "coverage", // Var täckningsrapporten sparas
    coverageReporters: ["text", "lcov"], // Format för täckningsrapport
    testEnvironment: "node", // Miljö som Jest använder
  };