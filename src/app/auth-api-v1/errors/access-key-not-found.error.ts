import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/errors/common';

export class AccessKeyNotFoundError extends CommonError {
    public status: number = HttpStatus.NOT_FOUND;

    constructor(info: object) {
        super(
            'Access key not found',
            'ACCESS_KEY_NOT_FOUND',
            info,
        );
    }
}
