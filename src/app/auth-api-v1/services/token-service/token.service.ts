import {
    IProvidedCredentials, IToken, ITokenService,
} from './token.interface';
import { Injectable, Inject } from '@nestjs/common';
import { LOGGER, DI_CONSTANTS } from '../../di-constants';
import { ILogger } from '../../../common/logger';
import { TokenEntity } from '../../entities/typeorm/token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IJwtService } from '../jwt/jwt.service.interface';
import { MILLISECONDS_IN_SECOND } from '../../../common/constants/constants';
import { InvalidTokenError } from '../../errors/invalid-token.error';
import { IAccessKeyService, IAccessKeyId } from '../access-key-service/access-key.service.interface';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class TokenService implements ITokenService {
    private readonly _loggerPrefix: string = `${TokenService.name}`;

    constructor(
        @InjectRepository(TokenEntity)
        protected readonly _tokenRepository: Repository<TokenEntity>,
        @Inject(LOGGER)
        private readonly _logger: ILogger,
        @Inject(DI_CONSTANTS.IJwtService)
        private readonly _jwtService: IJwtService,
        @Inject(DI_CONSTANTS.IAccessKeyService)
        private readonly _accessKeyService: IAccessKeyService,
    ) {}

    public async addTokenByProvidedCredentials(providedCredentials: IProvidedCredentials): Promise<IToken> {
        this._logger.debug(this._loggerPrefix, 'Try add token by provided credentials');

        try {
            const accessKeyItem = await this._accessKeyService.getAccessKey(providedCredentials.accessKey);

            const payload = {
                sub: accessKeyItem.accessKeyId,
                token_type: 'bearer',
            };
            const data = this._jwtService.generateJwt(payload);

            const newToken = {
                accessKey: accessKeyItem.accessKey,
                tokenValue: data.jwt,
                tokenType: payload.token_type,
                tokenMeta: {},
                expiresIn: data.expiredIn,
            };

            const createdToken = await this._tokenRepository.save(
                this._tokenRepository.create(newToken),
            );

            return {
                accessToken: createdToken.tokenValue,
            };
        } catch (err) {
            this._logger.error(
                this._loggerPrefix,
                `Got error while adding token by provided credentials`,
                providedCredentials,
                err.message,
            );

            throw err;
        }
    }

    public async getAccessKeyIdByToken(tokenPayload: IToken): Promise<IAccessKeyId> {
        this._logger.debug(this._loggerPrefix, 'try get accessKeyId by provided token', tokenPayload);
        const verifiedToken = this._jwtService.checkToken(tokenPayload.accessToken);
        let token: TokenEntity = null;

        try {
            token = await this._tokenRepository.createQueryBuilder()
                .where('"token_value" = :token', { token: tokenPayload.accessToken })
                .andWhere('"deleted_at" IS NULL')
                .getOne();

            if (!token) {
                this._logger.error(this._loggerPrefix, `Token not found`, tokenPayload);

                throw new InvalidTokenError({ message: 'Token not found', verifiedToken });
            }

            if (
                Number(verifiedToken.exp) !== Number(token.expiresIn) ||
                Number(token.expiresIn) < Math.floor(Date.now() / MILLISECONDS_IN_SECOND)
            ) {
                this._logger.error(this._loggerPrefix, `Token expired`, tokenPayload);
                await this._tokenRepository
                    .update(
                        { tokenId: token.tokenId },
                        { deletedAt: new Date() },
                    );

                throw new InvalidTokenError({ message: 'Token expired', verifiedToken });
            }

            return {
                accessKeyId: Number(verifiedToken.sub),
            };
        } catch (err) {
            this._logger.error(
                this._loggerPrefix,
                `Got error while checking token`,
                tokenPayload,
                err.message,
            );
            if (err instanceof jwt.TokenExpiredError && token.tokenId) {
                await this._tokenRepository
                    .update(
                        { tokenId: token.tokenId },
                        { deletedAt: new Date() },
                    );
            }

            throw err;
        }
    }
}