import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { join } from 'path';
import { PayoutModule } from './payout/payout.module';
import { WithdrawModule } from './withdraw/withdraw.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, 
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE || process.env.DATABASE_URL,
      entities: [join(__dirname, '**', '*.entity.{ts,js}')],
      ssl: false,
      logging: true,
  
      synchronize: true,
    }),
    PayoutModule,
    WithdrawModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
