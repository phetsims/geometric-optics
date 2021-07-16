// Copyright 2021, University of Colorado Boulder

/**
 * Common Model for geometric optics
 *
 * @author Martin Veillette
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import ProjectorScreen from '../../lens/model/ProjectorScreen.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import FocalPoint from './FocalPoint.js';
import LightRayMode from './LightRayMode.js';
import LightRays from './LightRays.js';
import Representation from './Representation.js';
import Ruler from './Ruler.js';
import SourceObject from './SourceObject.js';
import TargetImage from './TargetImage.js';

const HORIZONTAL_RULER_LENGTH = GeometricOpticsConstants.HORIZONTAL_RULER_LENGTH;
const VERTICAL_RULER_LENGTH = GeometricOpticsConstants.VERTICAL_RULER_LENGTH;

class GeometricOpticsModel {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    this.timeRange = new RangeWithValue( 0, 5, 0.01 );

    this.timeProperty = new NumberProperty( this.timeRange.defaultValue );

    // @public {Property.<boolean>} the image/target can be seen if enabled
    this.enableImageProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} the image associated with movable target can be seen if enabled
    this.enableMovableImageProperty = new BooleanProperty( false );

    // @public {Property.<Representation>}  representation of the source/object
    this.representationProperty = new Property( Representation.PENCIL );

    // @public {Property.<LightRayMode>}  modes for the different kind of light rays
    this.lightRayModeProperty = new EnumerationProperty( LightRayMode, LightRayMode.MARGINAL_RAYS );

    // @public rulers for the simulations
    this.rulers = {
      horizontal: new Ruler( new Vector2( 200, 100 ), HORIZONTAL_RULER_LENGTH ),
      vertical: new Ruler( new Vector2( 100, 300 ), VERTICAL_RULER_LENGTH, { orientation: Ruler.Orientation.VERTICAL } )
    };

  }


  /**
   * Resets the model
   * @public
   */
  reset() {
    this.representationProperty.reset();
    this.lightRayModeProperty.reset();
    this.sourceObject.reset();
    this.rulers.vertical.reset();
    this.rulers.horizontal.reset();
    this.timeProperty.reset();
    this.enableImageProperty.reset();
    this.enableMovableImageProperty.reset();
    this.projectorScreen.reset();
  }


  /**
   * @public
   * @param {number} dt
   */
  incrementTimer( dt ) {
    if ( this.timeRange.contains( this.timeProperty.value ) ) {
      this.timeProperty.value = this.timeProperty.value + dt;
    }

  }

  /**
   * @protected
   * @param {Optic} optic
   * @param {Tandem} tandem
   */
  createCommonComponents( optic, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {SourceObject} the object/ source
    this.sourceObject = new SourceObject( optic.positionProperty, this.representationProperty, tandem );

    // @public {FocalPoint} first principal focal point
    this.firstFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem );

    // @public {FocalPoint} second principal focal point
    this.secondFocalPoint = new FocalPoint( optic.positionProperty, optic.focalLengthProperty, tandem, { multiplicativeFactor: -1 } );

    // @public {TargetImage} target/ image
    this.targetImage = new TargetImage( this.sourceObject.positionProperty, optic, tandem );

    // @public {TargetImage} movable target/ image
    this.movableTargetImage = new TargetImage( this.sourceObject.movablePositionProperty, optic, tandem );

    // @public {ProjectorScreen}
    this.projectorScreen = new ProjectorScreen(
      optic.positionProperty,
      optic.diameterProperty,
      this.targetImage.positionProperty,
      this.movableTargetImage.positionProperty, tandem );

    // @public {LightRays} model of the light rays
    this.lightRays = new LightRays( this.timeProperty,
      this.lightRayModeProperty,
      this.enableImageProperty,
      this.representationProperty,
      this.sourceObject.positionProperty,
      this.projectorScreen,
      optic,
      this.targetImage,
      tandem );

    // @public {LightRays} model of the "movable" light rays
    this.movableLightRays = new LightRays( this.timeProperty,
      this.lightRayModeProperty,
      this.enableMovableImageProperty,
      this.representationProperty,
      this.sourceObject.movablePositionProperty,
      this.projectorScreen,
      optic,
      this.movableTargetImage,
      tandem );
  }
}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;
