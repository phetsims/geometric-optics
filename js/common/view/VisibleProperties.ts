// Copyright 2021-2022, University of Colorado Boulder

/**
 * VisibleProperties contains visibleProperty instances for things in the view. These Properties are controlled
 * by checkboxes and toggle buttons.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Property from '../../../../axon/js/Property.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import geometricOptics from '../../geometricOptics.js';

type VisiblePropertiesOptions = {
  tandem: Tandem
};

class VisibleProperties {

  // visibility of the focal points (F)
  readonly focalPointsVisibleProperty: Property<boolean>;

  // visibility of the 2F points
  readonly twoFPointsVisibleProperty: Property<boolean>;

  // visibility of the virtual Image, when present
  readonly virtualImageVisibleProperty: Property<boolean>;

  // visibility of the labels
  readonly labelsVisibleProperty: Property<boolean>;

  // visibility of the second 'point' (point of interest on object, or light source)
  readonly secondPointVisibleProperty: Property<boolean>;

  // visibility of the guides, which are irrelevant for mirror
  readonly guidesVisibleProperty: Property<boolean>;

  // visibility of the ray tracing
  readonly raysAndImagesVisibleProperty: Property<boolean>;

  /**
   * @param isLens
   * @param providedOptions
   */
  constructor( isLens: boolean, providedOptions: VisiblePropertiesOptions ) {

    this.focalPointsVisibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'focalPointsVisibleProperty' )
    } );

    this.twoFPointsVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'twoFPointsVisibleProperty' )
    } );

    this.virtualImageVisibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'virtualImageVisibleProperty' )
    } );

    this.labelsVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'labelsVisibleProperty' )
    } );

    this.secondPointVisibleProperty = new BooleanProperty( false, {
      tandem: providedOptions.tandem.createTandem( 'secondPointVisibleProperty' )
    } );

    this.guidesVisibleProperty = new BooleanProperty( false, {
      validValues: isLens ? [ true, false ] : [ false ],
      tandem: providedOptions.tandem.createTandem( 'guidesVisibleProperty' )
    } );

    this.raysAndImagesVisibleProperty = new BooleanProperty( true, {
      tandem: providedOptions.tandem.createTandem( 'raysAndImagesVisibleProperty' )
    } );
  }

  public reset(): void {
    this.focalPointsVisibleProperty.reset();
    this.twoFPointsVisibleProperty.reset();
    this.virtualImageVisibleProperty.reset();
    this.labelsVisibleProperty.reset();
    this.secondPointVisibleProperty.reset();
    this.guidesVisibleProperty.reset();
    this.raysAndImagesVisibleProperty.reset();
  }
}

geometricOptics.register( 'VisibleProperties', VisibleProperties );
export default VisibleProperties;