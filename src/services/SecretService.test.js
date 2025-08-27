const { SecretService, ScopedSecretService } = require('./SecretService');

describe('SecretService', () => {
  let secretService;
  
  beforeEach(() => {
    secretService = new SecretService('test-scope');
  });

  describe('1. Secret Retrieval', () => {
    test('should retrieve a secret that was previously set', async () => {
      await secretService.setSecret('api-key', 'secret123');
      
      const result = await secretService.getSecret('api-key');
      
      expect(result.success).toBe(true);
      expect(result.data).toBe('secret123');
    });

    test('should return error when retrieving non-existent secret', async () => {
      const result = await secretService.getSecret('non-existent');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Secret not found: non-existent');
    });

    test('should handle error when key is not provided', async () => {
      await expect(secretService.getSecret()).rejects.toThrow('Key is required');
    });
  });

  describe('2. Listing All Secrets', () => {
    test('should list all secrets in the service', async () => {
      await secretService.setSecret('key1', 'value1');
      await secretService.setSecret('key2', 'value2');
      await secretService.setSecret('key3', 'value3');
      
      const result = await secretService.listAllSecrets();
      
      expect(result.success).toBe(true);
      expect(result.data).toHaveLength(3);
      expect(result.data).toContainEqual({ 
        key: 'key1', 
        value: 'value1', 
        scope: 'test-scope' 
      });
      expect(result.data).toContainEqual({ 
        key: 'key2', 
        value: 'value2', 
        scope: 'test-scope' 
      });
      expect(result.data).toContainEqual({ 
        key: 'key3', 
        value: 'value3', 
        scope: 'test-scope' 
      });
    });

    test('should correctly delegate to scoped secret service', async () => {
      const scopedService = secretService.scopedService;
      jest.spyOn(scopedService, 'list');
      
      await secretService.setSecret('test-key', 'test-value');
      await secretService.listAllSecrets();
      
      expect(scopedService.list).toHaveBeenCalled();
    });
  });

  describe('3. Setting a Secret', () => {
    test('should successfully set a new secret', async () => {
      const result = await secretService.setSecret('db-password', 'secure123');
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual({
        key: 'db-password',
        value: 'secure123',
        scope: 'test-scope'
      });
    });

    test('should update existing secret', async () => {
      await secretService.setSecret('config', 'old-value');
      const result = await secretService.setSecret('config', 'new-value');
      
      expect(result.success).toBe(true);
      expect(result.data.value).toBe('new-value');
      
      const getResult = await secretService.getSecret('config');
      expect(getResult.data).toBe('new-value');
    });

    test('should throw error when key is missing', async () => {
      await expect(secretService.setSecret()).rejects.toThrow('Key is required');
    });

    test('should throw error when value is missing', async () => {
      await expect(secretService.setSecret('key')).rejects.toThrow('Value is required');
    });
  });

  describe('4. Error Handling', () => {
    test('should handle errors gracefully in getSecret', async () => {
      const scopedService = secretService.scopedService;
      jest.spyOn(scopedService, 'get').mockRejectedValue(new Error('Database error'));
      
      const result = await secretService.getSecret('any-key');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Database error');
    });

    test('should handle errors gracefully in setSecret', async () => {
      const scopedService = secretService.scopedService;
      jest.spyOn(scopedService, 'set').mockRejectedValue(new Error('Write error'));
      
      const result = await secretService.setSecret('key', 'value');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Write error');
    });

    test('should handle errors gracefully in listAllSecrets', async () => {
      const scopedService = secretService.scopedService;
      jest.spyOn(scopedService, 'list').mockRejectedValue(new Error('List error'));
      
      const result = await secretService.listAllSecrets();
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('List error');
    });

    test('should validate that service correctly delegates errors from scoped service', async () => {
      const scopedService = secretService.scopedService;
      const originalGet = scopedService.get;
      
      scopedService.get = jest.fn().mockImplementation(() => {
        throw new Error('Custom error from scoped service');
      });
      
      const result = await secretService.getSecret('test');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Custom error from scoped service');
      expect(scopedService.get).toHaveBeenCalledWith('test');
      
      scopedService.get = originalGet;
    });
  });

  describe('5. Empty Results Handling', () => {
    test('should return empty array when no secrets exist', async () => {
      const result = await secretService.listAllSecrets();
      
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });

    test('should handle empty string as valid secret value', async () => {
      const setResult = await secretService.setSecret('empty-secret', '');
      expect(setResult.success).toBe(true);
      
      const getResult = await secretService.getSecret('empty-secret');
      expect(getResult.success).toBe(true);
      expect(getResult.data).toBe('');
    });

    test('should handle null as valid secret value', async () => {
      const setResult = await secretService.setSecret('null-secret', null);
      expect(setResult.success).toBe(true);
      
      const getResult = await secretService.getSecret('null-secret');
      expect(getResult.success).toBe(true);
      expect(getResult.data).toBe(null);
    });

    test('should correctly show empty results after deleting all secrets', async () => {
      await secretService.setSecret('temp1', 'value1');
      await secretService.setSecret('temp2', 'value2');
      
      await secretService.deleteSecret('temp1');
      await secretService.deleteSecret('temp2');
      
      const result = await secretService.listAllSecrets();
      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
    });
  });

  describe('Additional SecretService methods', () => {
    test('hasSecret should return true for existing secrets', async () => {
      await secretService.setSecret('exists', 'yes');
      
      const result = await secretService.hasSecret('exists');
      expect(result).toBe(true);
    });

    test('hasSecret should return false for non-existing secrets', async () => {
      const result = await secretService.hasSecret('does-not-exist');
      expect(result).toBe(false);
    });

    test('deleteSecret should remove secret successfully', async () => {
      await secretService.setSecret('to-delete', 'value');
      
      const deleteResult = await secretService.deleteSecret('to-delete');
      expect(deleteResult.success).toBe(true);
      expect(deleteResult.message).toBe('Secret to-delete deleted successfully');
      
      const hasResult = await secretService.hasSecret('to-delete');
      expect(hasResult).toBe(false);
    });

    test('deleteSecret should return error for non-existent secret', async () => {
      const result = await secretService.deleteSecret('non-existent');
      
      expect(result.success).toBe(false);
      expect(result.error).toBe('Secret not found: non-existent');
    });
  });
});