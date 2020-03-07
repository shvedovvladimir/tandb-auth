import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Inject,
    Injectable,
    Body,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractController } from '../../common/controller/abstract.controller';
import { TokenResponse } from '../response/token.response';
import { CredentialsErrorResponse } from '../../common/response/credentials-error.response';
import { CommonErrorResponse } from '../../common/response/common-error.response';
import { AuthErrorResponse } from '../../common/response/auth-error.response';
import { DI_CONSTANTS } from '../di-constants';
import {
    ITandbAuthProxyService,
    ITokenResponse,
} from '../services/microservices-proxy/tandb-auth/tandb-auth.interface';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { getTokenJoiSchema } from '../schemas/get-token.schemas';
import { GetTokenDto } from '../dto/get-token.dto';

@Controller('api')
@ApiUseTags('Auth service api')
@Injectable()
export class AuthController extends AbstractController {

    constructor(
        @Inject(DI_CONSTANTS.ITandbAuthProxyService)
        private readonly _tandbAuthProxyService: ITandbAuthProxyService,
    ) {
        super();
    }

    @Post('get-token')
    @ApiBearerAuth()
    @ApiOperation(
        {
            title: 'Get access token by provided credentials.',
        },
    )
    @ApiResponse({
        status: 200,
        type: TokenResponse,
    })
    @ApiResponse({
        status: 400,
        type: CredentialsErrorResponse,
    })
    @ApiResponse({
        status: 500,
        type: CommonErrorResponse,
    })
    @ApiResponse({
        status: 401,
        type: AuthErrorResponse,
    } as any)
    @HttpCode(HttpStatus.OK)
    public async getToken(
        @Body(new JoiValidationPipe(getTokenJoiSchema)) providedCredentials: GetTokenDto,
    ): Promise<ITokenResponse> {
        const resp = await this._tandbAuthProxyService.getTokenByProvidedCredentials(providedCredentials);

        return resp;
    }
}