// Stand-in for the fe-core exports the module's actions and helpers read.
export const baseApiUrl = '/api';
export const graphqlWithVariables = (operation, variables, type) => ({ operation, variables, type });
export const getLocalStorage = (key) => globalThis.__localStorage?.[key] ?? null;
