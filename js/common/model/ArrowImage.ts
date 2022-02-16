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
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import GOQueryParameters from '../GOQueryParameters.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Utils from '../../../../dot/js/Utils.js';

class ArrowImage extends OpticalImage {

  readonly fill: ColorDef;
  readonly opacityProperty: IReadOnlyProperty<number>;

  /**
   * @param arrowObject - the optical object that this image is associated with
   * @param optic
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic,
               providedOptions: OpticalImageOptions ) {

    const options = merge( {}, providedOptions );

    super( arrowObject, optic, options );

    this.fill = arrowObject.fill;

    this.opacityProperty = new DerivedProperty( [ this.lightIntensityProperty ], ( lightIntensity: number ) =>
      Utils.linear( 0, 1, GOQueryParameters.arrowImageOpacityRange[ 0 ], GOQueryParameters.arrowImageOpacityRange[ 1 ], lightIntensity )
    );
  }
}

geometricOptics.register( 'ArrowImage', ArrowImage );
export default ArrowImage;