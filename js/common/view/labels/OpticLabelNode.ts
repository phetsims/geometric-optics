// Copyright 2022, University of Colorado Boulder

/**
 * OpticLabelNode is the label on the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../../geometricOptics.js';
import geometricOpticsStrings from '../../../geometricOpticsStrings.js';
import Lens from '../../../lens/model/Lens.js';
import Mirror from '../../../mirror/model/Mirror.js';
import Optic from '../../model/Optic.js';
import LabelNode, { LabelNodeOptions } from './LabelNode.js';

type SelfOptions = EmptySelfOptions;

export type OpticLabelNodeOptions = SelfOptions & StrictOmit<LabelNodeOptions, 'phetioReadOnlyText'>;

export default class OpticLabelNode extends LabelNode {

  /**
   * @param optic - the optic to label
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param providedOptions
   */
  public constructor( optic: Optic,
                      zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
                      providedOptions: OpticLabelNodeOptions ) {

    const options = optionize<OpticLabelNodeOptions, SelfOptions, LabelNodeOptions>()( {
      phetioReadOnlyText: true // text is readonly because the sim controls it, see below
    }, providedOptions );

    const opticLabelPositionProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty ],
      ( position, diameter ) => position.minusXY( 0, diameter / 2 )
    );

    super( '', opticLabelPositionProperty, zoomTransformProperty, options );

    optic.opticSurfaceTypeProperty.link( opticSurfaceType => {
      let text: string;
      if ( optic instanceof Lens ) {
        if ( opticSurfaceType === 'convex' ) {
          text = geometricOpticsStrings.label.convexLens;
        }
        else if ( opticSurfaceType === 'concave' ) {
          text = geometricOpticsStrings.label.concaveLens;
        }
        else {
          throw Error( `unsupported opticSurfaceType for lens: ${opticSurfaceType}` );
        }
      }
      else {
        // mirror
        assert && assert( optic instanceof Mirror ); // eslint-disable-line no-simple-type-checking-assertions
        if ( opticSurfaceType === 'convex' ) {
          text = geometricOpticsStrings.label.convexMirror;
        }
        else if ( opticSurfaceType === 'concave' ) {
          text = geometricOpticsStrings.label.concaveMirror;
        }
        else if ( opticSurfaceType === 'flat' ) {
          text = geometricOpticsStrings.label.flatMirror;
        }
        else {
          throw Error( `unsupported opticSurfaceType for mirror: ${opticSurfaceType}` );
        }
      }
      this.setText( text );
    } );
  }
}

geometricOptics.register( 'OpticLabelNode', OpticLabelNode );