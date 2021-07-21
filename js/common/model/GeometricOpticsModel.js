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

    // @private - time range (in seconds) for the animation
    this.timeRange = new RangeWithValue( 0, 5, 0.01 );

    // @public (read-only) {Property.<number>}
    this.timeProperty = new NumberProperty( this.timeRange.defaultValue );

    // @public {Property.<boolean>} the image/target can be seen if enabled
    this.enableFirstTargetProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} the image associated with second source can be seen if enabled
    this.enableSecondTargetProperty = new BooleanProperty( false );

    // @public {Property.<Representation>}  representation of the source/object
    this.representationProperty = new Property( Representation.PENCIL );

    // @public {Property.<LightRayMode>}  modes for the different kind of light rays
    this.lightRayModeProperty = new EnumerationProperty( LightRayMode, LightRayMode.MARGINAL_RAYS );

    // reset the timer when changing light ray mode
    this.lightRayModeProperty.link( () => {
      this.timeProperty.reset();
    } );

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
    this.enableFirstTargetProperty.reset();
    this.enableSecondTargetProperty.reset();
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
    this.firstTargetImage = new TargetImage( this.sourceObject.firstPositionProperty, optic, tandem );

    // @public {TargetImage} target/ image associated with the second source
    this.secondTargetImage = new TargetImage( this.sourceObject.secondPositionProperty, optic, tandem );

    // @public {ProjectorScreen}
    this.projectorScreen = new ProjectorScreen(
      optic.positionProperty,
      optic.diameterProperty,
      this.firstTargetImage.positionProperty,
      this.secondTargetImage.positionProperty, tandem );

    // @public {LightRays} model of the light rays associated to the first source
    this.firstLightRays = new LightRays( this.timeProperty,
      this.lightRayModeProperty,
      this.enableFirstTargetProperty,
      this.representationProperty,
      this.sourceObject.firstPositionProperty,
      this.projectorScreen,
      optic,
      this.firstTargetImage,
      tandem );

    // @public {LightRays} model of the light rays associated with the second source
    this.secondLightRays = new LightRays( this.timeProperty,
      this.lightRayModeProperty,
      this.enableSecondTargetProperty,
      this.representationProperty,
      this.sourceObject.secondPositionProperty,
      this.projectorScreen,
      optic,
      this.secondTargetImage,
      tandem );
  }
}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;
