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
import Bounds2 from '../../../../dot/js/Bounds2.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';
import OpticalObject, { OpticalObjectOptions } from './OpticalObject.js';
import OpticalObjectChoice, { ObjectHTMLImageElements } from './OpticalObjectChoice.js';
import EnumerationProperty from '../../../../axon/js/EnumerationProperty.js';
import { PickRequired } from '../../../../phet-core/js/types/PickRequired.js';

type FramedObjectOptions = PickRequired<OpticalObjectOptions, 'position' | 'tandem'>;

class FramedObject extends OpticalObject {

  // HTMLImageElements used to draw this framed object and its associated image
  public readonly objectHTMLImageElementsProperty: IReadOnlyProperty<ObjectHTMLImageElements>;

  // Where the point-of-interest is relative to the left-top corner of PNG files for framed objects.
  // This is specific to the object PNG files, and must be uniform for all object PNG files.
  // model bounds of this framed object's visual representation
  public readonly boundsProperty: IReadOnlyProperty<Bounds2>;

  // x should be 1/2 of PNG file width. y should be the tip of the pencil. +x right, +y down.
  public static ORIGIN_OFFSET = new Vector2( 68.5, 100 );

  // View-to-model scale for associated HTMLImageElement
  public static SCALE_FACTOR = 0.25;

  /**
   * @param opticalObjectNumber - positive integer used when labeling this object
   * @param opticPositionProperty
   * @param opticalObjectChoiceProperty
   * @param providedOptions
   */
  constructor( opticalObjectNumber: number,
               opticPositionProperty: IReadOnlyProperty<Vector2>,
               opticalObjectChoiceProperty: EnumerationProperty<OpticalObjectChoice>,
               providedOptions: FramedObjectOptions ) {

    super( opticalObjectNumber, opticPositionProperty, providedOptions );

    this.objectHTMLImageElementsProperty = new DerivedProperty(
      [ opticalObjectChoiceProperty ], ( opticalObjectChoice: OpticalObjectChoice ) => {
        let objectHTMLImageElements = opticalObjectChoice.objectHTMLImageElements;

        // If the object choice isn't a framed object, first fallback is to keep our current value.
        if ( !objectHTMLImageElements && this.objectHTMLImageElementsProperty ) {
          objectHTMLImageElements = this.objectHTMLImageElementsProperty.value;
        }

        // If we didn't have a current value, second fallback is PENCIL.
        if ( !objectHTMLImageElements ) {
          assert && assert( OpticalObjectChoice.PENCIL.objectHTMLImageElements );
          objectHTMLImageElements = OpticalObjectChoice.PENCIL.objectHTMLImageElements!;
        }

        return objectHTMLImageElements;
      }
    );

    this.boundsProperty = new DerivedProperty(
      [ this.objectHTMLImageElementsProperty, this.positionProperty ],
      ( htmlImageElements: ObjectHTMLImageElements, position: Vector2 ) =>
        OpticalObject.computeBounds( htmlImageElements.rightFacingUpright, position,
          FramedObject.SCALE_FACTOR, FramedObject.ORIGIN_OFFSET ), {

        // Because changing objectHTMLImageElementsProperty may necessitate changing positionProperty to move
        // the Object inside the view's drag bounds, resulting in this derivation being called again.
        reentrant: true
      } );
  }
}

geometricOptics.register( 'FramedObject', FramedObject );
export default FramedObject;