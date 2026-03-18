/**
 * Color representation in hex format
 */
export type HexColor = string; // e.g., '#ff0000'

/**
 * Color palette mapping for different feature categories
 */
export interface ColorPalette {
  // Building colors by type (roads/waters/vegetation now use groundColors from config)
  buildings: Record<string, HexColor>;
}
