import { ApiModelProperty, ApiModelPropertyOptional } from '@nestjs/swagger';

export class AccessKeyNotFoundErrorResponse {
    @ApiModelProperty({
        default: 404,
        example: 404,
    })
    public statusCode: number;

    @ApiModelProperty({enum: [
        'ACCESS_KEY_NOT_FOUND',
    ]})
    public code: string;

    @ApiModelPropertyOptional()
    public details: object;
}
