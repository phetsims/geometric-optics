// Copyright 2022, University of Colorado Boulder

/**
 * OpticalImageNode is the view base class for all optical images.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import OpticalImage from '../model/OpticalImage.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import optionize from '../../../../phet-core/js/optionize.js';
import BooleanIO from '../../../../tandem/js/types/BooleanIO.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type SelfOptions = {};

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
                         virtualImageVisibleProperty: IReadOnlyProperty<boolean>,
                         lightPropagationEnabledProperty: IReadOnlyProperty<boolean>,
                         objectVisibleProperty: IReadOnlyProperty<boolean>,
                         providedOptions: OpticalImageNodeOptions ) {

    const options = optionize<OpticalImageNodeOptions, SelfOptions, NodeOptions>()( {
      visibleProperty: new DerivedProperty(
        [ opticalImage.visibleProperty, opticalImage.opticalImageTypeProperty, virtualImageVisibleProperty,
          lightPropagationEnabledProperty, objectVisibleProperty ],
        ( imageVisible, opticalImageType, virtualImageVisible,
          lightPropagationEnabled, objectVisible ) => {
          return ( imageVisible && ( opticalImageType === 'real' || virtualImageVisible ) &&
                   lightPropagationEnabled && objectVisible );
        }, {
          tandem: providedOptions.tandem.createTandem( 'visibleProperty' ),
          phetioType: DerivedProperty.DerivedPropertyIO( BooleanIO )
        } )
    }, providedOptions );

    super( options );

    this.addLinkedElement( opticalImage, {
      tandem: providedOptions.tandem.createTandem( opticalImage.tandem.name )
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalImageNode', OpticalImageNode );