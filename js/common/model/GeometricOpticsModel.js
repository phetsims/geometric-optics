// Copyright 2021, University of Colorado Boulder

/**
 * Common Model for geometric optics
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import Vector2 from '../../../../dot/js/Vector2.js';
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

class GeometricOpticsModel {

  /**
   * @param {Vector2} opticPosition - center of the optical element
   * @param {RangeWithValue} radiusOfCurvatureRange - range of radius of curvature (in centimeters)
   * @param {RangeWithValue} diameterRange - range of height for optical element (in centimeters)
   * @param {RangeWithValue} indexOfRefractionRange
   * @param {Optic.Curve} curve - initial curve of optical element
   * @param {Optic.Type} type - initial type of optical element
   */
  constructor( opticPosition, radiusOfCurvatureRange, diameterRange, indexOfRefractionRange, curve, type ) {

    assert && assert( opticPosition instanceof Vector2, 'invalid position' );
    assert && assert( radiusOfCurvatureRange instanceof RangeWithValue, 'invalid radiusOfCurvature' );
    assert && assert( diameterRange instanceof RangeWithValue, 'invalid diameterRange' );

    // @private {RangeWithValue} - time range (in seconds) for the animation
    this.timeRange = new RangeWithValue( 0, GeometricOpticsConstants.RAYS_ANIMATION_TIME, 0 );

    // @public (read-only) {Property.<number>} - time for ray animation in seconds.
    this.timeProperty = new NumberProperty( this.timeRange.defaultValue, { units: 's' } );

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
      horizontal: new Ruler( GeometricOpticsConstants.HORIZONTAL_RULER_INITIAL_POSITION,
        GeometricOpticsConstants.HORIZONTAL_RULER_LENGTH ),
      vertical: new Ruler( GeometricOpticsConstants.VERTICAL_RULER_INITIAL_POSITION,
        GeometricOpticsConstants.VERTICAL_RULER_LENGTH, {
          orientation: Ruler.Orientation.VERTICAL
        } )
    };

    // @public {Optic} - model of the optic
    this.optic = new Optic( opticPosition, radiusOfCurvatureRange, diameterRange, indexOfRefractionRange, curve, type );

    // @public {SourceObject} the object/ source
    this.sourceObject = new SourceObject( this.representationProperty );

    // @public {FocalPoint} focal point to the left of the optic
    this.leftFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, {
      multiplicativeFactor: -1
    } );

    // @public {FocalPoint} focal point to the right of the optic
    this.rightFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty );

    // @public {Target} model of the target/image associated with the first source
    this.firstTarget = new Target( this.sourceObject.firstPositionProperty, this.optic, this.representationProperty );

    // @public {Target} target/ image associated with the second source
    this.secondTarget = new Target( this.sourceObject.secondPositionProperty, this.optic, this.representationProperty );

    // @public {ProjectorScreen} model of the projector screen and spotlights
    this.projectorScreen = new ProjectorScreen(
      this.sourceObject.firstPositionProperty,
      this.sourceObject.secondPositionProperty,
      this.firstTarget.positionProperty,
      this.secondTarget.positionProperty,
      this.optic
    );

    // @public {LightRays} model of the light rays associated to the first source
    this.firstLightRays = new LightRays(
      this.timeProperty,
      this.lightRayModeProperty,
      this.representationProperty,
      this.sourceObject.firstPositionProperty,
      this.projectorScreen,
      this.optic,
      this.firstTarget
    );

    // @public {LightRays} model of the light rays associated with the second source
    this.secondLightRays = new LightRays(
      this.timeProperty,
      this.lightRayModeProperty,
      this.representationProperty,
      this.sourceObject.secondPositionProperty,
      this.projectorScreen,
      this.optic,
      this.secondTarget
    );
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