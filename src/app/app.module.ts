import { Module } from '@nestjs/common';
import { AuthApiV1Module } from './auth-api-v1/auth-api-v1.module';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
@Module({
    imports: [
        AuthApiV1Module,
        ConfigModule.forRoot({
            load: [configuration],
        }),
    ],
})
export class ApplicationModule {}