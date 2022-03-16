// Copyright 2022, University of Colorado Boulder

/**
 * OpticLabelNode is the label on the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../../geometricOptics.js';
import geometricOpticsStrings from '../../../geometricOpticsStrings.js';
import Lens from '../../../lens/model/Lens.js';
import Mirror from '../../../mirror/model/Mirror.js';
import Optic from '../../model/Optic.js';
import LabelNode, { LabelNodeOptions } from './LabelNode.js';

export type OpticLabelNodeOptions = LabelNodeOptions;

class OpticLabelNode extends LabelNode {

  /**
   * @param optic
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( optic: Optic,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: OpticLabelNodeOptions ) {

    const opticLabelPositionProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty ],
      ( position: Vector2, diameter: number ) => position.minusXY( 0, diameter / 2 )
    );

    super( '', opticLabelPositionProperty, zoomTransformProperty, providedOptions );

    optic.opticShapeProperty.link( opticShape => {
      let text: string;
      if ( optic instanceof Lens ) {
        if ( opticShape === 'convex' ) {
          text = geometricOpticsStrings.label.convexLens;
        }
        else if ( opticShape === 'concave' ) {
          text = geometricOpticsStrings.label.concaveLens;
        }
        else {
          throw Error( `unsupported opticShape for lens: ${opticShape}` );
        }
      }
      else {
        // mirror
        assert && assert( optic instanceof Mirror );
        if ( opticShape === 'convex' ) {
          text = geometricOpticsStrings.label.convexMirror;
        }
        else if ( opticShape === 'concave' ) {
          text = geometricOpticsStrings.label.concaveMirror;
        }
        else if ( opticShape === 'flat' ) {
          text = geometricOpticsStrings.label.flatMirror;
        }
        else {
          throw Error( `unsupported opticShape for mirror: ${opticShape}` );
        }
      }
      this.setText( text );
    } );
  }
}

geometricOptics.register( 'OpticLabelNode', OpticLabelNode );
export default OpticLabelNode;