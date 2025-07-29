import { Module } from '@nestjs/common';
import { UserModule } from "./api/User/user.module";
import { DatabaseModule } from "./database/database.module";

@Module({
  imports: [
    DatabaseModule,
    UserModule,
  ],
  controllers: [],
  providers: [],
})

export class AppModule {
}
