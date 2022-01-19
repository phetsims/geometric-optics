// Copyright 2021-2022, University of Colorado Boulder

/**
 * OpticShapeType is a union type for the optic shapes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const OpticShapeValues = [ 'convex', 'concave', 'flat' ] as const;
type OpticShapeType = ( typeof OpticShapeValues )[number];

export { OpticShapeValues };
export type { OpticShapeType as default };

