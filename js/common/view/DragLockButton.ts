// Copyright 2021, University of Colorado Boulder

/**
 * DragLockButton is the control used to lock dragging of the source object and light source, so
 * that it's only draggable in the horizontal dimension.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import geometricOptics from '../../geometricOptics.js';
import arrowsAltSolidString from '../../../../sherpa/js/fontawesome-5/arrowsAltSolidString.js';
import arrowsAltHSolidString from '../../../../sherpa/js/fontawesome-5/arrowsAltHSolidString.js';
import lockSolidString from '../../../../sherpa/js/fontawesome-5/lockSolidString.js';
import unlockSolidString from '../../../../sherpa/js/fontawesome-5/unlockSolidString.js';
import { HBox, NodeOptions, Path, PressListener } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';

type Options = {
  tandem: Tandem
} & NodeOptions; //TODO https://github.com/phetsims/scenery/issues/1332 limit to Node translation options

class DragLockButton extends ToggleNode {

  /**
   * @param dragLockedProperty
   * @param providedOptions
   */
  constructor( dragLockedProperty: Property<boolean>, providedOptions?: Options ) {

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
        new Path( arrowsAltSolidString, pathOptions ),
        new Path( unlockSolidString, pathOptions )
      ]
    }, hBoxOptions ) );

    const lockedNode = new HBox( merge( {
      children: [
        new Path( arrowsAltHSolidString, pathOptions ),
        new Path( lockSolidString, pathOptions )
      ]
    }, hBoxOptions ) );

    super( dragLockedProperty, [
      { value: true, node: lockedNode },
      { value: false, node: unlockedNode }
    ], options );

    dragLockedProperty.link( locked => {
      fillProperty.value = locked ? 'red' : 'black';
    } );

    this.addInputListener( new PressListener( {
      release: () => {
        dragLockedProperty.value = !dragLockedProperty.value;
      }
    } ) );

    this.mouseArea = this.localBounds.dilatedXY( 5, 5 );
    this.touchArea = this.localBounds.dilatedXY( 5, 5 );
  }
}

geometricOptics.register( 'DragLockButton', DragLockButton );
export default DragLockButton;