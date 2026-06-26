import { WebSocketGateway } from '@nestjs/websockets';
import { SessionService } from './session.service';

@WebSocketGateway()
export class SessionGateway {
  constructor(private readonly sessionService: SessionService) {}
}
