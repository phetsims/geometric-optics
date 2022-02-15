// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensScreenView is the view for the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOScreenView from '../../common/view/GOScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Lens from '../model/Lens.js';
import LensNode from './LensNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DragLockedButton from '../../common/view/DragLockedButton.js';
import Optic from '../../common/model/Optic.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type LensScreenViewOptions = {
  tandem: Tandem
};

class LensScreenView extends GOScreenView {

  private readonly resetLensScreenView: () => void;

  /**
   * @param model
   * @param providedOptions
   */
  constructor( model: LensModel, providedOptions: LensScreenViewOptions ) {

    const options = merge( {

      // View origin is slightly above center of the layoutBounds.
      getViewOrigin: ( layoutBounds: Bounds2 ) => new Vector2( layoutBounds.centerX, layoutBounds.centerY - 35 ),

      // Creates the Node for the lens
      createOpticNode: ( optic: Optic, modelBoundsProperty: IReadOnlyProperty<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) => {
        assert && assert( optic instanceof Lens );
        return new LensNode( optic as Lens, modelBoundsProperty, modelViewTransform, {
          tandem: parentTandem.createTandem( 'lensNode' )
        } );
      },

      dragLockedProperty: new BooleanProperty( false, {
        tandem: providedOptions.tandem.createTandem( 'dragLockedProperty' ),
        phetioDocumentation: 'Controls dragging of the optical object(s).<br>' +
                             'true = may be dragged horizontally only<br>' +
                             'false = may be dragged horizontally and vertically'
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