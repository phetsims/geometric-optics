// Copyright 2021, University of Colorado Boulder

/**
 * HorizontalDragLockButton is the control used to lock dragging of the source object and light source, so
 * that it's only draggable in the horizontal dimension.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import geometricOptics from '../../geometricOptics.js';
import arrowsAltSolidShape from '../../../../sherpa/js/fontawesome-5/arrowsAltSolidShape.js';
import arrowsAltHSolidShape from '../../../../sherpa/js/fontawesome-5/arrowsAltHSolidShape.js';
import lockSolidShape from '../../../../sherpa/js/fontawesome-5/lockSolidShape.js';
import unlockSolidShape from '../../../../sherpa/js/fontawesome-5/unlockSolidShape.js';
import { HBox, NodeOptions, Path, PressListener } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';

type Options = {
  tandem: Tandem
} & NodeOptions; //TODO https://github.com/phetsims/scenery/issues/1332 limit to Node translation options

class HorizontalDragLockButton extends ToggleNode {

  /**
   * @param horizontalDragLockedProperty
   * @param providedOptions
   */
  constructor( horizontalDragLockedProperty: Property<boolean>, providedOptions?: Options ) {

    const options = merge( {

      // Node options
      cursor: 'pointer',

      // pdom options
      tagName: 'button'
    }, providedOptions );

    const hBoxOptions = {
      spacing: 8
    };

    const fillProperty: Property<ColorDef> = new Property( 'black' );

    const pathOptions = {
      fill: fillProperty,
      scale: 0.045
    };

    const unlockedNode = new HBox( merge( {
      children: [
        new Path( arrowsAltSolidShape, pathOptions ),
        new Path( unlockSolidShape, pathOptions )
      ]
    }, hBoxOptions ) );

    const lockedNode = new HBox( merge( {
      children: [
        new Path( arrowsAltHSolidShape, pathOptions ),
        new Path( lockSolidShape, pathOptions )
      ]
    }, hBoxOptions ) );

    super( horizontalDragLockedProperty, [
      { value: true, node: lockedNode },
      { value: false, node: unlockedNode }
    ], options );

    horizontalDragLockedProperty.link( locked => {
      fillProperty.value = locked ? 'red' : 'black';
    } );

    this.addInputListener( new PressListener( {
      release: () => {
        horizontalDragLockedProperty.value = !horizontalDragLockedProperty.value;
      }
    } ) );

    this.mouseArea = this.localBounds.dilatedXY( 5, 5 );
    this.touchArea = this.localBounds.dilatedXY( 5, 5 );
  }
}

geometricOptics.register( 'HorizontalDragLockButton', HorizontalDragLockButton );
export default HorizontalDragLockButton;