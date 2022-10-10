// Copyright 2022, University of Colorado Boulder

/**
 * OpticalObjectNode is the view base class for all optical objects.  It's primary responsibility is for cueing arrows,
 * which are common to all optical objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import TReadOnlyProperty from '../../../../axon/js/TReadOnlyProperty.js';
import { InteractiveHighlighting, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import CueingArrowsNode from './CueingArrowsNode.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../phet-core/js/types/PickRequired.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { ObjectDragMode } from './ObjectDragMode.js';
import OpticalObject from '../model/OpticalObject.js';
import TProperty from '../../../../axon/js/TProperty.js';

type SelfOptions = EmptySelfOptions;

export type OpticalObjectNodeOptions = SelfOptions &
  PickRequired<NodeOptions, 'tandem'> &
  PickOptional<NodeOptions, 'visibleProperty'>;

export default class OpticalObjectNode extends InteractiveHighlighting( Node ) {

  private readonly wasDraggedProperty: TProperty<boolean>;
  protected readonly cueingArrowsNode: CueingArrowsNode;

  /**
   * @param opticalObject - model element
   * @param objectDragModeProperty - constrains how an optical object can be dragged
   * @param wasDraggedProperty - was this optical object dragged?
   * @param providedOptions
   */
  protected constructor( opticalObject: OpticalObject,
                         objectDragModeProperty: TReadOnlyProperty<ObjectDragMode>,
                         wasDraggedProperty: TProperty<boolean>,
                         providedOptions: OpticalObjectNodeOptions ) {

    const options = optionize<OpticalObjectNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      tagName: 'div',
      focusable: true,
      phetioVisiblePropertyInstrumented: false,
      phetioInputEnabledPropertyInstrumented: true
    }, providedOptions );

    super( options );

    this.wasDraggedProperty = wasDraggedProperty;

    this.cueingArrowsNode = new CueingArrowsNode( {
      visibleProperty: CueingArrowsNode.createVisibleProperty( this.inputEnabledProperty, wasDraggedProperty )
    } );
    this.addChild( this.cueingArrowsNode );

    // Update cursor and cueing arrows to reflect how this Node is draggable.
    objectDragModeProperty.link( objectDragMode => {
      if ( objectDragMode === 'freeDragging' ) {
        this.cursor = 'pointer';
        this.cueingArrowsNode.setDirection( 'both' );
      }
      else {

        // horizontal dragging
        this.cursor = 'ew-resize';
        this.cueingArrowsNode.setDirection( 'horizontal' );
      }
    } );

    this.addLinkedElement( opticalObject, {
      tandem: options.tandem.createTandem( opticalObject.tandem.name )
    } );
  }

  /**
   * Called by drag listeners when this Node is dragged.
   */
  protected drag(): void {
    this.wasDraggedProperty.value = true;
  }

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }
}

geometricOptics.register( 'OpticalObjectNode', OpticalObjectNode );