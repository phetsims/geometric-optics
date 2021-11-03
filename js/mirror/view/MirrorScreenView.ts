// Copyright 2021, University of Colorado Boulder

/**
 * MirrorScreenView is the view for the 'Mirror' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GeometricOpticsScreenView from '../../common/view/GeometricOpticsScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';

class MirrorScreenView extends GeometricOpticsScreenView {

  /**
   * @param {MirrorModel} model
   * @param {Object} [options]
   */
  constructor( model: MirrorModel, options?: any ) { //TODO-TS any

    options = merge( {

      // View origin is to right, and a little above center.
      getViewOrigin: ( layoutBounds: Bounds2 ) => new Vector2(
        layoutBounds.centerX + 200,
        layoutBounds.centerY - 0.08 * layoutBounds.height
      ),

      // phet-io options
      tandem: Tandem.REQUIRED
    }, options );

    super( model, options );
  }
}

geometricOptics.register( 'MirrorScreenView', MirrorScreenView );
export default MirrorScreenView;