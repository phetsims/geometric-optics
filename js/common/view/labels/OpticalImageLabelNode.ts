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
import TReadOnlyProperty from '../../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../../../phetcommon/js/view/ModelViewTransform2.js';
import OpticalImage from '../../model/OpticalImage.js';
import Multilink from '../../../../../axon/js/Multilink.js';
import StrictOmit from '../../../../../phet-core/js/types/StrictOmit.js';

type SelfOptions = {

  // Whether the object should be numbered, like 'Object 1'
  isNumberedProperty?: TReadOnlyProperty<boolean>;
};

export type OpticalImageLabelNodeOptions = SelfOptions & StrictOmit<LabelNodeOptions, 'phetioReadOnlyText'>;

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
      isNumberedProperty: new BooleanProperty( true ),
      phetioReadOnlyText: true // text is readonly because the sim controls it, see below
    }, providedOptions );

    super( '', labelPositionProperty, zoomTransformProperty, options );

    const stringParams = { imageNumber: opticalImage.opticalObject.opticalObjectNumber };
    const realImageNString = StringUtils.fillIn( geometricOpticsStrings.label.realImageN, stringParams );
    const virtualImageNString = StringUtils.fillIn( geometricOpticsStrings.label.virtualImageN, stringParams );
    const realImageString = geometricOpticsStrings.label.realImage;
    const virtualImageString = geometricOpticsStrings.label.virtualImage;

    Multilink.multilink( [ opticalImage.opticalImageTypeProperty, options.isNumberedProperty ],
      ( opticalImageType, isNumbered ) => {
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