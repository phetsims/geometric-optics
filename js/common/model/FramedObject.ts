// Copyright 2021-2022, University of Colorado Boulder

/**
 * FramedObject is the model for the "framed objects". These are objects in a picture frame, with 3D perspective.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import OpticalObjectChoice, { ObjectHTMLImageElements } from './OpticalObjectChoice.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import HTMLImageElementObject, { HTMLImageElementObjectOptions } from './HTMLImageElementObject.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';

// x should be 1/2 of PNG file width. y should be the tip of the pencil. +x right, +y down.
const ORIGIN_OFFSET = new Vector2( 68.5, 100 );

// Scale that will be applied to .png files for all framed objects.
const SCALE_FACTOR = 0.25;

type FramedObjectOptions = PickRequired<HTMLImageElementObjectOptions, 'position' | 'tandem'>;

export default class FramedObject extends HTMLImageElementObject {

  // HTMLImageElements (PNG files) used to draw this framed object and its associated image
  public readonly objectHTMLImageElementsProperty: TReadOnlyProperty<ObjectHTMLImageElements>;

  /**
   * @param opticalObjectNumber - positive integer used when labeling this object
   * @param opticPositionProperty
   * @param opticalObjectChoiceProperty
   * @param providedOptions
   */
  public constructor( opticalObjectNumber: number,
                      opticPositionProperty: TReadOnlyProperty<Vector2>,
                      opticalObjectChoiceProperty: EnumerationProperty<OpticalObjectChoice>,
                      providedOptions: FramedObjectOptions ) {

    const objectHTMLImageElementsProperty = new DerivedProperty(
      [ opticalObjectChoiceProperty ], opticalObjectChoice => {
        let objectHTMLImageElements = opticalObjectChoice.objectHTMLImageElements;

        // If the object choice isn't a framed object, fallback to PENCIL.
        if ( !objectHTMLImageElements ) {
          assert && assert( OpticalObjectChoice.PENCIL.objectHTMLImageElements );
          objectHTMLImageElements = OpticalObjectChoice.PENCIL.objectHTMLImageElements!;
        }

        return objectHTMLImageElements;
      }
    );

    const htmlImageElementProperty = new DerivedProperty( [ objectHTMLImageElementsProperty ],
      objectHTMLImageElements => objectHTMLImageElements.rightFacingUpright );

    super( opticalObjectNumber, opticPositionProperty, htmlImageElementProperty, ORIGIN_OFFSET, SCALE_FACTOR, providedOptions );

    this.objectHTMLImageElementsProperty = objectHTMLImageElementsProperty;
  }
}

geometricOptics.register( 'FramedObject', FramedObject );