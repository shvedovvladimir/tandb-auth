import { Injectable, Inject } from '@nestjs/common';
import * as passwordHash from 'password-hash';
import { IAccessKeyService, IAccessKey } from './access-keyservice.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccessKeyEntity } from '../../entities/typeorm/access-key.entity';
import { ILogger } from '../../../common/logger';
import { LOGGER } from '../../di-constants';
import { AccessKeyAlreadyExistError } from '../../errors/access-key-already-exist.error';
import { AccessKeyNotFoundError } from '../../errors/access-key-not-found.error';

@Injectable()
export class AccessKeyService implements IAccessKeyService {
    private readonly _loggerPrefix: string = `${AccessKeyService.name}`;

    constructor(
        @InjectRepository(AccessKeyEntity)
        protected readonly _accessKeyRepository: Repository<AccessKeyEntity>,
        @Inject(LOGGER)
        private readonly _logger: ILogger,
    ) {}

    public async addAccessKey(accessKeyValue: string): Promise<IAccessKey> {
        this._logger.debug(this._loggerPrefix, `Try add access key`, accessKeyValue);

        try {
            return this._accessKeyRepository.manager.transaction(async (entityManager) => {
                const accessKey = await entityManager
                    .getRepository(AccessKeyEntity)
                    .createQueryBuilder()
                    .where('"access_key_value" = :accessKeyValue', {accessKeyValue})
                    .getOne();

                if (accessKey) {
                    throw new AccessKeyAlreadyExistError({accessKeyValue});
                }

                const newAccessKey = {
                    accessKeyValue,
                };

                const createdAccessKey = await entityManager
                    .getRepository(AccessKeyEntity)
                    .save(
                        entityManager
                            .getRepository(AccessKeyEntity)
                            .create(newAccessKey),
                    );

                return {
                    accessKey: createdAccessKey.accessKeyValue,
                };
            });
        } catch (err) {
            this._logger.error(
                this._loggerPrefix,
                `Got error while adding access key`,
                accessKeyValue,
                err.message,
            );

            throw err;
        }
    }

    public async getAccessKey(accessKeyValue: string): Promise<IAccessKey> {
        const accessKey = await this._accessKeyRepository.createQueryBuilder()
            .where('"access_key_value" = :accessKeyValue', {accessKeyValue})
            .getOne();

        if (!accessKey) {
            throw new AccessKeyNotFoundError({accessKeyValue});
        }

        return {
            accessKey: accessKey.accessKeyValue,
        };
    }
}