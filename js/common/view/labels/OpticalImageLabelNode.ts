// Copyright 2022, University of Colorado Boulder

/**
 * OpticalImageLabelNode is the base class of labeling optical images, and distinguishes between real and virtual.
 * It can label them as simply 'Real Image', or it can number them like 'Real Image 1'.
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
import OpticalImage from '../../model/OpticalImage.js';
import StringIO from '../../../../../tandem/js/types/StringIO.js';
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';

type SelfOptions = {

  // Whether the object should be numbered, like 'Object 1'
  isNumberedProperty?: TReadOnlyProperty<boolean>;
};

export type OpticalImageLabelNodeOptions = SelfOptions & LabelNodeOptions;

export default class OpticalImageLabelNode extends LabelNode {

  /**
   * @param opticalImage - the optical image to label
   * @param labelPositionProperty - the position of the label
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param providedOptions
   */
  public constructor( opticalImage: OpticalImage,
                      labelPositionProperty: TReadOnlyProperty<Vector2>,
                      zoomTransformProperty: TReadOnlyProperty<ModelViewTransform2>,
                      providedOptions: OpticalImageLabelNodeOptions ) {

    const options = optionize<OpticalImageLabelNodeOptions, SelfOptions, LabelNodeOptions>()( {
      isNumberedProperty: new BooleanProperty( true )
    }, providedOptions );

    const labelStringProperty = new DerivedProperty( [
      opticalImage.opticalImageTypeProperty,
      options.isNumberedProperty,
      GeometricOpticsStrings.label.realImageStringProperty,
      GeometricOpticsStrings.label.realImageNStringProperty,
      GeometricOpticsStrings.label.virtualImageStringProperty,
      GeometricOpticsStrings.label.virtualImageNStringProperty
    ], (
      opticalImageType,
      isNumbered,
      realImageString,
      realImageNString,
      virtualImageString,
      virtualImageNString
    ) => {
      let text: string;
      if ( isNumbered ) {

        // Switch between 'Real Image N' and 'Virtual Image N'
        const stringPattern = ( opticalImageType === 'real' ) ? realImageNString : virtualImageNString;
        text = StringUtils.fillIn( stringPattern, {
          imageNumber: opticalImage.opticalObject.opticalObjectNumber
        } );
      }
      else {

        // Switch between 'Real Image' and 'Virtual Image'
        text = ( opticalImageType === 'real' ) ? realImageString : virtualImageString;
      }
      return text;
    }, {
      tandem: options.tandem.createTandem( 'labelStringProperty' ),
      phetioValueType: StringIO
    } );

    super( labelStringProperty, labelPositionProperty, zoomTransformProperty, options );
  }
}

geometricOptics.register( 'OpticalImageLabelNode', OpticalImageLabelNode );