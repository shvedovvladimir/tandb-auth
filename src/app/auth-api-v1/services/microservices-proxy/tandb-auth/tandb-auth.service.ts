import * as got from 'got';
import {
    ITandbAuthProxyService, IProvidedCredentials, ITokenResponse,
} from './tandb-auth.interface';
import { ConfigService } from '@nestjs/config';
import { ProxyConnectionError } from '../../../../common/errors/proxy.error';
import { Injectable, Inject } from '@nestjs/common';
import { LOGGER } from '../../../di-constants';
import { ILogger } from '../../../../common/logger';

@Injectable()
export class TandbAuthProxyService implements ITandbAuthProxyService {

    constructor(
        @Inject(LOGGER)
        private readonly _logger: ILogger,
        private readonly _configService: ConfigService,
    ) {
    }

    public async getTokenByProvidedCredentials(providedCredentials: IProvidedCredentials): Promise<ITokenResponse> {
       return;
    }
}