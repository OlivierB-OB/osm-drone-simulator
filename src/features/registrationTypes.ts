import { type ModuleFeatures as BuildingFeatureModule } from './building/types';
import { type ModuleFeatures as RoadFeatureModule } from './road/types';
import { type ModuleFeatures as RailwayFeatureModule } from './railway/types';
import { type ModuleFeatures as WaterFeatureModule } from './water/types';
import { type ModuleFeatures as AerowayFeatureModule } from './aeroway/types';
import { type ModuleFeatures as StructureFeatureModule } from './structure/types';
import { type ModuleFeatures as BarrierFeatureModule } from './barrier/types';
import { type ModuleFeatures as VegetationFeatureModule } from './vegetation/types';
import { type ModuleFeatures as LanduseFeatureModule } from './landuse/types';
import { type ModuleFeatures as BridgeFeatureModule } from './bridge/types';

export interface ModulesFeatures
  extends
    BuildingFeatureModule,
    RoadFeatureModule,
    RailwayFeatureModule,
    WaterFeatureModule,
    AerowayFeatureModule,
    StructureFeatureModule,
    BarrierFeatureModule,
    VegetationFeatureModule,
    LanduseFeatureModule,
    BridgeFeatureModule {}
