// Copyright 2021, University of Colorado Boulder

/**
 * Common Model for geometric optics
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import FocalPoint from './FocalPoint.js';
import LightRays from './LightRays.js';
import SourceObject from './SourceObject.js';
import Representation from './Representation.js';
import TargetImage from './TargetImage.js';
import LightRayMode from './LightRayMode.js';
import Property from '../../../../axon/js/Property.js';
import Ruler from './Ruler.js';
import Vector2 from '../../../../dot/js/Vector2.js';

class GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {EnumerationProperty.<Representation>}  representation of the source/object
    this.representationProperty = new Property( Representation.PENCIL );

    // @public {EnumerationProperty.<LightRayMode>}  modes for the different kind of light rays
    this.lightRayModeProperty = new EnumerationProperty( LightRayMode, LightRayMode.NO_RAYS );

    // @public {SourceObject} the object/ source
    this.sourceObject = new SourceObject( this.representationProperty, tandem );

    this.horizontalRuler = new Ruler( new Vector2( 1, 1 ), 1, { orientation: 'horizontal' } );
    this.verticalRuler = new Ruler( new Vector2( 0, 0 ), 1, { orientation: 'vertical' } );

  }


  /**
   * Resets the model
   * @public
   */
  reset() {
    this.representationProperty.reset();
    this.lightRayModeProperty.reset();
    this.sourceObject.reset();
    this.verticalRuler.reset();
    this.horizontalRuler.reset();
  }

  /**
   * @protected
   * @param {Optic} optic
   * @param {Tandem} tandem
   */
  createCommonComponents( optic, tandem ) {
    // @public {FocalPoint} first principal focal point
    this.firstFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem );

    // @public {FocalPoint} second principal focal point
    this.secondFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem, { multiplicativeFactor: -1 } );

    // @public {TargetImage} target/ image
    this.targetImage = new TargetImage( this.sourceObject.positionProperty, optic, tandem );

    // @public {TargetImage} movable target/ image
    this.movableTargetImage = new TargetImage( this.sourceObject.movablePositionProperty, optic, tandem );

    // @public {LightRays} model of the light rays
    this.lightRays = new LightRays( this.lightRayModeProperty, this.sourceObject.positionProperty, optic, this.targetImage, tandem );

    // @public {LightRays} model of the "movable" light rays
    this.movableLightRays = new LightRays( this.lightRayModeProperty, this.sourceObject.movablePositionProperty, optic, this.movableTargetImage, tandem );
  }


}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;
