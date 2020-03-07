import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { GatewayApiV1Module } from './auth-api-v1/auth-api-v1.module';
import { AuthController } from './auth-api-v1/controllers/auth.controller';
import { ConfigModule } from '@nestjs/config';
import configuration from '../../config/configuration';
@Module({
    imports: [
        GatewayApiV1Module,
        ConfigModule.forRoot({
            load: [configuration],
        }),
    ],
})
export class ApplicationModule implements NestModule {

    public configure(consumer: MiddlewareConsumer): MiddlewareConsumer | void {
        consumer
            .apply()  // use middleware
            .forRoutes(
                AuthController,
            );
    }
}