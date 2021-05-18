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

class GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {SourceObject} the object/ source
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
    // @public {FocalPoint} first principal focal point
    this.firstFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem );

    // @public {FocalPoint} second principal focal point
    this.secondFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem, { multiplicativeFactor: -1 } );

    // @public {TargetImage} target/ image
    this.targetImage = new TargetImage( this.sourceObject, optic, tandem );

    // @public {LightRays} model of the light rays
    this.lightRays = new LightRays( this.sourceObject.positionProperty, optic, this.targetImage, tandem );

  }

}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;
