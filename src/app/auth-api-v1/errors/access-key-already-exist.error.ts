import { HttpStatus } from '@nestjs/common';
import { CommonError } from '../../common/errors/common';

export class AccessKeyAlreadyExistError extends CommonError {
    public status: number = HttpStatus.BAD_REQUEST;

    constructor(info: object) {
        super(
            'Access key already exist',
            'ACCESS_KEY_ALREADY_EXIST',
            info,
        );
    }
}
