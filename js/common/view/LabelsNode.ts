// Copyright 2021-2022, University of Colorado Boulder

/**
 * LabelsNode is the parent Node for labels that appear below things of interest in the user interface.
 *
 * @author Sarah Chang (Swarthmore College)
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
import LensModel from '../../lens/model/LensModel.js';
import Lens from '../../lens/model/Lens.js';
import Mirror from '../../mirror/model/Mirror.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import GOModel from '../model/GOModel.js';

class LabelsNode extends Node {

  /**
   * @param model
   * @param visibleProperties
   * @param zoomTransformProperty
   * @param modelVisibleBoundsProperty
   */
  constructor( model: GOModel,
               visibleProperties: VisibleProperties,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               modelVisibleBoundsProperty: IReadOnlyProperty<Bounds2> ) {

    // Object label ------------------------------------------------------------------------------------

    //TODO https://github.com/phetsims/geometric-optics/issues/217 restore labels
    //
    // const objectLabelPositionProperty = new DerivedProperty(
    //   [ model.sourceObject.boundsProperty ],
    //   // Because we use a Y-inverted model-view transform, the bottom of the Object is the top of the model bounds.
    //   ( bounds: Bounds2 ) => bounds.centerTop
    // );
    //
    // const objectLabel = new LabelNode( geometricOpticsStrings.object, objectLabelPositionProperty,
    //   zoomTransformProperty, {
    //     yOffset: 2,
    //     visibleProperty: new DerivedProperty( [ model.representationProperty ],
    //       ( representation: Representation ) => representation.isFramedObject )
    //   } );

    // Optic label ------------------------------------------------------------------------------------

    const opticLabelPositionProperty = new DerivedProperty(
      [ model.optic.positionProperty, model.optic.diameterProperty ],
      ( position: Vector2, diameter: number ) => position.minusXY( 0, diameter / 2 )
    );

    const opticLabel = new LabelNode( '', opticLabelPositionProperty, zoomTransformProperty );

    model.optic.opticShapeProperty.link( opticShape => {
      let text: string;
      if ( model.optic instanceof Lens ) {
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
        assert && assert( model.optic instanceof Mirror );
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
      model.optic.leftFocalPointProperty, zoomTransformProperty, {
        visibleProperty: visibleProperties.focalPointsVisibleProperty
      } );

    const rightFocalPointLabel = new LabelNode( geometricOpticsStrings.focalPoint,
      model.optic.rightFocalPointProperty, zoomTransformProperty, {
        visibleProperty: visibleProperties.focalPointsVisibleProperty
      } );

    const left2FLabel = new LabelNode( geometricOpticsStrings.twoF,
      model.optic.left2FProperty, zoomTransformProperty, {
        visibleProperty: visibleProperties.twoFPointsVisibleProperty
      } );

    const right2FLabel = new LabelNode( geometricOpticsStrings.twoF,
      model.optic.right2FProperty, zoomTransformProperty, {
        visibleProperty: visibleProperties.twoFPointsVisibleProperty
      } );

    // Image label ------------------------------------------------------------------------------------

    //TODO https://github.com/phetsims/geometric-optics/issues/217 restore labels
    //
    // const imageLabelPositionProperty = new DerivedProperty(
    //   [ model.firstTarget.boundsProperty ],
    //   ( bounds: Bounds2 ) => bounds.centerTop
    // );
    //
    // const imageLabelVisibleProperty = new DerivedProperty( [
    //     model.firstTarget.visibleProperty,
    //     model.representationProperty,
    //     model.firstTarget.isVirtualProperty,
    //     visibleProperties.virtualImageVisibleProperty
    //   ],
    //   ( visible: boolean, representation: Representation, isVirtual: boolean, virtualImageVisible: boolean ) =>
    //     ( visible && representation.isFramedObject && ( isVirtual ? virtualImageVisible : true ) )
    // );
    //
    // const imageLabel = new LabelNode( '', imageLabelPositionProperty, zoomTransformProperty, {
    //   yOffset: 2,
    //   visibleProperty: imageLabelVisibleProperty
    // } );
    //
    // // Switch between 'Real Image' and 'Virtual Image'
    // model.firstTarget.isVirtualProperty.link( isVirtual => {
    //   imageLabel.setText( isVirtual ? geometricOpticsStrings.virtualImage : geometricOpticsStrings.realImage );
    // } );

    // Screen label ------------------------------------------------------------------------------------

    let screenLabel;
    if ( model instanceof LensModel ) {

      //TODO https://github.com/phetsims/geometric-optics/issues/217 restore labels
      //
      // const screenLabelPositionProperty = new DerivedProperty(
      //   [ model.projectionScreen.positionProperty ],
      //   ( position: Vector2 ) => new Vector2( position.x - 25, position.y - 65 ) // empirically, model coordinates
      // );
      //
      // screenLabel = new LabelNode( geometricOpticsStrings.projectionScreen, screenLabelPositionProperty, zoomTransformProperty, {
      //   visibleProperty: new DerivedProperty(
      //     [ model.representationProperty ],
      //     ( representation: Representation ) => !representation.isFramedObject
      //   )
      // } );
    }

    // Optical Axis label ------------------------------------------------------------------------------------

    // Under the optical axis, but at the far-left of the model bounds.
    const opticalAxisLabelPositionProperty = new DerivedProperty(
      [ model.optic.positionProperty, modelVisibleBoundsProperty ],
      ( opticPosition: Vector2, modelVisibleBounds: Bounds2 ) => {
        const modelXOffset = zoomTransformProperty.value.viewToModelDeltaX( 10 );
        return new Vector2( modelVisibleBounds.x + modelXOffset, opticPosition.y );
      } );

    const opticalAxisLabel = new LabelNode( geometricOpticsStrings.opticalAxis, opticalAxisLabelPositionProperty, zoomTransformProperty, {
      xAlign: 'left',
      yOffset: 5,
      visibleProperty: model.optic.opticalAxisVisibleProperty
    } );

    // ------------------------------------------------------------------------------------

    const children: Node[] = [
      opticalAxisLabel,
      leftFocalPointLabel, rightFocalPointLabel,
      left2FLabel, right2FLabel,
      opticLabel
      //TODO https://github.com/phetsims/geometric-optics/issues/217 restore labels
      // objectLabel,
      // imageLabel
    ];
    if ( screenLabel ) {
      children.push( screenLabel );
    }

    super( {
      children: children,
      visibleProperty: visibleProperties.labelsVisibleProperty
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'LabelsNode', LabelsNode );
export default LabelsNode;