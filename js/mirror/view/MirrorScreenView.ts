// Copyright 2021-2022, University of Colorado Boulder

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
import GOScreenView, { GeometricOpticsScreenViewOptions } from '../../common/view/GOScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Mirror from '../model/Mirror.js';
import MirrorNode from './MirrorNode.js';
import { KeyboardUtils } from '../../../../scenery/js/imports.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';

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
      getViewOrigin: ( layoutBounds: Bounds2 ) => new Vector2(
        layoutBounds.centerX + 200,
        layoutBounds.centerY - 0.08 * layoutBounds.height
      ),

      // Creates the Node for the mirror
      createOpticNode: ( optic: Mirror, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) =>
        new MirrorNode( optic, modelBoundsProperty, modelViewTransform, {
          tandem: parentTandem.createTandem( 'mirrorNode' )
        } ),

      // Hotkey J+M moves a ruler to the lens
      hotkeysMoveRulerToOptic: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_M ],

      // Mirror screen support horizontal dragging only, see https://github.com/phetsims/geometric-optics/issues/288
      dragLockedProperty: new BooleanProperty( true, {
        validValues: [ true ]
      } )

    }, providedOptions ) as GeometricOpticsScreenViewOptions; //TODO don't use 'as'

    super( model, options );
  }
}

geometricOptics.register( 'MirrorScreenView', MirrorScreenView );
export default MirrorScreenView;