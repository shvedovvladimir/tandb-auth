import { ApiModelProperty } from '@nestjs/swagger';

export class GetTokenDto {
    @ApiModelProperty()
    public readonly accessKey: string;
}