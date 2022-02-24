// Copyright 2022, University of Colorado Boulder

/**
 * This file contains utility types that are specific to this sim, and are not related to a specific class.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

type PickRequired<T, list extends keyof T> = Pick<Required<T>, list>;
type PickOptional<T, list extends keyof T> = Pick<Partial<T>, list>;

export type { PickRequired, PickOptional };