// Copyright 2021-2022, University of Colorado Boulder

/**
 * RaysMode is a union type for the different representations of rays, as set by the 'Rays' radio button group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const RaysModeTypeValues = [ 'marginal', 'principal', 'many', 'none' ] as const;
type RaysModeType = ( typeof RaysModeTypeValues )[number];

export { RaysModeTypeValues };
export type { RaysModeType as default };

