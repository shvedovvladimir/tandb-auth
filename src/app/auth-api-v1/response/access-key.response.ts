import { ApiModelProperty } from '@nestjs/swagger';

export class AccessKeyResponse {
    @ApiModelProperty()
    public readonly accessKey: string;
}