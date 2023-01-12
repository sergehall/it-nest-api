import { Controller } from '@nestjs/common';
import { DemonsService } from './demons.service';

@Controller('demons')
export class DemonsController {
  constructor(private readonly demonsService: DemonsService) {}
}
