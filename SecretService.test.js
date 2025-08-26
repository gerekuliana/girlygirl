const SecretService = require('./SecretService');

describe('SecretService', () => {
  let secretService;
  let mockScopedSecretService;

  beforeEach(() => {
    mockScopedSecretService = {
      getSecret: jest.fn(),
      listAllSecrets: jest.fn(),
      setSecret: jest.fn(),
      deleteSecret: jest.fn(),
    };
    secretService = new SecretService(mockScopedSecretService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Test 1: Secret Retrieval', () => {
    test('should correctly retrieve a secret by delegating to scoped service', async () => {
      const testKey = 'API_KEY';
      const expectedValue = 'super-secret-value';
      mockScopedSecretService.getSecret.mockResolvedValue(expectedValue);

      const result = await secretService.getSecret(testKey);

      expect(mockScopedSecretService.getSecret).toHaveBeenCalledWith(testKey);
      expect(mockScopedSecretService.getSecret).toHaveBeenCalledTimes(1);
      expect(result).toBe(expectedValue);
    });

    test('should throw error when key is not provided for getSecret', async () => {
      await expect(secretService.getSecret()).rejects.toThrow('Key is required');
      await expect(secretService.getSecret('')).rejects.toThrow('Key is required');
      await expect(secretService.getSecret(null)).rejects.toThrow('Key is required');
      
      expect(mockScopedSecretService.getSecret).not.toHaveBeenCalled();
    });
  });

  describe('Test 2: Listing All Secrets', () => {
    test('should correctly list all secrets by delegating to scoped service', async () => {
      const expectedSecrets = [
        { key: 'SECRET_1', value: 'value1' },
        { key: 'SECRET_2', value: 'value2' },
        { key: 'SECRET_3', value: 'value3' }
      ];
      mockScopedSecretService.listAllSecrets.mockResolvedValue(expectedSecrets);

      const result = await secretService.listAllSecrets();

      expect(mockScopedSecretService.listAllSecrets).toHaveBeenCalled();
      expect(mockScopedSecretService.listAllSecrets).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedSecrets);
    });

    test('should handle empty list when no secrets exist', async () => {
      mockScopedSecretService.listAllSecrets.mockResolvedValue([]);

      const result = await secretService.listAllSecrets();

      expect(mockScopedSecretService.listAllSecrets).toHaveBeenCalled();
      expect(result).toEqual([]);
    });
  });

  describe('Test 3: Setting a Secret', () => {
    test('should correctly set a secret by delegating to scoped service', async () => {
      const testKey = 'NEW_SECRET';
      const testValue = 'new-secret-value';
      const expectedResponse = { success: true, key: testKey };
      mockScopedSecretService.setSecret.mockResolvedValue(expectedResponse);

      const result = await secretService.setSecret(testKey, testValue);

      expect(mockScopedSecretService.setSecret).toHaveBeenCalledWith(testKey, testValue);
      expect(mockScopedSecretService.setSecret).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    test('should throw error when key is not provided for setSecret', async () => {
      await expect(secretService.setSecret(null, 'value')).rejects.toThrow('Key is required');
      await expect(secretService.setSecret('', 'value')).rejects.toThrow('Key is required');
      
      expect(mockScopedSecretService.setSecret).not.toHaveBeenCalled();
    });

    test('should throw error when value is not provided for setSecret', async () => {
      await expect(secretService.setSecret('key')).rejects.toThrow('Value is required');
      await expect(secretService.setSecret('key', undefined)).rejects.toThrow('Value is required');
      
      expect(mockScopedSecretService.setSecret).not.toHaveBeenCalled();
    });

    test('should accept falsy values except undefined for setSecret', async () => {
      const expectedResponse = { success: true };
      mockScopedSecretService.setSecret.mockResolvedValue(expectedResponse);

      await secretService.setSecret('key1', null);
      await secretService.setSecret('key2', '');
      await secretService.setSecret('key3', 0);
      await secretService.setSecret('key4', false);

      expect(mockScopedSecretService.setSecret).toHaveBeenCalledTimes(4);
      expect(mockScopedSecretService.setSecret).toHaveBeenCalledWith('key1', null);
      expect(mockScopedSecretService.setSecret).toHaveBeenCalledWith('key2', '');
      expect(mockScopedSecretService.setSecret).toHaveBeenCalledWith('key3', 0);
      expect(mockScopedSecretService.setSecret).toHaveBeenCalledWith('key4', false);
    });
  });

  describe('Test 4: Error Handling', () => {
    test('should properly propagate errors from scoped service during getSecret', async () => {
      const errorMessage = 'Database connection failed';
      mockScopedSecretService.getSecret.mockRejectedValue(new Error(errorMessage));

      await expect(secretService.getSecret('SOME_KEY')).rejects.toThrow(errorMessage);
      expect(mockScopedSecretService.getSecret).toHaveBeenCalledWith('SOME_KEY');
    });

    test('should properly propagate errors from scoped service during listAllSecrets', async () => {
      const errorMessage = 'Unauthorized access';
      mockScopedSecretService.listAllSecrets.mockRejectedValue(new Error(errorMessage));

      await expect(secretService.listAllSecrets()).rejects.toThrow(errorMessage);
      expect(mockScopedSecretService.listAllSecrets).toHaveBeenCalled();
    });

    test('should properly propagate errors from scoped service during setSecret', async () => {
      const errorMessage = 'Insufficient permissions';
      mockScopedSecretService.setSecret.mockRejectedValue(new Error(errorMessage));

      await expect(secretService.setSecret('KEY', 'value')).rejects.toThrow(errorMessage);
      expect(mockScopedSecretService.setSecret).toHaveBeenCalledWith('KEY', 'value');
    });

    test('should handle network timeouts gracefully', async () => {
      const timeoutError = new Error('Network timeout');
      timeoutError.code = 'ETIMEDOUT';
      mockScopedSecretService.getSecret.mockRejectedValue(timeoutError);

      await expect(secretService.getSecret('TIMEOUT_KEY')).rejects.toThrow('Network timeout');
    });

    test('should handle hasSecret method error scenarios', async () => {
      mockScopedSecretService.getSecret.mockRejectedValue(new Error('Secret not found'));
      
      const result = await secretService.hasSecret('NON_EXISTENT_KEY');
      
      expect(result).toBe(false);
      expect(mockScopedSecretService.getSecret).toHaveBeenCalledWith('NON_EXISTENT_KEY');
    });
  });

  describe('Test 5: Empty Results Handling', () => {
    test('should handle null response from getSecret', async () => {
      mockScopedSecretService.getSecret.mockResolvedValue(null);

      const result = await secretService.getSecret('NULL_KEY');

      expect(result).toBeNull();
      expect(mockScopedSecretService.getSecret).toHaveBeenCalledWith('NULL_KEY');
    });

    test('should handle undefined response from getSecret', async () => {
      mockScopedSecretService.getSecret.mockResolvedValue(undefined);

      const result = await secretService.getSecret('UNDEFINED_KEY');

      expect(result).toBeUndefined();
      expect(mockScopedSecretService.getSecret).toHaveBeenCalledWith('UNDEFINED_KEY');
    });

    test('should handle empty array response from listAllSecrets', async () => {
      mockScopedSecretService.listAllSecrets.mockResolvedValue([]);

      const result = await secretService.listAllSecrets();

      expect(result).toEqual([]);
      expect(result.length).toBe(0);
      expect(mockScopedSecretService.listAllSecrets).toHaveBeenCalled();
    });

    test('should correctly identify non-existent secrets in hasSecret', async () => {
      mockScopedSecretService.getSecret.mockResolvedValue(null);
      
      const resultNull = await secretService.hasSecret('NULL_SECRET');
      expect(resultNull).toBe(false);

      mockScopedSecretService.getSecret.mockResolvedValue(undefined);
      
      const resultUndefined = await secretService.hasSecret('UNDEFINED_SECRET');
      expect(resultUndefined).toBe(false);

      expect(mockScopedSecretService.getSecret).toHaveBeenCalledTimes(2);
    });

    test('should correctly identify existing secrets in hasSecret', async () => {
      mockScopedSecretService.getSecret.mockResolvedValue('some-value');
      
      const result = await secretService.hasSecret('EXISTING_SECRET');
      
      expect(result).toBe(true);
      expect(mockScopedSecretService.getSecret).toHaveBeenCalledWith('EXISTING_SECRET');
    });
  });

  describe('Additional Coverage: deleteSecret method', () => {
    test('should correctly delete a secret by delegating to scoped service', async () => {
      const testKey = 'SECRET_TO_DELETE';
      const expectedResponse = { success: true, deleted: testKey };
      mockScopedSecretService.deleteSecret.mockResolvedValue(expectedResponse);

      const result = await secretService.deleteSecret(testKey);

      expect(mockScopedSecretService.deleteSecret).toHaveBeenCalledWith(testKey);
      expect(mockScopedSecretService.deleteSecret).toHaveBeenCalledTimes(1);
      expect(result).toEqual(expectedResponse);
    });

    test('should throw error when key is not provided for deleteSecret', async () => {
      await expect(secretService.deleteSecret()).rejects.toThrow('Key is required');
      await expect(secretService.deleteSecret('')).rejects.toThrow('Key is required');
      await expect(secretService.deleteSecret(null)).rejects.toThrow('Key is required');
      
      expect(mockScopedSecretService.deleteSecret).not.toHaveBeenCalled();
    });

    test('should properly propagate errors from scoped service during deleteSecret', async () => {
      const errorMessage = 'Cannot delete system secret';
      mockScopedSecretService.deleteSecret.mockRejectedValue(new Error(errorMessage));

      await expect(secretService.deleteSecret('SYSTEM_KEY')).rejects.toThrow(errorMessage);
      expect(mockScopedSecretService.deleteSecret).toHaveBeenCalledWith('SYSTEM_KEY');
    });
  });

  describe('Additional Coverage: hasSecret method', () => {
    test('should throw error when key is not provided for hasSecret', async () => {
      await expect(secretService.hasSecret()).rejects.toThrow('Key is required');
      await expect(secretService.hasSecret('')).rejects.toThrow('Key is required');
      await expect(secretService.hasSecret(null)).rejects.toThrow('Key is required');
      
      expect(mockScopedSecretService.getSecret).not.toHaveBeenCalled();
    });
  });
});