// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration for the different ray modes
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOptics from '../../geometricOptics.js';

// {Enumeration}
const LightRayMode = Enumeration.byKeys( [
  'NONE', // NONE implies that no rays are displayed.
  'MARGINAL', // MARGINAL show the rays at the top, center and bottom of the optic.
  'PRINCIPAL', // PRINCIPAL show the principal rays, according to the ray tracing method.
  'MANY' // MANY show a shower of rays.
] );

geometricOptics.register( 'LightRayMode', LightRayMode );
export default LightRayMode;
