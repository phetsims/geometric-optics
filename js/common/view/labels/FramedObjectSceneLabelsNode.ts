// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObjectSceneLabelsNode labels things in the 'framed object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import geometricOptics from '../../../geometricOptics.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import FramedObjectScene from '../../model/FramedObjectScene.js';
import IProperty from '../../../../../axon/js/IProperty.js';
import GOSceneLabelsNode, { GOSceneLabelsNodeOptions } from './GOSceneLabelsNode.js';
import OpticalObjectLabelNode from './OpticalObjectLabelNode.js';
import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import OpticalImageLabelNode from './OpticalImageLabelNode.js';
import FramedObjectSceneNode from '../FramedObjectSceneNode.js';

class FramedObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param scene
   * @param sceneNode
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param lightPropagationEnabledProperty
   * @param providedOptions
   */
  constructor( scene: FramedObjectScene,
               sceneNode: FramedObjectSceneNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: GOSceneLabelsNodeOptions ) {

    super( scene.optic, sceneNode, zoomTransformProperty, modelVisibleBoundsProperty, providedOptions );

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

geometricOptics.register( 'FramedObjectSceneLabelsNode', FramedObjectSceneLabelsNode );
export default FramedObjectSceneLabelsNode;