// Copyright 2021, University of Colorado Boulder

/**
 * Model element for the guides at both ends of the lens
 *
 * @author Sarah Chang, Swarthmore College
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOptics from '../../geometricOptics.js';

class Guide {
  constructor( objectPositionProperty, optic, config ) {
    config = merge( {
      location: Guide.Location.TOP
    }, config );

    // @public {Property.<Vector2>}
    this.fulcrumPositionProperty = new DerivedProperty( [ optic.positionProperty, optic.diameterProperty ],
      ( opticPosition, opticDiameter ) => {
        const sign = ( config.location === Guide.Location.TOP ) ? +1 : -1;

        return opticPosition.plusXY( 0, sign * opticDiameter / 2 );
      } );

  }
}

Guide.Location = Enumeration.byKeys( [ 'TOP', 'BOTTOM' ] );

geometricOptics.register( 'Guide', Guide );
export default Guide;
