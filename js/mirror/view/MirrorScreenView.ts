// Copyright 2021-2022, University of Colorado Boulder

/**
 * MirrorScreenView is the view for the 'Mirror' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOScreenView from '../../common/view/GOScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Mirror from '../model/Mirror.js';
import MirrorNode from './MirrorNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Optic from '../../common/model/Optic.js';

type MirrorScreenViewOptions = {
  tandem: Tandem
};

class MirrorScreenView extends GOScreenView {

  /**
   * @param model
   * @param providedOptions
   */
  constructor( model: MirrorModel, providedOptions: MirrorScreenViewOptions ) {

    const options = merge( {

      // View origin is to right, and a little above center.
      getViewOrigin: ( layoutBounds: Bounds2 ) => new Vector2( layoutBounds.centerX + 200, layoutBounds.centerY - 35 ),

      // Creates the Node for the mirror
      createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => {
        assert && assert( optic instanceof Mirror );
        return new MirrorNode( optic as Mirror, modelBoundsProperty, modelViewTransform, {
          tandem: parentTandem.createTandem( 'mirrorNode' )
        } );
      },

      // See https://github.com/phetsims/geometric-optics/issues/288
      dragLockedProperty: new BooleanProperty( true, {
        validValues: [ true ],
        //TOO uninstrument because Studio lets you set this to false?
        tandem: providedOptions.tandem.createTandem( 'dragLockedProperty' ),
        phetioDocumentation: 'Mirror screen supports horizontal dragging only.'
      } )
    }, providedOptions );

    super( model, options );
  }
}

geometricOptics.register( 'MirrorScreenView', MirrorScreenView );
export default MirrorScreenView;