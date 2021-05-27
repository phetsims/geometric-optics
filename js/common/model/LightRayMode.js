// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration for the different ray Mode
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOptics from '../../geometricOptics.js';

const LightRayMode = Enumeration.byKeys( [
  'NO_RAYS', // NO_RAYS implies that no rays are displayed.
  'MARGINAL_RAYS', // MARGINAL_RAYS show the rays at the top, center and bottom of the optic.
  'PRINCIPAL_RAYS', // PRINCIPAL_RAYS show the principal rays, according to the ray tracing method.
  'MANY_RAYS' // MANY_RAYS show a shower of rays.
] );

geometricOptics.register( 'LightRayMode', LightRayMode );
export default LightRayMode;
