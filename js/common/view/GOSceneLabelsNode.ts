// Copyright 2021-2022, University of Colorado Boulder

/**
 * GOSceneLabelsNode is the base class for labeling things in a scene, supporting the "Labels" feature.
 * It is responsible for labeling the optic, optical axis, and focal points (F, 2F).
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
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import Property from '../../../../axon/js/Property.js';
import merge from '../../../../phet-core/js/merge.js';
import Optic from '../model/Optic.js';
import OpticLabelNode from './OpticLabelNode.js';

type GOSceneLabelsNodeOptions = {
  visibleProperty: Property<boolean>
};

class GOSceneLabelsNode extends Node {

  /**
   * @param optic
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty
   * @param providedOptions
   */
  constructor( optic: Optic,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2>,
               providedOptions: GOSceneLabelsNodeOptions ) {

    const options = merge( {}, providedOptions );
    super( options );

    // Optic label ------------------------------------------------------------------------------------

    const opticLabel = new OpticLabelNode( optic, zoomTransformProperty );
    this.addChild( opticLabel );

    // Optical Axis label ------------------------------------------------------------------------------------

    // Under the optical axis, but at the far-left of the model bounds.
    const opticalAxisLabelPositionProperty = new DerivedProperty(
      [ optic.positionProperty, modelVisibleBoundsProperty ],
      ( opticPosition: Vector2, modelVisibleBounds: Bounds2 ) => {
        const modelXOffset = zoomTransformProperty.value.viewToModelDeltaX( 10 );
        return new Vector2( modelVisibleBounds.x + modelXOffset, opticPosition.y );
      } );

    const opticalAxisLabel = new LabelNode( geometricOpticsStrings.opticalAxis, opticalAxisLabelPositionProperty, zoomTransformProperty, {
      xAlign: 'left',
      yOffset: 5,
      visibleProperty: visibleProperties.opticalAxisVisibleProperty
    } );
    this.addChild( opticalAxisLabel );

    // Focal point labels ------------------------------------------------------------------------------------

    const focalPointLabelYOffset = 7;

    const leftFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint,
      optic.leftFocalPointProperty, zoomTransformProperty, {
        yOffset: focalPointLabelYOffset,
        visibleProperty: visibleProperties.focalPointsVisibleProperty
      } );
    this.addChild( leftFocalPointLabel );

    const rightFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint,
      optic.rightFocalPointProperty, zoomTransformProperty, {
        yOffset: focalPointLabelYOffset,
        visibleProperty: visibleProperties.focalPointsVisibleProperty
      } );
    this.addChild( rightFocalPointLabel );

    const left2FLabel = new LabelNode( geometricOpticsStrings.twoF,
      optic.left2FProperty, zoomTransformProperty, {
        yOffset: focalPointLabelYOffset,
        visibleProperty: visibleProperties.twoFPointsVisibleProperty
      } );
    this.addChild( left2FLabel );

    const right2FLabel = new LabelNode( geometricOpticsStrings.twoF,
      optic.right2FProperty, zoomTransformProperty, {
        yOffset: focalPointLabelYOffset,
        visibleProperty: visibleProperties.twoFPointsVisibleProperty
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
export type { GOSceneLabelsNodeOptions };