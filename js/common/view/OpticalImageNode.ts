// Copyright 2022-2023, University of Colorado Boulder

/**
 * OpticalImageNode is the view base class for all optical images.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import geometricOptics from '../../geometricOptics.js';
import OpticalImage from '../model/OpticalImage.js';

type SelfOptions = EmptySelfOptions;

export type OpticalImageNodeOptions = SelfOptions & PickRequired<NodeOptions, 'tandem'>;

export default class OpticalImageNode extends Node {

  /**
   * @param opticalImage - model element
   * @param virtualImageVisibleProperty - are virtual images visible?
   * @param lightPropagationEnabledProperty - is light propagation enabled?
   * @param objectVisibleProperty - is the optical object visible?
   * @param providedOptions
   */
  protected constructor( opticalImage: OpticalImage,
                         virtualImageVisibleProperty: TReadOnlyProperty<boolean>,
                         lightPropagationEnabledProperty: TReadOnlyProperty<boolean>,
                         objectVisibleProperty: TReadOnlyProperty<boolean>,
                         providedOptions: OpticalImageNodeOptions ) {

    const options = optionize<OpticalImageNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false,
      visibleProperty: new DerivedProperty(
        [ opticalImage.visibleProperty, opticalImage.opticalImageTypeProperty, virtualImageVisibleProperty,
          lightPropagationEnabledProperty, objectVisibleProperty ],
        ( imageVisible, opticalImageType, virtualImageVisible,
          lightPropagationEnabled, objectVisible ) => {
          return ( imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) &&
                   lightPropagationEnabled && objectVisible );
        }, {
          tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
          phetioValueType: BooleanIO
        } )
    }, providedOptions );

    super( options );

    this.addLinkedElement( opticalImage );
  }
}

geometricOptics.register( 'OpticalImageNode', OpticalImageNode );