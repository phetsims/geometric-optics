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

type LightSourceOptions = {
  htmlImageElement: HTMLImageElement,
} & OpticalObjectOptions;

class LightSource extends OpticalObject {

  // the PNG file used to visually represent the light source
  readonly htmlImageElement: HTMLImageElement;

  // Where positionProperty should be located relative to the left-top corner of htmlImageElement.
  readonly originOffset: Vector2;

  /**
   * @param providedOptions
   */
  constructor( providedOptions: LightSourceOptions ) {

    const options = merge( {
      //TODO
    }, providedOptions );

    super( options );

    this.htmlImageElement = options.htmlImageElement;

    // This value is specific to the lamp*.png files, and must be uniform for all lamp*.png files.
    this.originOffset = new Vector2( 62, 40 );
  }
}

geometricOptics.register( 'LightSource', LightSource );
export default LightSource;