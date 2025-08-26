class SecretService {
  constructor(scopedSecretService) {
    this.scopedSecretService = scopedSecretService;
  }

  async getSecret(key) {
    if (!key) {
      throw new Error('Key is required');
    }
    return await this.scopedSecretService.getSecret(key);
  }

  async listAllSecrets() {
    return await this.scopedSecretService.listAllSecrets();
  }

  async setSecret(key, value) {
    if (!key) {
      throw new Error('Key is required');
    }
    if (value === undefined) {
      throw new Error('Value is required');
    }
    return await this.scopedSecretService.setSecret(key, value);
  }

  async deleteSecret(key) {
    if (!key) {
      throw new Error('Key is required');
    }
    return await this.scopedSecretService.deleteSecret(key);
  }

  async hasSecret(key) {
    if (!key) {
      throw new Error('Key is required');
    }
    try {
      const secret = await this.scopedSecretService.getSecret(key);
      return secret !== null && secret !== undefined;
    } catch (error) {
      return false;
    }
  }
}

module.exports = SecretService;