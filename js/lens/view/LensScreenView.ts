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
import { KeyboardUtils } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOScreenView, { GeometricOpticsScreenViewOptions } from '../../common/view/GOScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Lens from '../model/Lens.js';
import LensNode from './LensNode.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DragLockedButton from '../../common/view/DragLockedButton.js';
import LightSourcesSceneNode from './LightSourcesSceneNode.js';
import OpticalObjectChoice from '../../common/model/OpticalObjectChoice.js';
import { RaysType } from '../../common/model/RaysType.js';
import LightSourcesSceneLabelsNode from './LightSourcesSceneLabelsNode.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';

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
      createOpticNode: ( optic: Lens, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) =>
        new LensNode( optic, modelBoundsProperty, modelViewTransform, {
          tandem: parentTandem.createTandem( 'lensNode' )
        } ),

      // Hotkey J+L moves a ruler to the lens
      hotkeysMoveRulerToOptic: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_L ]

    }, providedOptions ) as GeometricOpticsScreenViewOptions; //TODO don't use 'as'

    options.dragLockedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'dragLockedProperty' ),
      phetioDocumentation: 'Controls dragging of the optical object(s).<br>' +
                           'true = may be dragged horizontally only<br>' +
                           'false = may be dragged horizontally and vertically'
    } );

    super( model, options );

    // Toggle button to lock dragging to horizontal
    const dragLockedButton = new DragLockedButton( options.dragLockedProperty, {
      left: this.representationComboBox.right + 25,
      centerY: this.representationComboBox.centerY,
      tandem: this.controlsTandem.createTandem( 'dragLockedButton' )
    } );
    this.controlsLayer.addChild( dragLockedButton );

    const lightSourcesSceneNode = new LightSourcesSceneNode( model.lightSourcesScene, this.visibleProperties,
      this.modelViewTransform, this.modelVisibleBoundsProperty, this.modelBoundsProperty, model.raysTypeProperty, {
        createOpticNode: options.createOpticNode,
        dragLockedProperty: options.dragLockedProperty,
        tandem: this.scenesTandem.createTandem( 'lightSourcesSceneNode' )
      } );
    this.scenesNode.addChild( lightSourcesSceneNode );

    const lightSourcesSceneLabelsNode = new LightSourcesSceneLabelsNode( model.lightSourcesScene, this.visibleProperties,
      this.zoomTransformProperty, this.modelVisibleBoundsProperty, {
        visibleProperty: DerivedProperty.and( [ this.visibleProperties.labelsVisibleProperty,
          lightSourcesSceneNode.visibleProperty ] )
      } );
    this.labelsLayer.addChild( lightSourcesSceneLabelsNode );

    model.opticalObjectChoiceProperty.link( opticalObjectChoice => {
      lightSourcesSceneNode.visible = OpticalObjectChoice.isLightSource( opticalObjectChoice );
      if ( lightSourcesSceneNode.visible ) {
        this.horizontalRulerNode.setHotkeysData( lightSourcesSceneNode.rulerHotkeysData );
        this.verticalRulerNode.setHotkeysData( lightSourcesSceneNode.rulerHotkeysData );
      }
    } );

    // pdom -traversal order
    // Insert projectionScreenNode after zoomButtonGroup.
    const pdomOrder = this.screenViewRootNode.pdomOrder;
    assert && assert( pdomOrder ); // [] | null
    if ( pdomOrder ) {
      pdomOrder.splice( pdomOrder.indexOf( this.opticShapeRadioButtonGroup ), 0, dragLockedButton );
      this.screenViewRootNode.pdomOrder = pdomOrder;
    }

    //TODO this is duplicated in GOScreenView for framedObjectScene
    // Changing any of these Properties causes the light rays to animate.
    Property.multilink(
      [ model.raysTypeProperty, this.visibleProperties.raysAndImagesVisibleProperty ],
      ( raysType: RaysType, raysAndImagesVisible: boolean ) =>
        model.lightSourcesScene.lightRaysAnimationTimeProperty.reset() );

    this.resetLensScreenView = () => {
      options.dragLockedProperty.reset();
      lightSourcesSceneNode.reset();
    };
  }

  public reset(): void {
    super.reset();
    this.resetLensScreenView();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;