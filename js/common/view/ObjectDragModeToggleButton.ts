// Copyright 2021-2023, University of Colorado Boulder

/**
 * ObjectDragModeToggleButton is the control used to change how the optical object can be dragged. It toggles between
 * 'freeDragging' and 'horizontalDragging', and turns red when dragging is constrained to horizontal.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import lockSolidShape from '../../../../sherpa/js/fontawesome-5/lockSolidShape.js';
import unlockSolidShape from '../../../../sherpa/js/fontawesome-5/unlockSolidShape.js';
import { AlignBox, AlignGroup, HBox, HBoxOptions, NodeTranslationOptions, Path } from '../../../../scenery/js/imports.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import ButtonNode from '../../../../sun/js/buttons/ButtonNode.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import optionize, { combineOptions, EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import { ObjectDragMode } from './ObjectDragMode.js';
import ToggleNode from '../../../../sun/js/ToggleNode.js';
import RectangularToggleButton, { RectangularToggleButtonOptions } from '../../../../sun/js/buttons/RectangularToggleButton.js';
import Property from '../../../../axon/js/Property.js';

const ARROWS_SCALE = 0.65;
const LOCK_SCALE = 0.045;
const UNLOCKED_FILL = 'black';
const LOCKED_FILL = PhetColorScheme.RED_COLORBLIND;

type SelfOptions = EmptySelfOptions;

type DragLockedButtonOptions = SelfOptions &
  PickRequired<RectangularToggleButtonOptions, 'tandem'> &
  NodeTranslationOptions;

export default class ObjectDragModeToggleButton extends RectangularToggleButton<ObjectDragMode> {

  /**
   * @param objectDragModeProperty - constrains how an optical object can be dragged
   * @param providedOptions
   */
  public constructor( objectDragModeProperty: Property<ObjectDragMode>, providedOptions?: DragLockedButtonOptions ) {

    // To make both icons have the same effective size
    const alignBoxOptions = {
      group: new AlignGroup()
    };

    const hBoxOptions = {
      spacing: 6
    };

    // 4-way arrow to indicate free dragging
    const freeDraggingNode = new AlignBox( new HBox( combineOptions<HBoxOptions>( {}, hBoxOptions, {
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
    } ) ), alignBoxOptions );

    // horizontal 2-way arrow to indicate horizontal dragging
    const horizontalDragNode = new AlignBox( new HBox( combineOptions<HBoxOptions>( {}, hBoxOptions, {
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
    } ) ), alignBoxOptions );

    const options = optionize<DragLockedButtonOptions, SelfOptions, RectangularToggleButtonOptions>()( {

      // RectangularToggleButton options
      content: new ToggleNode<ObjectDragMode>( objectDragModeProperty, [
        { value: 'freeDragging', createNode: () => freeDraggingNode },
        { value: 'horizontalDragging', createNode: () => horizontalDragNode }
      ] ),
      baseColor: 'transparent',
      disabledColor: 'transparent',
      buttonAppearanceStrategy: ButtonNode.FlatAppearanceStrategy,

      // Node options
      cursor: 'pointer',
      touchAreaXDilation: 5,
      touchAreaYDilation: 5,
      mouseAreaXDilation: 5,
      mouseAreaYDilation: 5,
      phetioEnabledPropertyInstrumented: false
    }, providedOptions );

    super( objectDragModeProperty, 'freeDragging', 'horizontalDragging', options );

    objectDragModeProperty.link( objectDragMode => {
      freeDraggingNode.visible = ( objectDragMode === 'freeDragging' );
      horizontalDragNode.visible = ( objectDragMode === 'horizontalDragging' );
    } );
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'ObjectDragModeToggleButton', ObjectDragModeToggleButton );