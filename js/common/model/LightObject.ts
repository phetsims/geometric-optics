// Copyright 2022, University of Colorado Boulder

/**
 * LightObject is an optical object that is a point light source.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type LightObjectOptions = {
  htmlImageElement: HTMLImageElement,
} & OpticalObjectOptions;

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
   * @param opticalObjectNumber
   * @param opticPositionProperty
   * @param providedOptions
   */
  constructor( opticalObjectNumber: number, opticPositionProperty: IReadOnlyProperty<Vector2>, providedOptions: LightObjectOptions ) {

    const options = merge( {
      //TODO
    }, providedOptions );

    super( opticalObjectNumber, opticPositionProperty, options );

    this.htmlImageElement = options.htmlImageElement;

    //TODO some duplication with FramedObject here
    this.boundsProperty = new DerivedProperty(
      [ this.positionProperty ],
      ( position: Vector2 ) => {

        const htmlImageElementWidth = this.htmlImageElement.width;
        const htmlImageElementHeight = this.htmlImageElement.height;
        const scaleFactor = LightObject.SCALE_FACTOR;
        const size = new Dimension2( scaleFactor * htmlImageElementWidth, scaleFactor * htmlImageElementHeight );

        const origin = LightObject.ORIGIN_OFFSET.timesScalar( scaleFactor );
        const offsetX = origin.x;
        const offsetY = -origin.y;  // flip sign of offset.y because +y is up in the model
        const left = position.x - offsetX;
        const bottom = position.y - offsetY - size.height;

        return size.toBounds( left, bottom );
      }, {

        //TODO is this still needed?
        reentrant: true
      } );
  }
}

geometricOptics.register( 'LightObject', LightObject );
export default LightObject;