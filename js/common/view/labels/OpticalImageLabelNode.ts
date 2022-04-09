// Copyright 2022, University of Colorado Boulder

/**
 * OpticalImageLabelNode is the base class of labeling optical images, and distinguishes between real and virtual.
 * It can label them as simply 'Real Image', or it can number them like 'Real Image 1'.
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
import OpticalImage from '../../model/OpticalImage.js';
import { OpticalImageType } from '../../model/OpticalImageType.js';
import Property from '../../../../../axon/js/Property.js';

type SelfOptions = {

  // Whether the object should be numbered, like 'Object 1'
  isNumberedProperty?: IReadOnlyProperty<boolean>;
};

export type OpticalImageLabelNodeOptions = SelfOptions & Omit<LabelNodeOptions, 'phetioReadOnlyText'>;

export default class OpticalImageLabelNode extends LabelNode {

  /**
   * @param opticalImage - the optical image to label
   * @param labelPositionProperty - the position of the label
   * @param zoomTransformProperty - model-view transform that the user controls by zooming in/out
   * @param providedOptions
   */
  constructor( opticalImage: OpticalImage,
               labelPositionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               providedOptions: OpticalImageLabelNodeOptions ) {

    const options = optionize<OpticalImageLabelNodeOptions, SelfOptions, LabelNodeOptions>( {
      isNumberedProperty: new BooleanProperty( true ),
      phetioReadOnlyText: true // text is readonly because the sim controls it, see below
    }, providedOptions );

    super( '', labelPositionProperty, zoomTransformProperty, options );

    const stringParams = { imageNumber: opticalImage.opticalObject.opticalObjectNumber };
    const realImageNString = StringUtils.fillIn( geometricOpticsStrings.label.realImageN, stringParams );
    const virtualImageNString = StringUtils.fillIn( geometricOpticsStrings.label.virtualImageN, stringParams );
    const realImageString = geometricOpticsStrings.label.realImage;
    const virtualImageString = geometricOpticsStrings.label.virtualImage;

    Property.multilink( [ opticalImage.opticalImageTypeProperty, options.isNumberedProperty ],
      ( opticalImageType: OpticalImageType, isNumbered: boolean ) => {
        if ( isNumbered ) {

          // Switch between 'Real Image N' and 'Virtual Image N'
          this.setText( opticalImageType === 'real' ? realImageNString : virtualImageNString );
        }
        else {

          // Switch between 'Real Image' and 'Virtual Image'
          this.setText( opticalImageType === 'real' ? realImageString : virtualImageString );
        }
      } );
  }
}

geometricOptics.register( 'OpticalImageLabelNode', OpticalImageLabelNode );