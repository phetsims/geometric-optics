// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObjectSceneLabelsNode labels things in the 'framed object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sarah Chang (Swarthmore College)
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
import FramedObjectScene from '../model/FramedObjectScene.js';
import { OpticalImageType } from '../model/OpticalImageType.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import IProperty from '../../../../axon/js/IProperty.js';

type FramedObjectSceneLabelsNodeOptions = {
  visibleProperty: Property<boolean>
};

class FramedObjectSceneLabelsNode extends Node {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty
   * @param lightPropagationEnabledProperty
   * @param providedOptions
   */
  constructor( scene: FramedObjectScene,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               lightPropagationEnabledProperty: IProperty<boolean>,
               providedOptions: FramedObjectSceneLabelsNodeOptions ) {

    // Object label ------------------------------------------------------------------------------------

    const objectLabelPositionProperty = new DerivedProperty(
      [ scene.framedObject.boundsProperty ],
      // Because we use a Y-inverted model-view transform, the bottom of the Object is the top of the model bounds.
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const objectLabel = new LabelNode( geometricOpticsStrings.object1, objectLabelPositionProperty,
      zoomTransformProperty, {
        yOffset: 2
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

    // Image label ------------------------------------------------------------------------------------

    const imageLabelPositionProperty = new DerivedProperty(
      [ scene.framedImage1.boundsProperty ],
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const imageLabel = new LabelNode( '', imageLabelPositionProperty, zoomTransformProperty, {
      yOffset: 2,
      visibleProperty: new DerivedProperty( [
          lightPropagationEnabledProperty,
          scene.framedImage1.visibleProperty,
          scene.framedImage1.opticalImageTypeProperty,
          visibleProperties.virtualImageVisibleProperty
        ],
        ( lightPropagationEnabled: boolean, imageVisible: boolean, opticalImageType: OpticalImageType, virtualImageVisible: boolean ) =>
          ( lightPropagationEnabled && imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) )
      )
    } );

    // Switch between 'Real Image' and 'Virtual Image'
    scene.framedImage1.opticalImageTypeProperty.link( opticalImageType => {
      imageLabel.setText( opticalImageType === 'real' ? geometricOpticsStrings.realImage1 : geometricOpticsStrings.virtualImage1 );
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
      objectLabel,
      imageLabel
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

geometricOptics.register( 'FramedObjectSceneLabelsNode', FramedObjectSceneLabelsNode );
export default FramedObjectSceneLabelsNode;