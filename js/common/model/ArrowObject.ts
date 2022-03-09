// Copyright 2022, University of Colorado Boulder

/**
 * ArrowObject is the model for arrow objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { IColor } from '../../../../scenery/js/imports.js';

type SelfOptions = {
  fill: IColor; // the fill color for the arrow
};

type ArrowObjectOptions = SelfOptions & PickRequired<OpticalObjectOptions, 'position' | 'tandem'>;

class ArrowObject extends OpticalObject {

  public readonly fill: IColor;

  /**
   * @param opticalObjectNumber - positive integer used when labeling this object
   * @param opticPositionProperty
   * @param providedOptions
   */
  constructor( opticalObjectNumber: number, opticPositionProperty: IReadOnlyProperty<Vector2>, providedOptions: ArrowObjectOptions ) {

    super( opticalObjectNumber, opticPositionProperty, providedOptions );

    this.fill = providedOptions.fill;
  }
}

geometricOptics.register( 'ArrowObject', ArrowObject );
export default ArrowObject;