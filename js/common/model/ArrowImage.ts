// Copyright 2022-2025, University of Colorado Boulder

/**
 * ArrowImage is the model of the optical image associated with an arrow object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import TColor from '../../../../scenery/js/util/TColor.js';
import geometricOptics from '../../geometricOptics.js';
import ArrowObject from './ArrowObject.js';
import Optic from './Optic.js';
import OpticalImage from './OpticalImage.js';

type ArrowImageOptions = PickRequired<OpticalImage, 'tandem' | 'phetioDocumentation'>;

export default class ArrowImage extends OpticalImage {

  // fill for the arrow image
  public readonly fill: TColor;

  /**
   * @param arrowObject - the optical object that this image is associated with
   * @param optic - the optic is responsible for forming the optical image
   * @param providedOptions
   */
  public constructor( arrowObject: ArrowObject, optic: Optic, providedOptions: ArrowImageOptions ) {

    super( arrowObject, optic, providedOptions );

    this.fill = arrowObject.fill;
  }
}

geometricOptics.register( 'ArrowImage', ArrowImage );