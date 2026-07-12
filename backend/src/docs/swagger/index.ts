import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const SWAGGER_JWT_AUTH = 'JWT-auth';

export const enableSwagger = (
    app: INestApplication,
    docPath = 'api/docs'
) => {
    const config = new DocumentBuilder()
    .setTitle('NestJS boilerplate')
    .setDescription('Boilerplate API description')
    .addServer(`http://localhost:3000/`)
    .addBearerAuth(
        {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'Token JWT obtido em POST /auth/login. Exemplo: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        },
        SWAGGER_JWT_AUTH,
    )
    .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup(docPath, app, document)
}