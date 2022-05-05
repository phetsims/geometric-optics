// Copyright 2022, University of Colorado Boulder

/**
 * OpticSurfaceType is a union type for the possible surface types of an optic.
 * In this simulation, both surfaces of the optic have the same type.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export const OpticSurfaceTypeValues = [ 'convex', 'concave', 'flat' ] as const;
export type OpticSurfaceType = ( typeof OpticSurfaceTypeValues )[number];