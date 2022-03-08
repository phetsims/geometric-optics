// Copyright 2022, University of Colorado Boulder

/**
 * ArrowImage is the model of the optical image associated with an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import OpticalImage from './OpticalImage.js';
import Optic from './Optic.js';
import ArrowObject from './ArrowObject.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';
import { IColor } from '../../../../scenery/js/imports.js';

type ArrowImageOptions = PickRequired<OpticalImage, 'tandem' | 'phetioDocumentation'>;

class ArrowImage extends OpticalImage {

  public readonly fill: IColor;

  /**
   * @param arrowObject - the optical object that this image is associated with
   * @param optic
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject, optic: Optic, providedOptions: ArrowImageOptions ) {

    super( arrowObject, optic, providedOptions );

    this.fill = arrowObject.fill;
  }
}

geometricOptics.register( 'ArrowImage', ArrowImage );
export default ArrowImage;