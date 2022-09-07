// Copyright 2022, University of Colorado Boulder

/**
 * OpticLabelNode is the label on the optic.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import { EmptySelfOptions } from '../../../../../phet-core/js/optionize.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import geometricOptics from '../../../geometricOptics.js';
import GeometricOpticsStrings from '../../../GeometricOpticsStrings.js';
import Lens from '../../../lens/model/Lens.js';
import Mirror from '../../../mirror/model/Mirror.js';
import Optic from '../../model/Optic.js';
import LabelNode, { LabelNodeOptions } from './LabelNode.js';
import { OpticSurfaceType } from '../../model/OpticSurfaceType.js';
import StringIO from '../../../../../tandem/js/types/StringIO.js';

type SelfOptions = EmptySelfOptions;

export type OpticLabelNodeOptions = SelfOptions & LabelNodeOptions;

export default class OpticLabelNode extends LabelNode {

  /**
   * @param optic - the optic to label
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param providedOptions
   */
  public constructor( optic: Optic,
                      zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      providedOptions: OpticLabelNodeOptions ) {

    const opticLabelPositionProperty = new DerivedProperty(
      [ optic.positionProperty, optic.diameterProperty ],
      ( position, diameter ) => position.minusXY( 0, diameter / 2 )
    );

    const labelStringProperty = new DerivedProperty( [
      optic.opticSurfaceTypeProperty,
      GeometricOpticsStrings.label.convexLensStringProperty,
      GeometricOpticsStrings.label.concaveLensStringProperty,
      GeometricOpticsStrings.label.convexMirrorStringProperty,
      GeometricOpticsStrings.label.concaveMirrorStringProperty,
      GeometricOpticsStrings.label.flatMirrorStringProperty
    ], (
      opticSurfaceType: OpticSurfaceType,
      convexLensString: string,
      concaveLensString: string,
      convexMirrorString: string,
      concaveMirrorString: string,
      flatMirrorString: string
    ) => {
      let text: string;
      if ( optic instanceof Lens ) {
        if ( opticSurfaceType === 'convex' ) {
          text = convexLensString;
        }
        else if ( opticSurfaceType === 'concave' ) {
          text = concaveLensString;
        }
        else {
          throw Error( `unsupported opticSurfaceType for lens: ${opticSurfaceType}` );
        }
      }
      else {
        // mirror
        assert && assert( optic instanceof Mirror ); // eslint-disable-line no-simple-type-checking-assertions
        if ( opticSurfaceType === 'convex' ) {
          text = convexMirrorString;
        }
        else if ( opticSurfaceType === 'concave' ) {
          text = concaveMirrorString;
        }
        else if ( opticSurfaceType === 'flat' ) {
          text = flatMirrorString;
        }
        else {
          throw Error( `unsupported opticSurfaceType for mirror: ${opticSurfaceType}` );
        }
      }
      return text;
    }, {
      tandem: providedOptions.tandem.createTandem( 'labelStringProperty' ),
      phetioValueType: StringIO
    } );

    super( labelStringProperty, opticLabelPositionProperty, zoomTransformProperty, providedOptions );
  }
}

geometricOptics.register( 'OpticLabelNode', OpticLabelNode );