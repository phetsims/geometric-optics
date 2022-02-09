// Copyright 2022, University of Colorado Boulder

/**
 * Light Source is an optical object that is a point light source.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import geometricOptics from '../../geometricOptics.js';
import OpticalObject, { OpticalObjectOptions } from '../../common/model/OpticalObject.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Dimension2 from '../../../../dot/js/Dimension2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';

type LightSourceOptions = {
  htmlImageElement: HTMLImageElement,
} & OpticalObjectOptions;

class LightSource extends OpticalObject {

  // the PNG file used to visually represent the light source
  readonly htmlImageElement: HTMLImageElement;

  // Where positionProperty should be located relative to the left-top corner of htmlImageElement.
  readonly originOffset: Vector2;

  // View-to-model scale for associated HTMLImageElement
  public readonly scaleFactor: number;

  public readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: LightSourceOptions ) {

    const options = merge( {
      //TODO
    }, providedOptions );

    super( options );

    this.htmlImageElement = options.htmlImageElement;

    // Where the point of interest is relative to the left-top corner of PNG files for light sources.
    // This value is specific to the lamp*.png files, and must be uniform for all lamp*.png files.
    // This should be at the right-center of the light's bulb. +x right, +y down.
    this.originOffset = new Vector2( 62, 40 );

    this.scaleFactor = 0.5;

    //TODO some duplication with FramedObject here
    this.boundsProperty = new DerivedProperty(
      [ this.positionProperty ],
      ( position: Vector2 ) => {

        const htmlImageElementWidth = this.htmlImageElement.width;
        const htmlImageElementHeight = this.htmlImageElement.height;
        const size = new Dimension2( this.scaleFactor * htmlImageElementWidth, this.scaleFactor * htmlImageElementHeight );

        const origin = this.originOffset.timesScalar( this.scaleFactor );
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

geometricOptics.register( 'LightSource', LightSource );
export default LightSource;