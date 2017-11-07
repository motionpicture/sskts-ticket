/**
 * AwsCognitoService
 */
import { inject, TestBed } from '@angular/core/testing';
import * as AWS from 'aws-sdk';
import { AwsCognitoService } from './aws-cognito.service';

describe('AwsCognitoService', () => {
    it('authenticateWithTerminal 正常', async () => {
        spyOn(AWS, 'CognitoIdentityCredentials').and.returnValue({});
        const service = new AwsCognitoService();
        service.authenticateWithTerminal();
        expect(service.credentials).not.toBeNull();
    });

    it('isAuthenticate 認証OK', async () => {
        spyOn(AWS, 'CognitoIdentityCredentials').and.returnValue({ identityId: '12345678' });
        const service = new AwsCognitoService();
        service.authenticateWithTerminal();
        expect(service.isAuthenticate()).toBeTruthy();
    });

    it('updateRecords 正常', async () => {
        spyOn(AWS, 'CognitoIdentityCredentials').and.returnValue({
            getPromise: () => {
                return Promise.resolve();
            }
        });
        spyOn(AWS, 'CognitoSync').and.returnValue({
            listRecords: () => {
                return {
                    promise: () => {
                        return Promise.resolve({
                            Records: [
                                { Key: 'string', Op: 'string', SyncCount: 0, Value: JSON.stringify({ test: 'string' }) }
                            ]
                        });
                    }
                };
            },
            updateRecords: () => {
                return {
                    promise: () => {
                        return Promise.resolve({
                            Records: [
                                { Key: 'string', Op: 'string', SyncCount: 0, Value: JSON.stringify({ test: 'string' }) }
                            ]
                        });
                    }
                };
            }
        });
        const service = new AwsCognitoService();
        service.authenticateWithTerminal();
        const updateRecords = await service.updateRecords('TEST', {});
        expect(updateRecords).toBeTruthy();
    });

    it('getRecords 正常', async () => {
        spyOn(AWS, 'CognitoIdentityCredentials').and.returnValue({
            getPromise: () => {
                return Promise.resolve();
            }
        });
        spyOn(AWS, 'CognitoSync').and.returnValue({
            listRecords: () => {
                return {
                    promise: () => {
                        return Promise.resolve({
                            Records: [
                                { Key: 'string', Op: 'string', SyncCount: 0, Value: JSON.stringify({ test: 'string' }) }
                            ]
                        });
                    }
                };
            }
        });
        const service = new AwsCognitoService();
        service.authenticateWithTerminal();
        const getRecords = await service.getRecords('TEST');
        expect(getRecords).toBeTruthy();
    });
});
