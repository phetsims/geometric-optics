// Copyright 2022, University of Colorado Boulder

/**
 * SurfaceType is a union type for the possible surface shapes of an optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const SurfaceTypeValues = [ 'convex', 'concave', 'flat' ] as const;
type SurfaceType = ( typeof SurfaceTypeValues )[number];

export { SurfaceTypeValues };
export type { SurfaceType as default };

