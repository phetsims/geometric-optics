// Copyright 2021-2022, University of Colorado Boulder

/**
 * LensScreenView is the view for the 'Lens' screen.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import { KeyboardUtils, Node } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import GOScreenView, { GeometricOpticsScreenViewOptions } from '../../common/view/GOScreenView.js';
import geometricOptics from '../../geometricOptics.js';
import LensModel from '../model/LensModel.js';
import LightSpotNode from './LightSpotNode.js';
import ProjectionScreenNode from './ProjectionScreenNode.js';
import Representation from '../../common/model/Representation.js';
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Lens from '../model/Lens.js';
import LensNode from './LensNode.js';
import GuidesNode from './GuidesNode.js';
import GOColors from '../../common/GOColors.js';
import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import DragLockedButton from '../../common/view/DragLockedButton.js';

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
      getViewOrigin: ( layoutBounds: Bounds2 ) =>
        new Vector2( layoutBounds.centerX, layoutBounds.centerY - 0.08 * layoutBounds.height ),

      // Creates the Node for the lens
      createOpticNode: ( optic: Lens, modelBoundsProperty: Property<Bounds2>, modelViewTransform: ModelViewTransform2, parentTandem: Tandem ) =>
        new LensNode( optic, modelBoundsProperty, modelViewTransform, {
          tandem: parentTandem.createTandem( 'lensNode' )
        } ),

      // Hotkey J+L moves a ruler to the lens
      hotkeysMoveRulerToOptic: [ KeyboardUtils.KEY_J, KeyboardUtils.KEY_L ]

    }, providedOptions ) as GeometricOpticsScreenViewOptions;

    options.dragLockedProperty = new BooleanProperty( false, {
      tandem: options.tandem.createTandem( 'dragLockedProperty' ),
      phetioDocumentation: 'Controls dragging of the source object and light sources.<br>' +
                           'true = may be dragged horizontally only<br>' +
                           'false = may be dragged horizontally and vertically'
    } );

    super( model, options );

    const guides1Node = new GuidesNode( model.topGuide1, model.bottomGuide1,
      GOColors.guideArm1FillProperty, this.modelViewTransform, {
      visibleProperty: this.visibleProperties.guidesVisibleProperty,
      tandem: options.tandem.createTandem( 'guides1Node' ),
      phetioDocumentation: 'TODO'
    } );
    this.experimentAreaNode.addChild( guides1Node );

    const guides2Node = new GuidesNode( model.topGuide2, model.bottomGuide2,
      GOColors.guideArm2FillProperty, this.modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ this.visibleProperties.guidesVisibleProperty, this.visibleProperties.secondPointVisibleProperty ]
      ),
      tandem: options.tandem.createTandem( 'guides2Node' ),
      phetioDocumentation: 'TODO'
    } );
    this.experimentAreaNode.addChild( guides2Node );

    // Projection screen
    const projectionScreenNode = new ProjectionScreenNode(
      model.projectionScreen,
      model.optic.positionProperty,
      this.modelBoundsProperty,
      this.modelViewTransform, {
        tandem: options.tandem.createTandem( 'projectionScreenNode' )
      }
    );

    // LightSpot associated with the first source
    const lightSpot1Node = new LightSpotNode( model.lightSpot1, this.modelViewTransform, {
      visibleProperty: model.firstTarget.visibleProperty
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );

    // LightSpot associated with the second source
    const lightSpot2Node = new LightSpotNode( model.lightSpot2, this.modelViewTransform, {
      visibleProperty: DerivedProperty.and(
        [ model.secondTarget.visibleProperty, this.visibleProperties.secondPointVisibleProperty ] )
      // DO NOT instrument for PhET-iO, see https://github.com/phetsims/geometric-optics/issues/269
    } );

    // Add projection screen and light spots in front of the optical axis.
    const lightSourceNodes = new Node( {
      children: [ projectionScreenNode, lightSpot1Node, lightSpot2Node ],
      visibleProperty: new DerivedProperty( [ model.representationProperty ],
        ( representation: Representation ) => !representation.isObject )
    } );
    this.additionalNodesParent.addChild( lightSourceNodes );

    // Toggle button to lock dragging to horizontal
    const dragLockedButton = new DragLockedButton( options.dragLockedProperty, {
      left: this.representationComboBox.right + 25,
      centerY: this.representationComboBox.centerY,
      tandem: options.tandem.createTandem( 'dragLockedButton' )
    } );
    this.controlsLayer.addChild( dragLockedButton );

    // pdom -traversal order
    // Insert projectionScreenNode after zoomButtonGroup.
    const pdomOrder = this.screenViewRootNode.pdomOrder;
    assert && assert( pdomOrder ); // [] | null
    if ( pdomOrder ) {
      pdomOrder.splice( pdomOrder.indexOf( this.opticShapeRadioButtonGroup ), 0, dragLockedButton );
      pdomOrder.splice( pdomOrder.indexOf( this.zoomButtonGroup ), 0, projectionScreenNode );
      this.screenViewRootNode.pdomOrder = pdomOrder;
    }

    this.resetLensScreenView = () => {
      options.dragLockedProperty.reset();
      projectionScreenNode.reset();
    };
  }

  public reset(): void {
    super.reset();
    this.resetLensScreenView();
  }
}

geometricOptics.register( 'LensScreenView', LensScreenView );
export default LensScreenView;