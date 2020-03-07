export interface ITandbAuthProxyService {
    getTokenByProvidedCredentials(providedCredentials: IProvidedCredentials): Promise<ITokenResponse>;
}

export interface IProvidedCredentials {
    accessKey: string;
}

export interface ITokenResponse {
    accessToken: string;
}
