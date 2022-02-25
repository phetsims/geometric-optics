// Copyright 2021-2022, University of Colorado Boulder

/**
 * MirrorScreenView is the view for the 'Mirror' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOScreenView, { GOScreenViewOptions } from '../../common/view/GOScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import MirrorModel from '../model/MirrorModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Mirror from '../model/Mirror.js';
import MirrorNode from './MirrorNode.js';
import Optic from '../../common/model/Optic.js';
import optionize from '../../../../phet-core/js/optionize.js';
import OpticalObjectChoice from '../../common/model/OpticalObjectChoice.js';
import { PickRequired } from '../../common/PickRequired.js';

type MirrorScreenViewOptions = PickRequired<GOScreenViewOptions, 'isBasicsVersion' | 'tandem'>;

class MirrorScreenView extends GOScreenView {

  /**
   * @param model
   * @param providedOptions
   */
  constructor( model: MirrorModel, providedOptions: MirrorScreenViewOptions ) {

    const options = optionize<MirrorScreenViewOptions, {}, GOScreenViewOptions,
      'getViewOrigin' | 'createOpticNode'>( {

      // View origin is to right, and a little above center.
      getViewOrigin: providedOptions.isBasicsVersion ?
                     ( layoutBounds: Bounds2 ) => new Vector2( layoutBounds.centerX, layoutBounds.centerY - 35 ) :
                     ( layoutBounds: Bounds2 ) => new Vector2( layoutBounds.centerX + 200, layoutBounds.centerY - 35 ),

      // Creates the Node for the mirror
      createOpticNode: ( optic: Optic, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => {
        assert && assert( optic instanceof Mirror );
        return new MirrorNode( optic as Mirror, modelViewTransform, {
          tandem: parentTandem.createTandem( 'mirrorNode' )
        } );
      }
    }, providedOptions );

    super( model, options );

    // Enable the drag-locked button only for Arrow object choice. Change the state of dragLockedProperty to indicate
    // that non-Arrow objects are drag-locked.
    if ( !options.isBasicsVersion ) {
      model.opticalObjectChoiceProperty.link( ( opticalObjectChoice: OpticalObjectChoice ) => {
        const isArrowObject = OpticalObjectChoice.isArrowObject( opticalObjectChoice );
        this.dragLockedProperty.value = !isArrowObject;
        this.dragLockedButton.enabled = isArrowObject;
      } );
    }
  }
}

geometricOptics.register( 'MirrorScreenView', MirrorScreenView );
export default MirrorScreenView;