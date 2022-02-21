// Copyright 2022, University of Colorado Boulder

/**
 * DirectFocalLengthModel is the model where focal length is set directly.
 * Index of refraction is fixed, and radius of curvature is derived from focal length and index of refraction.
 * See https://github.com/phetsims/geometric-optics/issues/255
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { OpticShape } from './OpticShape.js';
import FocalLengthModel from './FocalLengthModel.js';
import RangeWithValue from '../../../../dot/js/RangeWithValue.js';
import PhetioObject from '../../../../tandem/js/PhetioObject.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import merge from '../../../../phet-core/js/merge.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import geometricOptics from '../../geometricOptics.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import Tandem from '../../../../tandem/js/Tandem.js';

type DirectFocalLengthModelOptions = {
  focalLengthRange: RangeWithValue
  indexOfRefraction: number,

  // phet-io
  tandem: Tandem
};

class DirectFocalLengthModel extends PhetioObject implements FocalLengthModel {

  readonly radiusOfCurvatureProperty: IReadOnlyProperty<number>;
  readonly indexOfRefractionProperty: NumberProperty;
  readonly focalLengthProperty: NumberProperty;

  constructor( opticShapeProperty: IReadOnlyProperty<OpticShape>, providedOptions: DirectFocalLengthModelOptions ) {

    const options = merge( {
      phetioState: false,
      phetioDocumentation: 'Model of focal length where:<br>' +
                           '- focal length is settable<br>' +
                           '- index of refraction is fixed<br> + ' +
                           '- radius of curvature is derived'
    }, providedOptions );

    super( options );

    this.focalLengthProperty = new NumberProperty( options.focalLengthRange.defaultValue, {
      units: 'cm',
      range: options.focalLengthRange,
      tandem: options.tandem.createTandem( 'focalLengthProperty' )
    } );

    // fixed value
    this.indexOfRefractionProperty = new NumberProperty( options.indexOfRefraction, {
      isValidValue: ( value: number ) => ( value === options.indexOfRefraction ),
      // units: unitless
      tandem: options.tandem.createTandem( 'indexOfRefractionProperty' ),
      phetioReadOnly: true
    } );

    this.radiusOfCurvatureProperty = new DerivedProperty(
      [ opticShapeProperty, this.focalLengthProperty, this.indexOfRefractionProperty ],
      ( opticShape: OpticShape, focalLength: number, indexOfRefraction: number ) =>
        focalLength * ( 2 * ( indexOfRefraction - 1 ) ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'radiusOfCurvatureProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
  }

  reset() {
    this.focalLengthProperty.reset();
    this.indexOfRefractionProperty.reset();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'DirectFocalLengthModel', DirectFocalLengthModel );
export default DirectFocalLengthModel;
export type { DirectFocalLengthModelOptions };