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
  focalLengthMagnitudeRange: RangeWithValue
  indexOfRefractionRange: RangeWithValue,

  // phet-io
  tandem: Tandem
};

class DirectFocalLengthModel extends PhetioObject implements FocalLengthModel {

  readonly radiusOfCurvatureMagnitudeProperty: IReadOnlyProperty<number>;
  readonly indexOfRefractionProperty: NumberProperty;
  readonly focalLengthMagnitudeProperty: NumberProperty;

  constructor( opticShapeProperty: IReadOnlyProperty<OpticShape>, providedOptions: DirectFocalLengthModelOptions ) {

    const options = merge( {
      phetioState: false,
      phetioDocumentation: 'Model of focal length where:<br>' +
                           '- focal length is settable<br>' +
                           '- index of refraction is fixed<br> + ' +
                           '- radius of curvature is derived'
    }, providedOptions );

    super( options );

    this.focalLengthMagnitudeProperty = new NumberProperty( options.focalLengthMagnitudeRange.defaultValue, {
      units: 'cm',
      range: options.focalLengthMagnitudeRange,
      tandem: options.tandem.createTandem( 'focalLengthMagnitudeProperty' ),
      phetioDocumentation: 'magnitude of the focal length, absent the sign that determines whether the optic is converging or diverging'
    } );

    // fixed value
    this.indexOfRefractionProperty = new NumberProperty( options.indexOfRefractionRange.defaultValue, {
      range: options.indexOfRefractionRange,
      // units: unitless
      tandem: options.tandem.createTandem( 'indexOfRefractionProperty' ),
      phetioReadOnly: true
    } );

    this.radiusOfCurvatureMagnitudeProperty = new DerivedProperty(
      [ opticShapeProperty, this.focalLengthMagnitudeProperty, this.indexOfRefractionProperty ],
      ( opticShape: OpticShape, focalLengthMagnitude: number, indexOfRefraction: number ) =>
        focalLengthMagnitude * ( 2 * ( indexOfRefraction - 1 ) ), {
        units: 'cm',
        tandem: options.tandem.createTandem( 'radiusOfCurvatureMagnitudeProperty' ),
        phetioDocumentation: 'magnitude of the radius of curvature, absent the sign that determines whether ' +
                             'the vertex lies to the left or right of the center of curvature',
        phetioType: DerivedProperty.DerivedPropertyIO( NumberIO )
      } );
  }

  reset() {
    this.focalLengthMagnitudeProperty.reset();
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