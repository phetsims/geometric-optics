// Copyright 2021-2022, University of Colorado Boulder

/**
 * DragLockedButton is the control used to lock dragging of the source object and light source, so
 * that it's only draggable in the horizontal dimension.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Property from '../../../../axon/js/Property.js';
import geometricOptics from '../../geometricOptics.js';
import lockSolidShape from '../../../../sherpa/js/fontawesome-5/lockSolidShape.js';
import unlockSolidShape from '../../../../sherpa/js/fontawesome-5/unlockSolidShape.js';
import { AlignBox, AlignGroup, HBox, NodeOptions, Path } from '../../../../scenery/js/imports.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import BooleanRectangularToggleButton from '../../../../sun/js/buttons/BooleanRectangularToggleButton.js';

const ARROWS_SCALE = 0.65;
const LOCK_SCALE = 0.045;
const UNLOCKED_FILL = 'black';
const LOCKED_FILL = 'red';

type Options = {
  tandem: Tandem
} & NodeOptions; //TODO https://github.com/phetsims/scenery/issues/1332 limit to Node translation options

class DragLockedButton extends BooleanRectangularToggleButton {

  /**
   * @param dragLockedProperty
   * @param providedOptions
   */
  constructor( dragLockedProperty: Property<boolean>, providedOptions?: Options ) {

    // To make both icons have the same effective size
    const alignBoxOptions = {
      group: new AlignGroup()
    };

    const hBoxOptions = {
      spacing: 6
    };

    // 4-way arrow to the left of unlocked lock
    const unlockedNode = new AlignBox( new HBox( merge( {
      children: [
        new CueingArrowsNode( {
          direction: 'both',
          fill: UNLOCKED_FILL,
          stroke: null,
          scale: ARROWS_SCALE
        } ),
        new Path( unlockSolidShape, {
          fill: UNLOCKED_FILL,
          scale: LOCK_SCALE
        } )
      ]
    }, hBoxOptions ) ), alignBoxOptions );

    // horizontal 2-way arrow to the left of locked lock
    const lockedNode = new AlignBox( new HBox( merge( {
      children: [
        new CueingArrowsNode( {
          direction: 'horizontal',
          fill: LOCKED_FILL,
          stroke: null,
          scale: ARROWS_SCALE
        } ),
        new Path( lockSolidShape, {
          fill: LOCKED_FILL,
          scale: LOCK_SCALE
        } )
      ]
    }, hBoxOptions ) ), alignBoxOptions );

    super( lockedNode, unlockedNode, dragLockedProperty, merge( {

      // BooleanRectangularToggleButton options
      baseColor: 'transparent',
      disabledColor: 'transparent',
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,

      // Node options
      cursor: 'pointer',
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 5,

      // pdom options
      tagName: 'button',

      // phet-io options
      phetioEnabledPropertyInstrumented: true
    }, providedOptions ) );

    dragLockedProperty.link( dragLocked => {
      unlockedNode.visible = !dragLocked;
      lockedNode.visible = dragLocked;
    } );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'DragLockedButton', DragLockedButton );
export default DragLockedButton;