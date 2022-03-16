// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOSceneLabelsNode is the base class for labeling things in a scene, supporting the "Labels" feature.
 * It is responsible for labeling the optic, optical axis, and focal points (F, 2F).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sarah Chang (Swarthmore College)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import { Node, NodeOptions } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import geometricOpticsStrings from '../../../geometricOpticsStrings.js';
import LabelNode from './LabelNode.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import OpticLabelNode from './OpticLabelNode.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import GOSceneNode from '../GOSceneNode.js';

const FOCAL_POINT_LABEL_Y_OFFSET = 7;

export type GOSceneLabelsNodeOptions = PickRequired<NodeOptions, 'visibleProperty'>;

class GOSceneLabelsNode extends Node {

  /**
   * @param sceneNode
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param providedOptions
   */
  protected constructor( sceneNode: GOSceneNode,
                         zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
                         modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
                         providedOptions: GOSceneLabelsNodeOptions ) {

    super( providedOptions );

    const optic = sceneNode.scene.optic;

    // Optic label ------------------------------------------------------------------------------------

    const opticLabel = new OpticLabelNode( optic, zoomTransformProperty, {
      visibleProperty: sceneNode.opticNodeVisibleProperty
    } );
    this.addChild( opticLabel );

    // Optical Axis label ------------------------------------------------------------------------------------

    // Under the optical axis, but at the far-left of the model bounds.
    const opticalAxisLabelPositionProperty = new DerivedProperty(
      [ optic.positionProperty, modelVisibleBoundsProperty ],
      ( opticPosition: Vector2, modelVisibleBounds: Bounds2 ) => {
        const modelXOffset = zoomTransformProperty.value.viewToModelDeltaX( 10 );
        return new Vector2( modelVisibleBounds.x + modelXOffset, opticPosition.y );
      } );

    const opticalAxisLabel = new LabelNode( geometricOpticsStrings.label.opticalAxis, opticalAxisLabelPositionProperty, zoomTransformProperty, {
      xAlign: 'left',
      yOffset: 5,
      visibleProperty: sceneNode.opticalAxisNodeVisibleProperty
    } );
    this.addChild( opticalAxisLabel );

    // Focal point labels ------------------------------------------------------------------------------------

    const leftFocalPointLabel = new LabelNode( geometricOpticsStrings.label.F,
      optic.leftFocalPointProperty, zoomTransformProperty, {
        yOffset: FOCAL_POINT_LABEL_Y_OFFSET,
        visibleProperty: sceneNode.leftFocalPointNodeVisibleProperty
      } );
    this.addChild( leftFocalPointLabel );

    const rightFocalPointLabel = new LabelNode( geometricOpticsStrings.label.F,
      optic.rightFocalPointProperty, zoomTransformProperty, {
        yOffset: FOCAL_POINT_LABEL_Y_OFFSET,
        visibleProperty: sceneNode.rightFocalPointNodeVisibleProperty
      } );
    this.addChild( rightFocalPointLabel );

    const left2FLabel = new LabelNode( geometricOpticsStrings.label.twoF,
      optic.left2FProperty, zoomTransformProperty, {
        yOffset: FOCAL_POINT_LABEL_Y_OFFSET,
        visibleProperty: sceneNode.left2FPointNodeVisibleProperty
      } );
    this.addChild( left2FLabel );

    const right2FLabel = new LabelNode( geometricOpticsStrings.label.twoF,
      optic.right2FProperty, zoomTransformProperty, {
        yOffset: FOCAL_POINT_LABEL_Y_OFFSET,
        visibleProperty: sceneNode.right2FPointNodeVisibleProperty
      } );
    this.addChild( right2FLabel );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'GOSceneLabelsNode', GOSceneLabelsNode );
export default GOSceneLabelsNode;