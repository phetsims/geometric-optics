// Copyright 2021, University of Colorado Boulder

//TODO https://github.com/phetsims/geometric-optics/issues/199 eliminate this, make Nodes responsible for their labels
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
import Property from '../../../../axon/js/Property.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import Representation from '../model/Representation.js';
import LensModel from '../../lens/model/LensModel.js';
import MirrorModel from '../../mirror/model/MirrorModel.js';
import Lens from '../../lens/model/Lens.js';
import Mirror from '../../mirror/model/Mirror.js';

class LabelsNode extends Node {

  /**
   * @param model
   * @param visibleProperties
   * @param zoomTransformProperty
   */
  constructor( model: LensModel | MirrorModel, visibleProperties: VisibleProperties,
               zoomTransformProperty: Property<ModelViewTransform2> ) {

    // Object label ------------------------------------------------------------------------------------

    const objectLabelPositionProperty = new DerivedProperty(
      [ model.sourceObject.boundsProperty ],
      // Because the we use a Y-inverted reference frame, the bottom of the image is the top of the model bounds.
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const objectLabel = new LabelNode( geometricOpticsStrings.object, objectLabelPositionProperty,
      zoomTransformProperty, {
        visibleProperty: new DerivedProperty( [ model.representationProperty ],
          ( representation: Representation ) => representation.isObject )
      } );

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

    // Image label ------------------------------------------------------------------------------------

    const imageLabelPositionProperty = new DerivedProperty(
      [ model.firstTarget.boundsProperty ],
      ( bounds: Bounds2 ) => bounds.centerTop
    );

    const imageLabelVisibleProperty = new DerivedProperty( [
        model.firstTarget.visibleProperty,
        model.representationProperty,
        model.firstTarget.isVirtualProperty,
        visibleProperties.virtualImageVisibleProperty
      ],
      ( visible: boolean, representation: Representation, isVirtual: boolean, virtualImageVisible: boolean ) =>
        ( visible && representation.isObject && ( isVirtual ? virtualImageVisible : true ) )
    );

    const imageLabel = new LabelNode( '', imageLabelPositionProperty, zoomTransformProperty, {
      visibleProperty: imageLabelVisibleProperty
    } );

    // Switch between 'Real Image' and 'Virtual Image'
    model.firstTarget.isVirtualProperty.link( isVirtual => {
      imageLabel.setText( isVirtual ? geometricOpticsStrings.virtualImage : geometricOpticsStrings.realImage );
    } );

    // Screen label ------------------------------------------------------------------------------------

    //TODO this is a temporary hack, because projectionScreen is irrelevant for Mirror screen
    let screenLabel;
    if ( model instanceof LensModel ) {

      const screenLabelPositionProperty = new DerivedProperty(
        [ model.projectionScreen.positionProperty ],
        ( position: Vector2 ) => new Vector2( position.x - 25, position.y - 65 ) // empirically, model coordinates
      );

      screenLabel = new LabelNode( geometricOpticsStrings.projectionScreen, screenLabelPositionProperty, zoomTransformProperty, {
        visibleProperty: new DerivedProperty(
          [ model.representationProperty ],
          ( representation: Representation ) => !representation.isObject
        )
      } );
    }

    // Optical Axis label ------------------------------------------------------------------------------------

    const opticalAxisLabelPositionProperty = new DerivedProperty(
      [ model.optic.positionProperty ],
      ( position: Vector2 ) => new Vector2( position.x - 230, position.y ) // empirically, model coordinates
    );

    const opticalAxisLabel = new LabelNode( geometricOpticsStrings.opticalAxis, opticalAxisLabelPositionProperty, zoomTransformProperty, {
      visibleProperty: model.optic.opticalAxisVisibleProperty
    } );

    // ------------------------------------------------------------------------------------

    const children: Node[] = [
      opticalAxisLabel,
      leftFocalPointLabel, rightFocalPointLabel,
      opticLabel, objectLabel, imageLabel
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