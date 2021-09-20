// Copyright 2021, University of Colorado Boulder

/**
 * Common Model for geometric optics
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
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
   * @param {Optic.Type} type - initial type of optical element
   * @param {Optic.Curve} curve - initial curve of optical element
   * @param {Vector2} opticPosition - center of the optical element
   * @param {RangeWithValue} radiusOfCurvatureRange - range of radius of curvature (in centimeters)
   * @param {RangeWithValue} diameterRange - range of height for optical element (in centimeters)
   * @param {RangeWithValue} indexOfRefractionRange
   */
  constructor( type, curve, opticPosition, radiusOfCurvatureRange, diameterRange, indexOfRefractionRange ) {

    assert && assert( Optic.Type.includes( type ) );
    assert && assert( Optic.Curve.includes( curve ) );
    assert && assert( opticPosition instanceof Vector2 );
    assert && assert( radiusOfCurvatureRange instanceof RangeWithValue );
    assert && assert( diameterRange instanceof RangeWithValue );
    assert && assert( indexOfRefractionRange instanceof RangeWithValue );

    // @public {Property.<Representation>}  representation of the source/object
    //TODO for Mirror screen, Representation.LIGHT is not a valid value
    this.representationProperty = new EnumerationProperty( Representation, Representation.PENCIL );

    // @public {Optic} - model of the optic
    this.optic = new Optic( type, curve, opticPosition, radiusOfCurvatureRange, diameterRange, indexOfRefractionRange );

    // @public {FocalPoint} focal point to the left of the optic
    this.leftFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty, {
      multiplicativeFactor: -1
    } );

    // @public {FocalPoint} focal point to the right of the optic
    this.rightFocalPoint = new FocalPoint( this.optic.positionProperty, this.optic.focalLengthProperty );

    // @public {SourceObject} the object/ source
    this.sourceObject = new SourceObject( this.representationProperty );

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

    // @public (read-only) {Property.<number>} elapsed time of light rays animation
    this.lightRaysTimeProperty = new NumberProperty( 0, {
      units: 's',
      range: new Range( 0, GeometricOpticsConstants.RAYS_ANIMATION_TIME )
    } );

    // @public {Property.<LightRayMode>}  modes for the different kind of light rays
    this.lightRayModeProperty = new EnumerationProperty( LightRayMode, LightRayMode.MARGINAL );

    // reset the timer when changing light ray mode
    this.lightRayModeProperty.link( () => this.lightRaysTimeProperty.reset() );

    // @public {LightRays} model of the light rays associated to the first source
    this.firstLightRays = new LightRays(
      this.lightRaysTimeProperty,
      this.lightRayModeProperty,
      this.representationProperty,
      this.sourceObject.firstPositionProperty,
      this.projectorScreen,
      this.optic,
      this.firstTarget
    );

    // @public {LightRays} model of the light rays associated with the second source
    this.secondLightRays = new LightRays(
      this.lightRaysTimeProperty,
      this.lightRayModeProperty,
      this.representationProperty,
      this.sourceObject.secondPositionProperty,
      this.projectorScreen,
      this.optic,
      this.secondTarget
    );

    // @public
    this.horizontalRuler = new Ruler(
      Ruler.Orientation.HORIZONTAL,
      GeometricOpticsConstants.HORIZONTAL_RULER_INITIAL_POSITION,
      GeometricOpticsConstants.HORIZONTAL_RULER_LENGTH
    );
    this.verticalRuler = new Ruler(
      Ruler.Orientation.VERTICAL,
      GeometricOpticsConstants.VERTICAL_RULER_INITIAL_POSITION,
      GeometricOpticsConstants.VERTICAL_RULER_LENGTH
    );
  }

  /**
   * Resets the model
   * @public
   */
  reset() {
    this.representationProperty.reset();
    this.optic.reset();
    this.sourceObject.reset();
    this.lightRaysTimeProperty.reset();
    this.lightRayModeProperty.reset();
    this.projectorScreen.reset();
    this.horizontalRuler.reset();
    this.verticalRuler.reset();
  }

  /**
   * Steps the animation of light rays.
   * @public
   * @param {number} dt - time step, in seconds
   */
  stepLightRays( dt ) {
    const t = this.lightRaysTimeProperty.value + dt;
    if ( this.lightRaysTimeProperty.range.contains( t ) ) {
      this.lightRaysTimeProperty.value = t;
    }
  }
}

geometricOptics.register( 'GeometricOpticsModel', GeometricOpticsModel );
export default GeometricOpticsModel;