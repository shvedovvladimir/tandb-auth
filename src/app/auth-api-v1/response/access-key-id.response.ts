import { ApiModelProperty } from '@nestjs/swagger';

export class AccessKeyIdResponse {
    @ApiModelProperty()
    public readonly accessKeyId: number;
}