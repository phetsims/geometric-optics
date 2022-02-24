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
import Lens from '../model/Lens.js';
import LensNode from './LensNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DragLockedButton from '../../common/view/DragLockedButton.js';
import Optic from '../../common/model/Optic.js';
import { PickRequired } from '../../common/GOTypes.js';
import optionize from '../../../../phet-core/js/optionize.js';

type LensScreenViewOptions = PickRequired<GOScreenViewOptions, 'isBasicsVersion' | 'tandem'>;

class LensScreenView extends GOScreenView {

  // Resets things that are specific to this class.
  private readonly resetLensScreenView: () => void;

  /**
   * @param model
   * @param providedOptions
   */
  constructor( model: LensModel, providedOptions: LensScreenViewOptions ) {

    const options = optionize<LensScreenViewOptions, {}, GOScreenViewOptions,
      'getViewOrigin' | 'createOpticNode' | 'dragLockedProperty'>( {

      // View origin is slightly above center of the layoutBounds.
      getViewOrigin: ( layoutBounds: Bounds2 ) => new Vector2( layoutBounds.centerX, layoutBounds.centerY - 35 ),

      // Creates the Node for the lens
      createOpticNode: ( optic: Optic, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => {
        assert && assert( optic instanceof Lens );
        return new LensNode( optic as Lens, modelViewTransform, {
          tandem: parentTandem.createTandem( 'lensNode' )
        } );
      },

      dragLockedProperty: new BooleanProperty( false, {
        tandem: providedOptions.tandem.createTandem( 'dragLockedProperty' ),
        phetioDocumentation: 'Controls dragging of the optical object(s).' +
                             '<ul>' +
                             '<li>true: may be dragged horizontally only</li>' +
                             '<li>false = may be dragged horizontally and vertically</li>' +
                             '</ul>'
      } )
    }, providedOptions );

    super( model, options );

    // Toggle button to lock dragging to horizontal
    const dragLockedButton = new DragLockedButton( options.dragLockedProperty, {
      left: this.opticalObjectChoiceComboBox.right + 25,
      centerY: this.opticalObjectChoiceComboBox.centerY,
      tandem: this.controlsTandem.createTandem( 'dragLockedButton' )
    } );
    this.controlsLayer.addChild( dragLockedButton );

    // pdom -traversal order
    // Insert projectionScreenNode after zoomButtonGroup.
    const pdomOrder = this.screenViewRootNode.pdomOrder;
    assert && assert( pdomOrder ); // [] | null
    if ( pdomOrder ) {
      pdomOrder.splice( pdomOrder.indexOf( this.opticShapeRadioButtonGroup ), 0, dragLockedButton );
      this.screenViewRootNode.pdomOrder = pdomOrder;
    }

    this.resetLensScreenView = () => {
      options.dragLockedProperty.reset();
    };
  }

  public reset(): void {
    super.reset();
    this.resetLensScreenView();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;