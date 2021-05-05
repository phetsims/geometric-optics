// Copyright 2021, University of Colorado Boulder

/**
 * Model element of an optical element in the simulation.
 * An optical element is the base class for a lens and a mirror.
 * Responsibility include the radius of curvature, the diameter and the type.
 *
 * @author Martin Veillette
 */

import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector2Property from '../../../../dot/js/Vector2Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';
import GeometricOpticsConstants from '../GeometricOpticsConstants.js';
import CurvatureTypes from './CurvatureTypes.js';

const RADIUS_OF_CURVATURE_DEFAULT = GeometricOpticsConstants.RADIUS_OF_CURVATURE_RANGE.defaultValue;
const DIAMETER_DEFAULT = GeometricOpticsConstants.DIAMETER_RANGE.defaultValue;

class OpticalElement {

  /**
   * @param {Tandem} tandem
   */
  constructor( tandem ) {
    assert && assert( tandem instanceof Tandem, 'invalid tandem' );

    // @public {Property.<Vector2>} Position of the optical element
    this.positionProperty = new Vector2Property( Vector2.ZERO );

    // @public {Property.<number>} Radius of curvature of the optical element - The convention is positive as converging.
    this.radiusOfCurvatureProperty = new NumberProperty( RADIUS_OF_CURVATURE_DEFAULT, { range: GeometricOpticsConstants.RADIUS_OF_CURVATURE_RANGE } );

    // @public {Property.<number>} Height of the optical element - controls the optical aperture of the optical element
    this.diameterProperty = new NumberProperty( DIAMETER_DEFAULT, { range: GeometricOpticsConstants.DIAMETER_RANGE } );

    // @public {EnumerationProperty.<CurvatureTypes>} Type of Curvature of the optical element.
    this.curvatureTypeProperty = new EnumerationProperty( CurvatureTypes, CurvatureTypes.CONVERGING );
  }

  /**
   * Resets the model.
   * @public
   */
  reset() {
    this.positionProperty.reset();
    this.diameterProperty.reset();
    this.radiusOfCurvatureProperty.reset();
    this.curvatureTypeProperty.reset();
  }

}

geometricOptics.register( 'OpticalElement', OpticalElement );
export default OpticalElement;
