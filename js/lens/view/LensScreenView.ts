// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensScreenView is the view for the 'Lens' screen.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOScreenView, { GOScreenViewOptions } from '../../common/view/GOScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import LensNode from './LensNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

type SelfOptions = EmptySelfOptions;

type LensScreenViewOptions = SelfOptions & PickRequired<GOScreenViewOptions, 'isBasicsVersion' | 'tandem'>;

export default class LensScreenView extends GOScreenView {

  public constructor( model: LensModel, providedOptions: LensScreenViewOptions ) {

    const options = optionize<LensScreenViewOptions, SelfOptions, GOScreenViewOptions>()( {

      // GOScreenViewOptions

      // View origin is slightly above center of the layoutBounds.
      getViewOrigin: ( layoutBounds: Bounds2 ) => new Vector2( layoutBounds.centerX, layoutBounds.centerY - 35 ),

      // Creates the Node for the lens
      createOpticNode: ( modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => {
        return new LensNode( model.lens, modelViewTransform, {
          tandem: parentTandem.createTandem( 'lensNode' )
        } );
      }
    }, providedOptions );

    super( model, options );
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );