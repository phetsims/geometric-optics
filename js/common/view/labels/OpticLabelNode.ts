// Copyright 2022, University of Colorado Boulder

/**
 * OpticLabelNode is the label on the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../../geometricOptics.js';
import geometricOpticsStrings from '../../../geometricOpticsStrings.js';
import Lens from '../../../lens/model/Lens.js';
import Mirror from '../../../mirror/model/Mirror.js';
import Optic from '../../model/Optic.js';
import LabelNode, { LabelNodeOptions } from './LabelNode.js';

type SelfOptions = {};

export type OpticLabelNodeOptions = SelfOptions & Omit<LabelNodeOptions, 'phetioReadOnlyText'>;

export default class OpticLabelNode extends LabelNode {

  /**
   * @param optic - the optic to label
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param providedOptions
   */
  constructor( optic: Optic,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: OpticLabelNodeOptions ) {

    const options = optionize<OpticLabelNodeOptions, SelfOptions, LabelNodeOptions>()( {
      phetioReadOnlyText: true // text is readonly because the sim controls it, see below
    }, providedOptions );

    const opticLabelPositionProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty ],
      ( position: Vector2, diameter: number ) => position.minusXY( 0, diameter / 2 )
    );

    super( '', opticLabelPositionProperty, zoomTransformProperty, options );

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