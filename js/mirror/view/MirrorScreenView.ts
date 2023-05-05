// Copyright 2021-2023, University of Colorado Boulder

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
import MirrorNode from './MirrorNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import OpticalObjectChoice from '../../common/model/OpticalObjectChoice.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type MirrorScreenViewOptions = SelfOptions & PickRequired<GOScreenViewOptions, 'isBasicsVersion' | 'tandem' >;

export default class MirrorScreenView extends GOScreenView {

  public constructor( model: MirrorModel, providedOptions: MirrorScreenViewOptions ) {

    const options = optionize<MirrorScreenViewOptions, SelfOptions, GOScreenViewOptions>()( {
      // GOScreenViewOptions

      // In the Basics version of the sim, we only have a flat mirror, so all objects can be dragged freely.
      // In the full version of the sim, all non-Arrow objects are drag locked.
      objectDragMode: providedOptions.isBasicsVersion ?
                      'freeDragging' :
                      ( model.opticalObjectChoiceProperty.value.type === 'arrow' ) ?
                      'freeDragging' : 'horizontalDragging',

      // Basics version has the origin in the center, full version has the origin shifted to the right.
      // Slightly above center of the layoutBounds in both versions.
      getViewOrigin: providedOptions.isBasicsVersion ?
                     ( layoutBounds: Bounds2 ) => new Vector2( layoutBounds.centerX, layoutBounds.centerY - 35 ) :
                     ( layoutBounds: Bounds2 ) => new Vector2( layoutBounds.centerX + 100, layoutBounds.centerY - 35 ),

      // Creates the Node for the mirror
      createOpticNode: ( modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => {
        return new MirrorNode( model.mirror, modelViewTransform, {
          tandem: parentTandem.createTandem( 'mirrorNode' )
        } );
      }
    }, providedOptions );

    super( model, options );

    // In the full version of the sim, the toggle button is enabled only for the Arrow object choice, so that the user
    // can change drag modes. Other objects are constrained to 'horizontalDragging', and the button is disabled.
    // In the Basics version, we only have a flat mirror, so the toggle button is enabled for all object choices.
    if ( !options.isBasicsVersion ) {
      model.opticalObjectChoiceProperty.link( ( opticalObjectChoice: OpticalObjectChoice ) => {
        const isArrowObject = ( opticalObjectChoice.type === 'arrow' );
        this.objectDragModeToggleButton.enabled = isArrowObject;
        this.objectDragModeProperty.value = isArrowObject ? 'freeDragging' : 'horizontalDragging';
      } );
    }
  }
}

geometricOptics.register( 'MirrorScreenView', MirrorScreenView );