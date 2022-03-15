// Copyright 2021-2022, University of Colorado Boulder

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
import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';

type SelfOptions = {

  // Whether the object should be numbered, like 'Object 1'
  isNumberedProperty?: IReadOnlyProperty<boolean>;
};

export type OpticalImageLabelNodeOptions = SelfOptions & LabelNodeOptions;

class OpticalImageLabelNode extends LabelNode {

  /**
   * @param opticalImage
   * @param labelPositionProperty
   * @param zoomTransformProperty
   * @param objectVisibleProperty
   * @param lightPropagationEnabledProperty
   * @param virtualImageVisibleProperty
   * @param providedOptions
   */
  constructor( opticalImage: OpticalImage,
               labelPositionProperty: IReadOnlyProperty<Vector2>,
               zoomTransformProperty: IReadOnlyProperty<ModelViewTransform2>,
               objectVisibleProperty: IReadOnlyProperty<boolean>,
               lightPropagationEnabledProperty: IReadOnlyProperty<boolean>,
               virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
               providedOptions?: OpticalImageLabelNodeOptions ) {

    const options = optionize<OpticalImageLabelNodeOptions, SelfOptions, LabelNodeOptions>( {
      isNumberedProperty: new BooleanProperty( true ),
      visibleProperty: new DerivedProperty( [
          objectVisibleProperty,
          lightPropagationEnabledProperty,
          opticalImage.visibleProperty,
          opticalImage.opticalImageTypeProperty,
          virtualImageVisibleProperty
        ],
        ( objectVisible: boolean, lightPropagationEnabled: boolean, imageVisible: boolean,
          opticalImageType: OpticalImageType, virtualImageVisible: boolean ) =>
          ( objectVisible && lightPropagationEnabled && imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) ) )
    }, providedOptions );

    super( '', labelPositionProperty, zoomTransformProperty, options );

    Property.multilink( [ opticalImage.opticalImageTypeProperty, options.isNumberedProperty ],
      ( opticalImageType: OpticalImageType, isNumbered: boolean ) => {
        if ( isNumbered ) {

          // Switch between 'Real Image N' and 'Virtual Image N'
          const stringParams = { imageNumber: opticalImage.opticalObject.opticalObjectNumber };
          this.setText( opticalImageType === 'real' ?
                        StringUtils.fillIn( geometricOpticsStrings.label.realImageN, stringParams ) :
                        StringUtils.fillIn( geometricOpticsStrings.label.virtualImageN, stringParams ) );
        }
        else {

          // Switch between 'Real Image' and 'Virtual Image'
          this.setText( opticalImageType === 'real' ?
                        geometricOpticsStrings.label.realImage :
                        geometricOpticsStrings.label.virtualImage );
        }
      } );
  }
}

geometricOptics.register( 'OpticalImageLabelNode', OpticalImageLabelNode );
export default OpticalImageLabelNode;