export interface IAccessKeyService {
    addAccessKey(accessKeyValue: string): Promise<IAccessKeyValue>;
    getAccessKey(accessKeyValue: string): Promise<IAccessKey>;
}

export interface IAccessKey {
    accessKeyId: number;
    accessKey: string;
}

export interface IAccessKeyId {
    accessKeyId: number;
}

export interface IAccessKeyValue {
    accessKey: string;
}