// Copyright 2021-2022, University of Colorado Boulder

//TODO lots of duplication with FramedObjectSceneLabelsNode
/**
 * LightSourceSceneLabelsNode labels things in the 'light object' scene.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sarah Chang (Swarthmore College)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import LabelNode from '../../common/view/LabelNode.js';
import VisibleProperties from '../../common/view/VisibleProperties.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Lens from '../../lens/model/Lens.js';
import Mirror from '../../mirror/model/Mirror.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import LightSourceScene from '../model/LightSourceScene.js';

type LightSourcesSceneLabelsNodeOptions = {
  visibleProperty: Property<boolean>
};

class LightSourceSceneLabelsNode extends Node {

  /**
   * @param scene
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty
   * @param providedOptions
   */
  constructor( scene: LightSourceScene,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: LightSourcesSceneLabelsNodeOptions ) {

    // Light labels ------------------------------------------------------------------------------------

    // empirically, model coordinates
    const getLightLabelPosition = ( lightSourceBounds: Bounds2 ) =>
      new Vector2( lightSourceBounds.centerX - 15, lightSourceBounds.top );

    const lightLabelYOffset = 2; // view coordinates

    const light1LabelPositionProperty = new DerivedProperty(
      [ scene.lightSource1.boundsProperty ],
      ( bounds: Bounds2 ) => getLightLabelPosition( bounds )
    );

    const light1Label = new LabelNode( geometricOpticsStrings.object1, light1LabelPositionProperty,
      zoomTransformProperty, {
        yOffset: lightLabelYOffset
      } );

    const light2LabelPositionProperty = new DerivedProperty(
      [ scene.lightSource2.boundsProperty ],
      ( bounds: Bounds2 ) => getLightLabelPosition( bounds )
    );

    const light2Label = new LabelNode( geometricOpticsStrings.object2, light2LabelPositionProperty,
      zoomTransformProperty, {
        yOffset: lightLabelYOffset,
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

    // Screen label ------------------------------------------------------------------------------------

    const screenLabelPositionProperty = new DerivedProperty(
      [ scene.projectionScreen.positionProperty ],
      ( position: Vector2 ) => new Vector2( position.x - 25, position.y - 65 ) // empirically, model coordinates
    );

    const screenLabel = new LabelNode( geometricOpticsStrings.projectionScreen, screenLabelPositionProperty, zoomTransformProperty );

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
      light1Label,
      light2Label,
      screenLabel
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

geometricOptics.register( 'LightSourceSceneLabelsNode', LightSourceSceneLabelsNode );
export default LightSourceSceneLabelsNode;