// Copyright 2021-2022, University of Colorado Boulder

/**
 * ArrowObjectSceneLabelsNode labels things in the 'arrow object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import LabelNode from './LabelNode.js';
import VisibleProperties from './VisibleProperties.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Lens from '../../lens/model/Lens.js';
import Mirror from '../../mirror/model/Mirror.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import ArrowObjectScene from '../model/ArrowObjectScene.js';
import IProperty from '../../../../axon/js/IProperty.js';
import { OpticalImageType } from '../model/OpticalImageType.js';

type ArrowObjectSceneLabelsNodeOptions = {
  visibleProperty: Property<boolean>
};

class ArrowObjectSceneLabelsNode extends Node {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty
   * @param lightPropagationEnabledProperty
   * @param providedOptions
   */
  constructor( scene: ArrowObjectScene,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: ArrowObjectSceneLabelsNodeOptions ) {

    // Object labels ------------------------------------------------------------------------------------

    const object1LabelPositionProperty = new DerivedProperty(
      [ scene.arrowObject1.positionProperty, scene.optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    const object1Label = new LabelNode( geometricOpticsStrings.object1, object1LabelPositionProperty,
      zoomTransformProperty, {
        yOffset: 2
      } );

    const object2LabelPositionProperty = new DerivedProperty(
      [ scene.arrowObject2.positionProperty, scene.optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    const object2Label = new LabelNode( geometricOpticsStrings.object2, object2LabelPositionProperty,
      zoomTransformProperty, {
        yOffset: 2,
        visibleProperty: visibleProperties.secondPointVisibleProperty
      } );

    // Optic label ------------------------------------------------------------------------------------

    const opticLabelPositionProperty = new DerivedProperty(
      [ scene.optic.positionProperty, scene.optic.diameterProperty ],
      ( position: Vector2, diameter: number ) => position.minusXY( 0, diameter / 2 )
    );

    const opticLabel = new LabelNode( '', opticLabelPositionProperty, zoomTransformProperty );

    scene.optic.opticShapeProperty.link( opticShape => {
      let text: string;
      if ( scene.optic instanceof Lens ) {
        if ( opticShape === 'convex' ) {
          text = geometricOpticsStrings.convexLens;
        }
        else if ( opticShape === 'concave' ) {
          text = geometricOpticsStrings.concaveLens;
        }
        else {
          throw Error( `unsupported opticShape for lens: ${opticShape}` );
        }
      }
      else {
        // mirror
        assert && assert( scene.optic instanceof Mirror );
        if ( opticShape === 'convex' ) {
          text = geometricOpticsStrings.convexMirror;
        }
        else if ( opticShape === 'concave' ) {
          text = geometricOpticsStrings.concaveMirror;
        }
        else if ( opticShape === 'flat' ) {
          text = geometricOpticsStrings.flatMirror;
        }
        else {
          throw Error( `unsupported opticShape for mirror: ${opticShape}` );
        }
      }
      opticLabel.setText( text );
    } );

    // Focal point labels ------------------------------------------------------------------------------------

    const leftFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint,
      scene.optic.leftFocalPointProperty, zoomTransformProperty, {
        visibleProperty: visibleProperties.focalPointsVisibleProperty
      } );

    const rightFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint,
      scene.optic.rightFocalPointProperty, zoomTransformProperty, {
        visibleProperty: visibleProperties.focalPointsVisibleProperty
      } );

    const left2FLabel = new LabelNode( geometricOpticsStrings.twoF,
      scene.optic.left2FProperty, zoomTransformProperty, {
        visibleProperty: visibleProperties.twoFPointsVisibleProperty
      } );

    const right2FLabel = new LabelNode( geometricOpticsStrings.twoF,
      scene.optic.right2FProperty, zoomTransformProperty, {
        visibleProperty: visibleProperties.twoFPointsVisibleProperty
      } );

    // Image labels ------------------------------------------------------------------------------------

    const image1LabelPositionProperty = new DerivedProperty(
      [ scene.arrowImage1.positionProperty, scene.optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    const image1Label = new LabelNode( '', image1LabelPositionProperty,
      zoomTransformProperty, {
        yOffset: 2,
        visibleProperty: new DerivedProperty( [
            lightPropagationEnabledProperty,
            scene.arrowImage1.visibleProperty,
            scene.arrowImage1.opticalImageTypeProperty,
            visibleProperties.virtualImageVisibleProperty
          ],
          ( lightPropagationEnabled: boolean, imageVisible: boolean, opticalImageType: OpticalImageType, virtualImageVisible: boolean ) =>
            ( lightPropagationEnabled && imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) )
        )
      } );

    // Switch between 'Real Image' and 'Virtual Image'
    scene.arrowImage1.opticalImageTypeProperty.link( opticalImageType => {
      image1Label.setText( opticalImageType === 'real' ? geometricOpticsStrings.realImage1 : geometricOpticsStrings.virtualImage1 );
    } );

    const image2LabelPositionProperty = new DerivedProperty(
      [ scene.arrowImage2.positionProperty, scene.optic.positionProperty ],
      ( arrowPosition: Vector2, opticPosition: Vector2 ) => {
        if ( arrowPosition.y > opticPosition.y ) {
          return new Vector2( arrowPosition.x, opticPosition.y );
        }
        else {
          return arrowPosition;
        }
      }
    );

    const image2Label = new LabelNode( '', image2LabelPositionProperty,
      zoomTransformProperty, {
        yOffset: 2,
        visibleProperty: new DerivedProperty( [
            visibleProperties.secondPointVisibleProperty,
            lightPropagationEnabledProperty,
            scene.arrowImage2.visibleProperty,
            scene.arrowImage2.opticalImageTypeProperty,
            visibleProperties.virtualImageVisibleProperty
          ],
          ( secondPointVisible: boolean, lightPropagationEnabled: boolean, imageVisible: boolean, opticalImageType: OpticalImageType, virtualImageVisible: boolean ) =>
            ( secondPointVisible && lightPropagationEnabled && imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) )
        )
      } );

    // Switch between 'Real Image' and 'Virtual Image'
    scene.arrowImage2.opticalImageTypeProperty.link( opticalImageType => {
      image2Label.setText( opticalImageType === 'real' ? geometricOpticsStrings.realImage1 : geometricOpticsStrings.virtualImage1 );
    } );

    // Optical Axis label ------------------------------------------------------------------------------------

    // Under the optical axis, but at the far-left of the model bounds.
    const opticalAxisLabelPositionProperty = new DerivedProperty(
      [ scene.optic.positionProperty, modelVisibleBoundsProperty ],
      ( opticPosition: Vector2, modelVisibleBounds: Bounds2 ) => {
        const modelXOffset = zoomTransformProperty.value.viewToModelDeltaX( 10 );
        return new Vector2( modelVisibleBounds.x + modelXOffset, opticPosition.y );
      } );

    const opticalAxisLabel = new LabelNode( geometricOpticsStrings.opticalAxis, opticalAxisLabelPositionProperty, zoomTransformProperty, {
      xAlign: 'left',
      yOffset: 5,
      visibleProperty: visibleProperties.opticalAxisVisibleProperty
    } );

    // ------------------------------------------------------------------------------------

    const children: Node[] = [
      opticalAxisLabel,
      leftFocalPointLabel, rightFocalPointLabel,
      left2FLabel, right2FLabel,
      opticLabel,
      object1Label,
      object2Label,
      image1Label,
      image2Label
    ];

    super( merge( {
      children: children
    }, providedOptions ) );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'ArrowObjectSceneLabelsNode', ArrowObjectSceneLabelsNode );
export default ArrowObjectSceneLabelsNode;