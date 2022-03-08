// Copyright 2022, University of Colorado Boulder

/**
 * RaysType is a union type for the different representations of rays, as set by the 'Rays' radio button group.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const RaysTypeValues = [ 'marginal', 'principal', 'many', 'none' ] as const;
export type RaysType = ( typeof RaysTypeValues )[number];