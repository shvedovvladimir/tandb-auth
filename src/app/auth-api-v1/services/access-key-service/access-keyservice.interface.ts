export interface IAccessKeyService {
    addAccessKey(accessKeyValue: string): Promise<IAccessKey>;
    getAccessKey(accessKeyValue: string): Promise<IAccessKey>;
}

export interface IAccessKey {
    accessKey: string;
}