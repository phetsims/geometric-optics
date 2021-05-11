// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration for the different transmission types of optical elements
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOptics from '../../geometricOptics.js';

const TransmissionTypes = Enumeration.byKeys( [
  'TRANSMITTED', // lens
  'REFLECTED' //mirror
] );

geometricOptics.register( 'TransmissionTypes', TransmissionTypes );
export default TransmissionTypes;
