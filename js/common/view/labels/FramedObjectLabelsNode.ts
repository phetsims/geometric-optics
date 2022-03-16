// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObjectLabelsNode labels things in the 'Framed Object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import geometricOptics from '../../../geometricOptics.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import GOLabelsNode, { GOSceneLabelsNodeOptions } from './GOLabelsNode.js';
import OpticalObjectLabelNode from './OpticalObjectLabelNode.js';
import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import OpticalImageLabelNode from './OpticalImageLabelNode.js';
import FramedObjectSceneNode from '../FramedObjectSceneNode.js';

class FramedObjectLabelsNode extends GOLabelsNode {

  /**
   * @param sceneNode
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param providedOptions
   */
  constructor( sceneNode: FramedObjectSceneNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: GOSceneLabelsNodeOptions ) {

    super( sceneNode, zoomTransformProperty, modelVisibleBoundsProperty, providedOptions );

    const scene = sceneNode.scene;

    const isNumberedProperty = new BooleanProperty( false, {
      validValues: [ false ]
    } );

    // Object label ------------------------------------------------------------------------------------

    const objectLabelPositionProperty = new DerivedProperty(
      [ scene.framedObject.boundsProperty ],
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const objectLabel = new OpticalObjectLabelNode( scene.framedObject.opticalObjectNumber,
      objectLabelPositionProperty, zoomTransformProperty, {
        isNumberedProperty: isNumberedProperty,
        visibleProperty: sceneNode.framedObjectNodeVisibleProperty
      } );
    this.addChild( objectLabel );

    // Image label ------------------------------------------------------------------------------------

    const imageLabelPositionProperty = new DerivedProperty(
      [ scene.framedImage1.boundsProperty ],
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const imageLabel = new OpticalImageLabelNode( scene.framedImage1, imageLabelPositionProperty, zoomTransformProperty, {
      isNumberedProperty: isNumberedProperty,
      visibleProperty: sceneNode.framedImageNodeVisibleProperty
    } );
    this.addChild( imageLabel );
  }
}

geometricOptics.register( 'FramedObjectLabelsNode', FramedObjectLabelsNode );
export default FramedObjectLabelsNode;