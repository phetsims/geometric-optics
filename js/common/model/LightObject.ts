// Copyright 2022, University of Colorado Boulder

/**
 * LightObject is an optical object that is a point light source.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import HTMLImageElementObject, { HTMLImageElementObjectOptions } from './HTMLImageElementObject.js';
import Property from '../../../../axon/js/Property.js';

// Where the point-of-interest is relative to the left-top corner of PNG files for lights.
// This value is specific to the light*.png files, and must be uniform for all light*.png files.
// This should be at the right-center of the light bulb in light*.png files. +x right, +y down.
const ORIGIN_OFFSET = new Vector2( 62, 40 );

// Scale that will be applied to all light*.png files.
const SCALE_FACTOR = 0.5;

type SelfOptions = {

  // the PNG file used to visually represent the light
  htmlImageElement: HTMLImageElement;
};

type LightObjectOptions = SelfOptions
  & PickRequired<HTMLImageElementObjectOptions, 'position' | 'tandem' | 'phetioDocumentation'>;

export default class LightObject extends HTMLImageElementObject {

  // the HTMLImageElement (PNG file) used to visually represent the light
  public readonly htmlImageElement: HTMLImageElement;

  /**
   * @param opticalObjectNumber - positive integer used when labeling this object
   * @param opticPositionProperty
   * @param providedOptions
   */
  public constructor( opticalObjectNumber: number, opticPositionProperty: TReadOnlyProperty<Vector2>, providedOptions: LightObjectOptions ) {

    const htmlImageElementProperty = new Property( providedOptions.htmlImageElement, {
      validValues: [ providedOptions.htmlImageElement ]  // LightObject has a fixed image, it does not change.
    } );

    super( opticalObjectNumber, opticPositionProperty, htmlImageElementProperty, ORIGIN_OFFSET, SCALE_FACTOR, providedOptions );

    this.htmlImageElement = htmlImageElementProperty.value;
  }
}

geometricOptics.register( 'LightObject', LightObject );