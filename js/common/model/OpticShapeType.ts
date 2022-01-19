// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticShapeType is a union type for the optic shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const OpticShapeTypeValues = [ 'convex', 'concave', 'flat' ] as const;
type OpticShapeType = ( typeof OpticShapeTypeValues )[number];

export { OpticShapeTypeValues };
export type { OpticShapeType as default };

