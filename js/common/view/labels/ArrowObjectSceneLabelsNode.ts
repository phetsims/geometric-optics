// Copyright 2021-2022, University of Colorado Boulder

/**
 * ArrowObjectSceneLabelsNode labels things in the 'arrow object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import geometricOptics from '../../../geometricOptics.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import ArrowObjectScene from '../../model/ArrowObjectScene.js';
import GOSceneLabelsNode, { GOSceneLabelsNodeOptions } from './GOSceneLabelsNode.js';
import ArrowImage from '../../model/ArrowImage.js';
import ArrowObject from '../../model/ArrowObject.js';
import Optic from '../../model/Optic.js';
import OpticalObjectLabelNode, { OpticalObjectLabelNodeOptions } from './OpticalObjectLabelNode.js';
import OpticalImageLabelNode, { OpticalImageLabelNodeOptions } from './OpticalImageLabelNode.js';
import ArrowObjectSceneNode from '../ArrowObjectSceneNode.js';

type SelfOptions = {
  isBasicsVersion: boolean;
};

type ArrowObjectSceneLabelsNodeOptions = SelfOptions & GOSceneLabelsNodeOptions;

class ArrowObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param scene
   * @param sceneNode
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param providedOptions
   */
  constructor( scene: ArrowObjectScene,
               sceneNode: ArrowObjectSceneNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: ArrowObjectSceneLabelsNodeOptions ) {

    super( scene.optic, sceneNode, zoomTransformProperty, modelVisibleBoundsProperty, providedOptions );

    // Object labels ------------------------------------------------------------------------------------

    const object1Label = new ArrowObjectLabelNode( scene.arrowObject1, scene.optic, zoomTransformProperty, {

      // Use numbering in the full version of the sim, or in the basics version if Object 2 is made visible.
      isNumberedProperty: new DerivedProperty( [ sceneNode.arrowObject2NodeVisibleProperty ],
        ( arrowObject2NodeVisible: boolean ) => ( !providedOptions.isBasicsVersion || arrowObject2NodeVisible ) ),
      visibleProperty: sceneNode.arrowObject1NodeVisibleProperty
    } );
    this.addChild( object1Label );

    const object2Label = new ArrowObjectLabelNode( scene.arrowObject2, scene.optic, zoomTransformProperty, {
      visibleProperty: sceneNode.arrowObject2NodeVisibleProperty
    } );
    this.addChild( object2Label );

    // Image labels ------------------------------------------------------------------------------------

    const image1Label = new ArrowImageLabelNode( scene.arrowImage1, scene.optic, zoomTransformProperty, {

      // Use numbering in the full version of the sim, or in the basics version if Object 2 is made visible.
      isNumberedProperty: new DerivedProperty( [ sceneNode.arrowImage2NodeVisibleProperty ],
        ( arrowImage2NodeVisible: boolean ) => ( !providedOptions.isBasicsVersion || arrowImage2NodeVisible )
      ),
      visibleProperty: sceneNode.arrowImage1NodeVisibleProperty
    } );
    this.addChild( image1Label );

    const image2Label = new ArrowImageLabelNode( scene.arrowImage2, scene.optic, zoomTransformProperty, {
      visibleProperty: sceneNode.arrowImage2NodeVisibleProperty
    } );
    this.addChild( image2Label );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

// Label for an arrow object.
class ArrowObjectLabelNode extends OpticalObjectLabelNode {

  /**
   * @param arrowObject
   * @param optic
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               optic: Optic, //TODO replace with opticalObjectNumber, opticPositionProperty
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: OpticalObjectLabelNodeOptions ) {

    // If the arrow points up, position the label below the optical axis.
    // Otherwise, position the label below the arrow's tip.
    const labelPositionProperty = new DerivedProperty(
      [ arrowObject.positionProperty, optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) =>
        ( arrowPosition.y > opticPosition.y ) ? new Vector2( arrowPosition.x, opticPosition.y ) : arrowPosition
    );

    super( arrowObject.opticalObjectNumber, labelPositionProperty, zoomTransformProperty, providedOptions );
  }
}

// Label for an arrow image.
class ArrowImageLabelNode extends OpticalImageLabelNode {

  /**
   * @param arrowImage
   * @param optic
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( arrowImage: ArrowImage,
               optic: Optic, //TODO replace with opticPositionProperty
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: OpticalImageLabelNodeOptions ) {

    const labelPositionProperty = new DerivedProperty(
      [ arrowImage.positionProperty, optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    super( arrowImage, labelPositionProperty, zoomTransformProperty, providedOptions );
  }
}

geometricOptics.register( 'ArrowObjectSceneLabelsNode', ArrowObjectSceneLabelsNode );
export default ArrowObjectSceneLabelsNode;