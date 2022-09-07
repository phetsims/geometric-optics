// Copyright 2022, University of Colorado Boulder

/**
 * OpticalObjectLabelNode is the base class of labeling optical objects.
 * It can label them as simply 'Object', or it can number them like 'Object 1'.
 * Numbering is dynamic to support PhET-iO.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
import LabelNode, { LabelNodeOptions } from './LabelNode.js';
import GeometricOpticsStrings from '../../../GeometricOpticsStrings.js';
import geometricOptics from '../../../geometricOptics.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import StringIO from '../../../../../tandem/js/types/StringIO.js';

type SelfOptions = {

  // Whether the object should be numbered, like 'Object 1'
  isNumberedProperty?: TReadOnlyProperty<boolean>;
};

export type OpticalObjectLabelNodeOptions = SelfOptions & LabelNodeOptions;

export default class OpticalObjectLabelNode extends LabelNode {

  /**
   * @param objectNumber - each optical object has a unique integer, used to label it
   * @param labelPositionProperty - position of the label
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param providedOptions
   */
  public constructor( objectNumber: number,
                      labelPositionProperty: TReadOnlyProperty<Vector2>,
                      zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      providedOptions: OpticalObjectLabelNodeOptions ) {

    const options = optionize<OpticalObjectLabelNodeOptions, SelfOptions, LabelNodeOptions>()( {
      isNumberedProperty: new BooleanProperty( true )
    }, providedOptions );

    const labelStringProperty = new DerivedProperty( [
      options.isNumberedProperty,
      GeometricOpticsStrings.label.objectStringProperty,
      GeometricOpticsStrings.label.objectNStringProperty
    ], (
      isNumbered: boolean,
      objectString: string,
      objectNString: string
    ) => isNumbered ? StringUtils.fillIn( objectNString, { objectNumber: objectNumber } ) : objectString, {
      tandem: options.tandem.createTandem( 'labelStringProperty' ),
      phetioValueType: StringIO
    } );

    super( labelStringProperty, labelPositionProperty, zoomTransformProperty, options );
  }
}

geometricOptics.register( 'OpticalObjectLabelNode', OpticalObjectLabelNode );