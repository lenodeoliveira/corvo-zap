import { INestApplication } from "@nestjs/common";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

export const enableSwagger = (
    app: INestApplication,
    docPath = 'api/docs'
) => {
    const config = new DocumentBuilder()
    .setTitle('NestJS boilerplate')
    .setDescription('Boilerplate API description')
    .addServer(`http://localhost:3000/`)
    .build()
    const document = SwaggerModule.createDocument(app, config)
    SwaggerModule.setup(docPath, app, document)
}