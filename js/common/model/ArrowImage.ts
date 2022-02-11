// Copyright 2022, University of Colorado Boulder

/**
 * ArrowImage is the model of the optical image associated with an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import OpticalImage, { OpticalImageOptions } from './OpticalImage.js';
import Optic from './Optic.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowObject from './ArrowObject.js';

class ArrowImage extends OpticalImage {

  readonly arrowObject: ArrowObject;
  readonly optic: Optic;

  /**
   * @param arrowObject
   * @param optic
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic,
               providedOptions: OpticalImageOptions ) {

    const options = merge( {}, providedOptions );

    super( arrowObject.positionProperty, optic, options );

    this.arrowObject = arrowObject;
    this.optic = optic;

    //TODO more?
  }
}

geometricOptics.register( 'ArrowImage', ArrowImage );
export default ArrowImage;