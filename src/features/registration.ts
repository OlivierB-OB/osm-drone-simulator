import { buildingModule } from './building';
import { roadModule } from './road';
import { railwayModule } from './railway';
import { waterModule } from './water';
import { aerowayModule } from './aeroway';
import { structureModule } from './structure';
import { barrierModule } from './barrier';
import { vegetationModule } from './vegetation';
import { landuseModule } from './landuse';
import { bridgeModule } from './bridge';

export const MODULES = [
  buildingModule,
  roadModule,
  railwayModule,
  waterModule,
  aerowayModule,
  structureModule,
  barrierModule,
  vegetationModule,
  landuseModule,
  bridgeModule,
].sort((a, b) => a.classifyPriority - b.classifyPriority);
