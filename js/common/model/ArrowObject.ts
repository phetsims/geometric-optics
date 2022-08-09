// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObject is the model for arrow objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { TColor } from '../../../../scenery/js/imports.js';

type SelfOptions = {
  fill: TColor; // the fill color for the arrow
};

type ArrowObjectOptions = SelfOptions & PickRequired<OpticalObjectOptions, 'position' | 'tandem'>;

export default class ArrowObject extends OpticalObject {

  // fill for the arrow object
  public readonly fill: TColor;

  // See https://github.com/phetsims/geometric-optics/issues/429, in cm
  public static readonly MAX_MAGNITUDE = 80;

  /**
   * @param opticalObjectNumber - positive integer used when labeling this object
   * @param opticPositionProperty
   * @param providedOptions
   */
  public constructor( opticalObjectNumber: number, opticPositionProperty: TReadOnlyProperty<Vector2>, providedOptions: ArrowObjectOptions ) {

    super( opticalObjectNumber, opticPositionProperty, providedOptions );

    this.fill = providedOptions.fill;
  }
}

geometricOptics.register( 'ArrowObject', ArrowObject );