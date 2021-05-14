// Copyright 2021, University of Colorado Boulder

/**
 * Common Model for geometric optics
 *
 * @author Martin Veillette
 */

import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import FocalPoint from './FocalPoint.js';
import LightRays from './LightRays.js';
import SourceObject from './SourceObject.js';
import TargetImage from './TargetImage.js';

class CommonModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public
    this.sourceObject = new SourceObject( tandem );

  }


  /**
   * Resets the model
   * @public
   */
  reset() {
    this.sourceObject.reset();
  }

  /**
   * @protected
   * @param {Optic} optic
   * @param {tandem} tandem
   */
  createCommonComponents( optic, tandem ) {
    // @public
    this.firstFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem );

    // @public
    this.secondFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem, { multiplicativeFactor: -1 } );

    // @public
    this.targetImage = new TargetImage( this.sourceObject, optic, tandem );

    // @public
    this.lightRays = new LightRays( this.sourceObject.positionProperty, optic, this.targetImage, tandem );


  }

}

geometricOptics.register( 'CommonModel', CommonModel );
export default CommonModel;
