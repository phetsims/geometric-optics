// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOLabelsNode is the base class for labeling things in a scene, supporting the "Labels" feature.
 * It is responsible for labeling the optic, optical axis, and focal points (F, 2F).
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Sarah Chang (Swarthmore College)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import { Node, NodeOptions } from '../../../../../scenery/js/imports.js';
import geometricOptics from '../../../geometricOptics.js';
import GeometricOpticsStrings from '../../../GeometricOpticsStrings.js';
import LabelNode from './LabelNode.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import OpticLabelNode from './OpticLabelNode.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import GOSceneNode from '../GOSceneNode.js';

const FOCAL_POINT_LABEL_Y_OFFSET = 7;

export type GOSceneLabelsNodeOptions = PickRequired<NodeOptions, 'visibleProperty' | 'tandem' | 'phetioDocumentation'>;

export default class GOLabelsNode extends Node {

  /**
   * @param sceneNode - the scene whose components we are labeling
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param modelVisibleBoundsProperty - ScreenView's visibleBounds in the model coordinate frame, with the zoom transform applied
   * @param providedOptions
   */
  protected constructor( sceneNode: GOSceneNode,
                         zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                         modelVisibleBoundsProperty: TReadOnlyProperty<Bounds2>,
                         providedOptions: GOSceneLabelsNodeOptions ) {

    super( providedOptions );

    const optic = sceneNode.scene.optic;

    // Optic label ------------------------------------------------------------------------------------

    const opticLabel = new OpticLabelNode( optic, zoomTransformProperty, {
      visibleProperty: sceneNode.opticNodeVisibleProperty,
      tandem: providedOptions.tandem.createTandem( 'opticLabel' )
    } );
    this.addChild( opticLabel );

    // Optical Axis label ------------------------------------------------------------------------------------

    // Under the optical axis, but at the far-left of the model bounds.
    const opticalAxisLabelPositionProperty = new DerivedProperty(
      [ optic.positionProperty, modelVisibleBoundsProperty ],
      ( opticPosition, modelVisibleBounds ) => {
        const modelXOffset = zoomTransformProperty.value.viewToModelDeltaX( 10 );
        return new Vector2( modelVisibleBounds.x + modelXOffset, opticPosition.y );
      } );

    const opticalAxisLabel = new LabelNode( GeometricOpticsStrings.label.opticalAxisStringProperty,
      opticalAxisLabelPositionProperty, zoomTransformProperty, {
        xAlign: 'left',
        yOffset: 5,
        visibleProperty: sceneNode.opticalAxisNodeVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'opticalAxisLabel' )
      } );
    this.addChild( opticalAxisLabel );

    // Focal Point labels ------------------------------------------------------------------------------------

    const leftFocalPointLabel = new LabelNode( GeometricOpticsStrings.label.FStringProperty,
      optic.leftFocalPointProperty, zoomTransformProperty, {
        yOffset: FOCAL_POINT_LABEL_Y_OFFSET,
        visibleProperty: sceneNode.leftFocalPointNodeVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'leftFocalPointLabel' )
      } );
    this.addChild( leftFocalPointLabel );

    const rightFocalPointLabel = new LabelNode( GeometricOpticsStrings.label.FStringProperty,
      optic.rightFocalPointProperty, zoomTransformProperty, {
        yOffset: FOCAL_POINT_LABEL_Y_OFFSET,
        visibleProperty: sceneNode.rightFocalPointNodeVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'rightFocalPointLabel' )
      } );
    this.addChild( rightFocalPointLabel );

    // 2F Point labels ----------------------------------------------------------------------------------------

    const left2FPointLabel = new LabelNode( GeometricOpticsStrings.label.twoFStringProperty,
      optic.left2FProperty, zoomTransformProperty, {
        yOffset: FOCAL_POINT_LABEL_Y_OFFSET,
        visibleProperty: sceneNode.left2FPointNodeVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'left2FPointLabel' )
      } );
    this.addChild( left2FPointLabel );

    const right2FPointLabel = new LabelNode( GeometricOpticsStrings.label.twoFStringProperty,
      optic.right2FProperty, zoomTransformProperty, {
        yOffset: FOCAL_POINT_LABEL_Y_OFFSET,
        visibleProperty: sceneNode.right2FPointNodeVisibleProperty,
        tandem: providedOptions.tandem.createTandem( 'right2FPointLabel' )
      } );
    this.addChild( right2FPointLabel );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'GOLabelsNode', GOLabelsNode );