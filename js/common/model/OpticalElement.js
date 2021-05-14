// Copyright 2021, University of Colorado Boulder

/**
 * Abstract class of an optical element in the simulation.
 * An optical element is the base class for a lens or a mirror.
 * Responsibility include the radius of curvature, the diameter and the curvatureType
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Shape from '../../../../kite/js/Shape.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

import RangeWithValue from '../../../../dot/js/RangeWithValue.js';

class OpticalElement {

  /**
   *
   * @param {Vector2} position
   * @param {RangeWithValue} radiusOfCurvatureRange
   * @param {RangeWithValue} diameterRange
   * @param {OpticalElement.Curve} curve
   * @param {OpticalElement.Type} type
   * @param {Tandem} tandem
   */
  constructor( position, radiusOfCurvatureRange, diameterRange, curve, type, tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );
    assert && assert( position instanceof Vector2, 'invalid position' );
    assert && assert( radiusOfCurvatureRange instanceof RangeWithValue, 'invalied' );

    // @public {Property.<Vector2>} Position of the optical element
    this.positionProperty = new Vector2Property( position );

    // @public {Property.<number>} Radius of curvature of the optical element - The convention is positive as converging.
    this.radiusOfCurvatureProperty = new NumberProperty( radiusOfCurvatureRange.defaultValue, { range: radiusOfCurvatureRange } );

    // @public {Property.<number>} Height of the optical element - controls the optical aperture of the optical element
    this.diameterProperty = new NumberProperty( diameterRange.defaultValue, { range: diameterRange } );

    // @public {EnumerationProperty.<OpticalElement.Curve>} Type of Curvature of the optical element.
    this.curveProperty = new EnumerationProperty( OpticalElement.Curve, curve );

    // @public {OpticalElement.Type} Type of transmission of the optical element.
    this.type = type;

    // @public Shape of the optical element
    this.shape = new Shape();

    // @public
    this.focalLengthProperty = null;

    // @public (read-only)
    this.diameterRange = diameterRange;
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.diameterProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.curveProperty.reset();
  }

  /**
   * Returns a normalized value (with a max of 1) for the diameter
   * @param {number} diameter - diameter
   * @public
   * @returns {number}
   */
  getNormalizedDiameter( diameter ) {
    return diameter / this.diameterRange.max;
  }


  /**
   * Returns a boolean indicating if the optical element is a lens
   * @public
   * @returns {boolean}
   */
  isLens() {
    return this.type === OpticalElement.Type.LENS;
  }

  /**
   * Returns a boolean indicating if the optical element is a mirror
   * @public
   * @returns {boolean}
   */
  isMirror() {
    return !this.hasLens();
  }
}

OpticalElement.Type = Enumeration.byKeys( [
  'LENS', // lens
  'MIRROR' //mirror
] );

OpticalElement.Curve = Enumeration.byKeys( [
  'CONVEX',
  'CONCAVE'
] );

geometricOptics.register( 'OpticalElement', OpticalElement );
export default OpticalElement;
