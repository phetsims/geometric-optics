// Copyright 2021, University of Colorado Boulder

/**
 * OpticShapeEnum identifies the shape of the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

const OpticShapeValues = [ 'convex', 'concave', 'flat' ] as const;
type OpticShapeEnum = ( typeof OpticShapeValues )[number];

export { OpticShapeValues, OpticShapeEnum as default };
