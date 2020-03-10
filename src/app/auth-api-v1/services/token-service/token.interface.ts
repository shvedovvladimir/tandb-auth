import { IAccessKeyId } from '../access-key-service/access-key.service.interface';

export interface ITokenService {
    addTokenByProvidedCredentials(providedCredentials: IProvidedCredentials): Promise<IToken>;
    getAccessKeyIdByToken(tokenPayload: IToken): Promise<IAccessKeyId>;
}

export interface IProvidedCredentials {
    accessKey: string;
}

export interface IToken {
    accessToken: string;
}
