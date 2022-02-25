// Copyright 2022, University of Colorado Boulder

/**
 * LightObject is an optical object that is a point light source.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = {

  // the PNG file used to visually represent the light
  htmlImageElement: HTMLImageElement
};

type LightObjectOptions = SelfOptions
  & PickRequired<OpticalObjectOptions, 'position' | 'tandem' | 'phetioDocumentation'>;

class LightObject extends OpticalObject {

  // the PNG file used to visually represent the light
  readonly htmlImageElement: HTMLImageElement;

  // model bounds of the object's visual representation
  public readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  // This should be at the right-center of the light's bulb. +x right, +y down.
  public static ORIGIN_OFFSET = new Vector2( 62, 40 );

  // Where the point-of-interest is relative to the left-top corner of PNG files for lights.
  // This value is specific to the light*.png files, and must be uniform for all light*.png files.
  // View-to-model scale for associated HTMLImageElement
  public static SCALE_FACTOR = 0.5;

  /**
   * @param opticalObjectNumber - positive integer used when labeling this object
   * @param opticPositionProperty
   * @param providedOptions
   */
  constructor( opticalObjectNumber: number, opticPositionProperty: IReadOnlyProperty<Vector2>, providedOptions: LightObjectOptions ) {

    super( opticalObjectNumber, opticPositionProperty, providedOptions );

    this.htmlImageElement = providedOptions.htmlImageElement;

    this.boundsProperty = new DerivedProperty( [ this.positionProperty ], ( position: Vector2 ) =>
      OpticalObject.computeBounds( this.htmlImageElement, position, LightObject.SCALE_FACTOR, LightObject.ORIGIN_OFFSET ), {

      //TODO is this still needed?
      reentrant: true
    } );
  }
}

geometricOptics.register( 'LightObject', LightObject );
export default LightObject;