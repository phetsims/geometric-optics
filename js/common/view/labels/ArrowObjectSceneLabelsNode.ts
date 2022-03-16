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
import GOSceneLabelsNode, { GOSceneLabelsNodeOptions } from './GOSceneLabelsNode.js';
import ArrowImage from '../../model/ArrowImage.js';
import ArrowObject from '../../model/ArrowObject.js';
import OpticalObjectLabelNode, { OpticalObjectLabelNodeOptions } from './OpticalObjectLabelNode.js';
import OpticalImageLabelNode, { OpticalImageLabelNodeOptions } from './OpticalImageLabelNode.js';
import ArrowObjectSceneNode from '../ArrowObjectSceneNode.js';

type SelfOptions = {
  isBasicsVersion: boolean;
};

type ArrowObjectSceneLabelsNodeOptions = SelfOptions & GOSceneLabelsNodeOptions;

class ArrowObjectSceneLabelsNode extends GOSceneLabelsNode {

  /**
   * @param sceneNode
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param providedOptions
   */
  constructor( sceneNode: ArrowObjectSceneNode,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: ArrowObjectSceneLabelsNodeOptions ) {

    super( sceneNode, zoomTransformProperty, modelVisibleBoundsProperty, providedOptions );

    const scene = sceneNode.scene;

    // Use numbering in the full version of the sim, or in the basics version if Object 2 is made visible.
    const isNumberedProperty = new DerivedProperty( [ sceneNode.arrowObject2NodeVisibleProperty ],
      ( arrowObject2NodeVisible: boolean ) => ( !providedOptions.isBasicsVersion || arrowObject2NodeVisible ) );

    // Object labels ------------------------------------------------------------------------------------

    const object1Label = new ArrowObjectLabelNode( scene.arrowObject1, scene.optic.positionProperty, zoomTransformProperty, {
      visibleProperty: sceneNode.arrowObject1NodeVisibleProperty,
      isNumberedProperty: isNumberedProperty
    } );
    this.addChild( object1Label );

    const object2Label = new ArrowObjectLabelNode( scene.arrowObject2, scene.optic.positionProperty, zoomTransformProperty, {
      visibleProperty: sceneNode.arrowObject2NodeVisibleProperty
      // 2nd object is always numbered, so isNumberedProperty is unnecessary
    } );
    this.addChild( object2Label );

    // Image labels ------------------------------------------------------------------------------------

    const image1Label = new ArrowImageLabelNode( scene.arrowImage1, scene.optic.positionProperty, zoomTransformProperty, {
      visibleProperty: sceneNode.arrowImage1NodeVisibleProperty,
      isNumberedProperty: isNumberedProperty
    } );
    this.addChild( image1Label );

    const image2Label = new ArrowImageLabelNode( scene.arrowImage2, scene.optic.positionProperty, zoomTransformProperty, {
      visibleProperty: sceneNode.arrowImage2NodeVisibleProperty
      // 2nd image is always numbered, so isNumberedProperty is unnecessary
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
   * @param opticPositionProperty
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( arrowObject: ArrowObject,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: OpticalObjectLabelNodeOptions ) {

    // If the arrow points up, position the label below the optical axis.
    // Otherwise, position the label below the arrow's tip.
    const labelPositionProperty = new DerivedProperty(
      [ arrowObject.positionProperty, opticPositionProperty ],
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
   * @param opticPositionProperty
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( arrowImage: ArrowImage,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: OpticalImageLabelNodeOptions ) {

    const labelPositionProperty = new DerivedProperty(
      [ arrowImage.positionProperty, opticPositionProperty ],
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