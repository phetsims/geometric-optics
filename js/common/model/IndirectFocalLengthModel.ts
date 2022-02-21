// Copyright 2022, University of Colorado Boulder

/**
 * DirectFocalLengthModel is the model where focal length is set indirectly.
 * Radius of curvature and index of refraction are settable, and used to derive focal length.
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

type IndirectFocalLengthModelOptions = {
  indexOfRefractionRange: RangeWithValue,
  radiusOfCurvatureRange: RangeWithValue,

  // phet-io
  tandem: Tandem
};

class IndirectFocalLengthModel extends PhetioObject implements FocalLengthModel {

  readonly radiusOfCurvatureProperty: NumberProperty;
  readonly indexOfRefractionProperty: NumberProperty;
  readonly focalLengthProperty: IReadOnlyProperty<number>;

  constructor( opticShapeProperty: IReadOnlyProperty<OpticShape>, providedOptions: IndirectFocalLengthModelOptions ) {

    const options = merge( {
      phetioState: false,
      phetioDocumentation: 'Model of focal length where:<br>' +
                           '- radius of curvature and index of refraction are settable<br>' +
                           '- focal length is derived'
    }, providedOptions );

    super( options );

    this.radiusOfCurvatureProperty = new NumberProperty( options.radiusOfCurvatureRange.defaultValue, {
      units: 'cm',
      range: options.radiusOfCurvatureRange,
      tandem: options.tandem.createTandem( 'radiusOfCurvatureProperty' )
    } );

    this.indexOfRefractionProperty = new NumberProperty( options.indexOfRefractionRange.defaultValue, {
      // units: unitless
      range: options.indexOfRefractionRange,
      tandem: options.tandem.createTandem( 'indexOfRefractionProperty' )
    } );

    this.focalLengthProperty = new DerivedProperty(
      [ opticShapeProperty, this.radiusOfCurvatureProperty, this.indexOfRefractionProperty ],
      ( opticShape: OpticShape, radiusOfCurvature: number, indexOfRefraction: number ) =>
        radiusOfCurvature / ( 2 * ( indexOfRefraction - 1 ) ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'focalLengthProperty' ),
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
  }

  reset() {
    this.radiusOfCurvatureProperty.reset();
    this.indexOfRefractionProperty.reset();
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'IndirectFocalLengthModel', IndirectFocalLengthModel );
export default IndirectFocalLengthModel;
export type { IndirectFocalLengthModelOptions };