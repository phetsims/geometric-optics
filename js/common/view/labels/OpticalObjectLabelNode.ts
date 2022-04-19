// Copyright 2022, University of Colorado Boulder

/**
 * OpticalObjectLabelNode is the base class of labeling optical objects.
 * It can label them as simply 'Object', or it can number them like 'Object 1'.
 * Numbering is dynamic to support PhET-iO.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
import LabelNode, { LabelNodeOptions } from './LabelNode.js';
import geometricOpticsStrings from '../../../geometricOpticsStrings.js';
import geometricOptics from '../../../geometricOptics.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import IReadOnlyProperty from '../../../../../axon/js/IReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';

type SelfOptions = {

  // Whether the object should be numbered, like 'Object 1'
  isNumberedProperty?: IReadOnlyProperty<boolean>;
};

export type OpticalObjectLabelNodeOptions = SelfOptions & Omit<LabelNodeOptions, 'phetioReadOnlyText'>;

export default class OpticalObjectLabelNode extends LabelNode {

  /**
   * @param objectNumber - each optical object has a unique integer, used to label it
   * @param labelPositionProperty - position of the label
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param providedOptions
   */
  constructor( objectNumber: number,
               labelPositionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: OpticalObjectLabelNodeOptions ) {

    const options = optionize<OpticalObjectLabelNodeOptions, SelfOptions, LabelNodeOptions>()( {
      isNumberedProperty: new BooleanProperty( true ),
      phetioReadOnlyText: true // text is readonly because the sim controls it, see below
    }, providedOptions );

    super( '', labelPositionProperty, zoomTransformProperty, options );

    const objectString = geometricOpticsStrings.label.object;
    const objectNString = StringUtils.fillIn( geometricOpticsStrings.label.objectN, {
      objectNumber: objectNumber
    } );

    options.isNumberedProperty.link( ( isNumbered: boolean ) => {
      this.setText( isNumbered ? objectNString : objectString );
    } );
  }
}

geometricOptics.register( 'OpticalObjectLabelNode', OpticalObjectLabelNode );