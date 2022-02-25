// Copyright 2022, University of Colorado Boulder

/**
 * Use PickRequired to pick properties of a type T and make them optional.
 * This is useful when picking superclass options that you want to expose in a subclass API.
 *
 * Example:
 * type MyClassOptions = PickRequired<PathOptions, 'stroke', 'lineWidth'>;
 * Result:
 * { stroke?: ColorDef, lineWidth?: number }
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

export type PickOptional<T, list extends keyof T> = Pick<Partial<T>, list>;