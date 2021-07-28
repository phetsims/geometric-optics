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
import Optic from './Optic.js';
import Representation from './Representation.js';
import Ruler from './Ruler.js';
import SourceObject from './SourceObject.js';
import Target from './Target.js';

const HORIZONTAL_RULER_LENGTH = GeometricOpticsConstants.HORIZONTAL_RULER_LENGTH;
const HORIZONTAL_RULER_INITIAL_POSITION = GeometricOpticsConstants.HORIZONTAL_RULER_INITIAL_POSITION;
const VERTICAL_RULER_LENGTH = GeometricOpticsConstants.VERTICAL_RULER_LENGTH;
const VERTICAL_RULER_INITIAL_POSITION = GeometricOpticsConstants.VERTICAL_RULER_INITIAL_POSITION;
const ANIMATION_TIME = GeometricOpticsConstants.ANIMATION_TIME;

class GeometricOpticsModel {

  /**
   *
   * @param {Vector2} opticPosition - center of the optical element
   * @param {RangeWithValue} radiusOfCurvatureRange - range of radius of curvature (in centimeters)
   * @param {RangeWithValue} diameterRange - range of height for optical element (in centimeters)
   * @param {RangeWithValue} indexOfRefractionRange
   * @param {Optic.Curve} curve - initial curve of optical element - acceptable values (CONVEX and CONCAVE)
   * @param {Optic.Type} type - initial type of optical element - acceptable values (MIRROR and LENS)
   * @param {Tandem} tandem
   */
  constructor( opticPosition,
               radiusOfCurvatureRange,
               diameterRange,
               indexOfRefractionRange,
               curve,
               type,
               tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    assert && assert( opticPosition instanceof Vector2, 'invalid position' );
    assert && assert( radiusOfCurvatureRange instanceof RangeWithValue, 'invalid radiusOfCurvature' );
    assert && assert( diameterRange instanceof RangeWithValue, 'invalid diameterRange' );

    // @private {RangeWithValue} - time range (in seconds) for the animation
    this.timeRange = new RangeWithValue( 0, ANIMATION_TIME, 0 );

    // @public (read-only) {Property.<number>} - time for ray animation
    this.timeProperty = new NumberProperty( this.timeRange.defaultValue );

    // @public {Property.<boolean>} the image/target can be seen if enabled
    this.enableFirstTargetProperty = new BooleanProperty( false );

    // @public {Property.<boolean>} the image associated with second source can be seen if enabled
    this.enableSecondTargetProperty = new BooleanProperty( false );

    // @public {Property.<Representation>}  representation of the source/object
    this.representationProperty = new Property( Representation.PENCIL );

    // @public {Property.<LightRayMode>}  modes for the different kind of light rays
    this.lightRayModeProperty = new EnumerationProperty( LightRayMode, LightRayMode.MARGINAL );

    // reset the timer when changing light ray mode
    this.lightRayModeProperty.link( () => {
      this.timeProperty.reset();
    } );

    // @public {Object} rulers for the simulations
    this.rulers = {
      horizontal: new Ruler( HORIZONTAL_RULER_INITIAL_POSITION, HORIZONTAL_RULER_LENGTH ),
      vertical: new Ruler( VERTICAL_RULER_INITIAL_POSITION, VERTICAL_RULER_LENGTH, { orientation: Ruler.Orientation.VERTICAL } )
    };

    // @public {Optic} - model of the optic
    this.optic = new Optic( opticPosition,
      radiusOfCurvatureRange,
      diameterRange,
      indexOfRefractionRange,
      curve,
      type,
      tandem );

    // @public {SourceObject} the object/ source
    this.sourceObject = new SourceObject( this.optic.positionProperty, this.representationProperty, tandem );

    // @public {FocalPoint} first principal focal point
    this.firstFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, tandem );

    // @public {FocalPoint} second principal focal point
    this.secondFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, tandem, { multiplicativeFactor: -1 } );

    // @public {Target} model of the target/image associated with the first source
    this.firstTarget = new Target( this.sourceObject.firstPositionProperty, this.optic, this.representationProperty, tandem );

    // @public {Target} target/ image associated with the second source
    this.secondTarget = new Target( this.sourceObject.secondPositionProperty, this.optic, this.representationProperty, tandem );

    // @public {ProjectorScreen} model of the projector screen and spotlights
    this.projectorScreen = new ProjectorScreen(
      this.sourceObject.firstPositionProperty,
      this.sourceObject.secondPositionProperty,
      this.firstTarget.positionProperty,
      this.secondTarget.positionProperty, this.optic, tandem );

    // @public {LightRays} model of the light rays associated to the first source
    this.firstLightRays = new LightRays( this.timeProperty,
      this.lightRayModeProperty,
      this.enableFirstTargetProperty,
      this.representationProperty,
      this.sourceObject.firstPositionProperty,
      this.projectorScreen,
      this.optic,
      this.firstTarget,
      tandem );

    // @public {LightRays} model of the light rays associated with the second source
    this.secondLightRays = new LightRays( this.timeProperty,
      this.lightRayModeProperty,
      this.enableSecondTargetProperty,
      this.representationProperty,
      this.sourceObject.secondPositionProperty,
      this.projectorScreen,
      this.optic,
      this.secondTarget,
      tandem );

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
    this.optic.reset();
  }

  /**
   * Stepper with time interval dt
   * @public
   * @param {number} dt
   */
  incrementTimer( dt ) {
    if ( this.timeRange.contains( this.timeProperty.value ) ) {
      this.timeProperty.value = this.timeProperty.value + dt;
    }
  }
}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;
