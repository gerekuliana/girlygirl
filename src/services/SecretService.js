class ScopedSecretService {
  constructor(scope) {
    this.scope = scope;
    this.secrets = new Map();
  }

  async get(key) {
    const scopedKey = `${this.scope}:${key}`;
    if (!this.secrets.has(scopedKey)) {
      throw new Error(`Secret not found: ${key}`);
    }
    return this.secrets.get(scopedKey);
  }

  async set(key, value) {
    const scopedKey = `${this.scope}:${key}`;
    this.secrets.set(scopedKey, value);
    return { key, value, scope: this.scope };
  }

  async list() {
    const results = [];
    for (const [key, value] of this.secrets) {
      if (key.startsWith(`${this.scope}:`)) {
        const actualKey = key.substring(this.scope.length + 1);
        results.push({ key: actualKey, value, scope: this.scope });
      }
    }
    return results;
  }

  async delete(key) {
    const scopedKey = `${this.scope}:${key}`;
    if (!this.secrets.has(scopedKey)) {
      throw new Error(`Secret not found: ${key}`);
    }
    this.secrets.delete(scopedKey);
    return true;
  }
}

class SecretService {
  constructor(scope = 'default') {
    this.scopedService = new ScopedSecretService(scope);
  }

  async getSecret(key) {
    if (!key) {
      throw new Error('Key is required');
    }
    try {
      const value = await this.scopedService.get(key);
      return { success: true, data: value };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async listAllSecrets() {
    try {
      const secrets = await this.scopedService.list();
      return { success: true, data: secrets };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async setSecret(key, value) {
    if (!key) {
      throw new Error('Key is required');
    }
    if (value === undefined) {
      throw new Error('Value is required');
    }
    try {
      const result = await this.scopedService.set(key, value);
      return { success: true, data: result };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async deleteSecret(key) {
    if (!key) {
      throw new Error('Key is required');
    }
    try {
      await this.scopedService.delete(key);
      return { success: true, message: `Secret ${key} deleted successfully` };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async hasSecret(key) {
    const result = await this.getSecret(key);
    return result.success;
  }
}

module.exports = { SecretService, ScopedSecretService };