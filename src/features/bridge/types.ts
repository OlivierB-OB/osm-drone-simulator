import type { ModuleFeatures as RoadModuleFeatures } from '../road/types';
import type { ModuleFeatures as RailwayModuleFeatures } from '../railway/types';

export interface ModuleFeatures
  extends RoadModuleFeatures, RailwayModuleFeatures {}
