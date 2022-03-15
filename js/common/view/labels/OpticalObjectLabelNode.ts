// Copyright 2021-2022, University of Colorado Boulder

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

export type OpticalObjectLabelNodeOptions = SelfOptions & LabelNodeOptions;

class OpticalObjectLabelNode extends LabelNode {

  /**
   * @param objectNumber
   * @param labelPositionProperty
   * @param zoomTransformProperty
   * @param providedOptions
   */
  constructor( objectNumber: number,
               labelPositionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions?: OpticalObjectLabelNodeOptions ) {

    const options = optionize<OpticalObjectLabelNodeOptions, SelfOptions, LabelNodeOptions>( {
      isNumberedProperty: new BooleanProperty( true )
    }, providedOptions );

    super( '', labelPositionProperty, zoomTransformProperty, options );

    options.isNumberedProperty.link( ( isNumbered: boolean ) => {
      if ( isNumbered ) {

        // Object N
        this.setText( StringUtils.fillIn( geometricOpticsStrings.label.objectN, {
          objectNumber: objectNumber
        } ) );
      }
      else {

        // Object
        this.setText( geometricOpticsStrings.label.object );
      }
    } );
  }
}

geometricOptics.register( 'OpticalObjectLabelNode', OpticalObjectLabelNode );
export default OpticalObjectLabelNode;