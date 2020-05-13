import { TypeOrmModule } from '@nestjs/typeorm'
import { ConfigModule } from '../config/config.module'
import { ConfigService } from '../config/config.service'
import { ConnectionOptions } from 'typeorm'
import { Configuration } from '../config/config.keys'

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(config: ConfigService) {
      return {
        type: 'postgres' as 'postgres',
        host: config.get(Configuration.POSTGRES_HOST),
        username: config.get(Configuration.POSTGRES_USERNAME),
        port: parseInt(config.get(Configuration.POSTGRES_PORT)),
        database: config.get(Configuration.POSTGRES_DATABASE),
        password: config.get(Configuration.POSTGRES_PASSWORD),
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      } as ConnectionOptions
    },
  }),
]
