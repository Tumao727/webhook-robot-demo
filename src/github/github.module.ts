import { Module, HttpModule } from '@nestjs/common';
import { GithubService } from './github.service';
import { GithubController } from './github.controller';

@Module({
  imports: [HttpModule],
  providers: [GithubService],
  controllers: [GithubController]
})
export class GithubModule {}
