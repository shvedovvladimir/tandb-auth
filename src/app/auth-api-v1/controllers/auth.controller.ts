import {
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    Inject,
    Injectable,
    Body,
    Get,
    Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiUseTags, ApiBearerAuth } from '@nestjs/swagger';
import { AbstractController } from '../../common/controller/abstract.controller';
import { TokenResponse } from '../response/token.response';
import { CredentialsErrorResponse } from '../../common/response/credentials-error.response';
import { CommonErrorResponse } from '../../common/response/common-error.response';
import { AuthErrorResponse } from '../../common/response/auth-error.response';
import { DI_CONSTANTS } from '../di-constants';
import { JoiValidationPipe } from '../../common/pipes/joi-validation.pipe';
import { tokenJoiSchema } from '../schemas/token.schemas';
import { TokenDto } from '../dto/token.dto';
import { ITokenService, IToken } from '../services/token-service/token.interface';
import { AccessKeyDto } from '../dto/access-key.dto';
import { accessKeyJoiSchema } from '../schemas/access-key.schemas';
import { IAccessKeyService, IAccessKeyId, IAccessKeyValue } from '../services/access-key-service/access-key.service.interface';
import { AccessKeyResponse } from '../response/access-key.response';
import { AccessKeyNotFoundErrorResponse } from '../response/access-key-not-found-error.response';
import { AccessKeyIdResponse } from '../response/access-key-id.response';

@Controller('api')
@ApiUseTags('Auth service api')
@Injectable()
export class AuthController extends AbstractController {

    constructor(
        @Inject(DI_CONSTANTS.ITokenService)
        private readonly _tandbAuthProxyService: ITokenService,
        @Inject(DI_CONSTANTS.IAccessKeyService)
        private readonly _accessKeyService: IAccessKeyService,
    ) {
        super();
    }

    @Post('add-token')
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
        status: 404,
        type: AccessKeyNotFoundErrorResponse,
    })
    @ApiResponse({
        status: 401,
        type: AuthErrorResponse,
    } as any)
    @HttpCode(HttpStatus.OK)
    public async addToken(
        @Body(new JoiValidationPipe(accessKeyJoiSchema)) providedCredentials: AccessKeyDto,
    ): Promise<IToken> {
        const resp = await this._tandbAuthProxyService.addTokenByProvidedCredentials(providedCredentials);

        return resp;
    }

    @Post('add-access-key')
    @ApiBearerAuth()
    @ApiOperation(
        {
            title: 'Get access token by provided credentials.',
        },
    )
    @ApiResponse({
        status: 200,
        type: AccessKeyResponse,
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
    public async addAccessKey(
        @Body(new JoiValidationPipe(accessKeyJoiSchema)) accessKey: AccessKeyDto,
    ): Promise<IAccessKeyValue> {
        const resp = await this._accessKeyService.addAccessKey(accessKey.accessKey);

        return resp;
    }

    @Get('access-key-id-by-token')
    @ApiBearerAuth()
    @ApiOperation(
        {
            title: 'Get check token',
        },
    )
    @ApiResponse({
        status: 200,
        type: AccessKeyIdResponse,
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
    public async checkToken(
        @Query(new JoiValidationPipe(tokenJoiSchema)) tokenPayload: TokenDto,
    ): Promise<IAccessKeyId> {
        const resp = await this._tandbAuthProxyService.getAccessKeyIdByToken(tokenPayload);

        return resp;
    }
}