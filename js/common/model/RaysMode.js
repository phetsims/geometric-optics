// Copyright 2021, University of Colorado Boulder

/**
 * RaysMode is the enumeration for the different representations of rays, as set by the 'Rays' radio button group.
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOptics from '../../geometricOptics.js';

// {Enumeration}
const RaysMode = Enumeration.byKeys( [
  'MARGINAL', // MARGINAL shows the rays at the top, center, and bottom of the optic.
  'PRINCIPAL', // PRINCIPAL shows the principal rays, according to the ray tracing method.
  'MANY', // MANY shows a shower of rays.
  'NONE' // NONE shows no rays.
] );

geometricOptics.register( 'RaysMode', RaysMode );
export default RaysMode;