// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration for the different curvature types of optical elements
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOptics from '../../geometricOptics.js';

const CurvatureTypes = Enumeration.byKeys( [
  'CONVEX',
  'CONCAVE'
] );

geometricOptics.register( 'CurvatureTypes', CurvatureTypes );
export default CurvatureTypes;
