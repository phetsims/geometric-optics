// Copyright 2022, University of Colorado Boulder

/**
 * OpticShape is a union type for the possible shapes of an optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const OpticShapeValues = [ 'convex', 'concave', 'flat' ] as const;
type OpticShape = ( typeof OpticShapeValues )[number];

export type { OpticShape };
export { OpticShapeValues };