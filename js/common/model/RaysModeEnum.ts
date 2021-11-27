// Copyright 2021, University of Colorado Boulder

/**
 * RaysMode is the enumeration for the different representations of rays, as set by the 'Rays' radio button group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const RaysModeValues = [ 'marginal', 'principal', 'many', 'none' ] as const;
type RaysModeEnum = ( typeof RaysModeValues )[number];

export { RaysModeValues };
export type { RaysModeEnum as default };

