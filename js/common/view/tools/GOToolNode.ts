// Copyright 2022-2023, University of Colorado Boulder

/**
 * GOToolNode is the abstract base class for the view of all tools.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../../axon/js/DerivedProperty.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import optionize from '../../../../../phet-core/js/optionize.js';
import PickRequired from '../../../../../phet-core/js/types/PickRequired.js';
import { DragListener, IndexedNodeIO, InteractiveHighlighting, Node, NodeOptions, PressListenerEvent } from '../../../../../scenery/js/imports.js';
import GOTool from '../../model/tools/GOTool.js';
import ToolJumpPoint from '../../model/tools/ToolJumpPoint.js';
import GOToolboxNode from './GOToolboxNode.js';
import geometricOptics from '../../../geometricOptics.js';
import PickOptional from '../../../../../phet-core/js/types/PickOptional.js';

type SelfOptions = {

  // tandem name to be used for the icon associated with this tool Node
  iconTandemName: string;
};

export type GOToolNodeOptions = SelfOptions & PickRequired<Node, 'tandem'> & PickOptional<Node, 'rotation'>;

export default abstract class GOToolNode extends InteractiveHighlighting( Node ) {

  // the icon associated with this tool, as it appears in the toolbox
  public abstract icon: Node;

  protected abstract dragListener: DragListener;

  // the toolbox that contains this tool, so the tool knows where to return to. null until setToolboxNode is called.
  public toolboxNode: GOToolboxNode | null;

  // tandem name to be used for the icon
  public readonly iconTandemName: string;

  // positions that are 'interesting' to measure, for the 'J' hotkey
  protected jumpPoints: ToolJumpPoint[];

  // current index into jumpPoints
  protected jumpPointsIndex: number;

  /**
   * @param tool - associated model element
   * @param providedOptions
   */
  protected constructor( tool: GOTool, providedOptions: GOToolNodeOptions ) {

    const options = optionize<GOToolNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      visibleProperty: DerivedProperty.not( tool.isInToolboxProperty ), // visible when not in the toolbox
      tagName: 'div',
      focusable: true,
      phetioInputEnabledPropertyInstrumented: true,

      // Make z-ordering of tools stateful, see https://github.com/phetsims/geometric-optics/issues/431
      phetioType: IndexedNodeIO,
      phetioState: true
    }, providedOptions );

    super( options );

    this.toolboxNode = null; // to be set later via setToolboxNode
    this.iconTandemName = options.iconTandemName;
    this.jumpPoints = [];
    this.jumpPointsIndex = 0;

    this.addLinkedElement( tool, {
      tandem: options.tandem.createTandem( tool.tandem.name )
    } );
  }

  /**
   * Sets the toolbox, so the tool knows where to return to.
   */
  public setToolboxNode( toolboxNode: GOToolboxNode ): void {
    this.toolboxNode = toolboxNode;
  }

  /**
   * Forwards an event from the toolbox to start dragging this Node.
   */
  public startDrag( event: PressListenerEvent ): void {
    this.dragListener.press( event, this );
  }

  /**
   * Sets the jump points used by the 'J' hotkey.
   */
  public setJumpPoints( jumpPoints: ToolJumpPoint[] ): void {
    this.jumpPoints = jumpPoints;
    this.jumpPointsIndex = 0;
  }

  /**
   * Handles the 'J' (Jump) hotkey, which moves the ruler to the next 'interesting' point.
   */
  public abstract jumpToPoint(): void;

  public override dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Gets the next jump point, based on the current position of the tool.
   * @param jumpPoints
   * @param toolPosition
   * @param map - optional function for mapping jump points to new positions
   */
  protected static getNextJumpPoint( jumpPoints: ToolJumpPoint[], toolPosition: Vector2,
                                  map?: ( points: Vector2[] ) => Vector2[] ): Vector2 | null {

    let nextPoint: Vector2 | undefined;

    // Extract just the position values.
    let points: Vector2[] = jumpPoints.map( jumpPoint => jumpPoint.positionProperty.value );

    // Sort positions left-to-right, by increasing x coordinate.
    points = _.sortBy( points, point => point.x );

    // Apply optional map function.
    if ( map ) {
      points = map( points );
    }

    // Find the tool's position in the array of points.
    // Use _.findLast so that the tool doesn't get stuck when there are points that are the "same".
    // See https://github.com/phetsims/geometric-optics/issues/413
    const thisPoint = _.findLast( points, point => point.equals( toolPosition ) );

    if ( thisPoint ) {

      // If the tool is at one of the jump points, and there's more than 1 jump point, then
      // get the next jump point by searching for where we're current at in the array (with wrap-around).
      if ( points.length > 1 ) {
        let nextIndex = points.indexOf( thisPoint ) + 1;
        if ( nextIndex > points.length - 1 ) {
          nextIndex = 0;
        }
        nextPoint = points[ nextIndex ];
      }
    }
    else {

      // If the tool is not one of the jump points, then find the next jump point that is to the right of
      // the tool (with wrap-around).
      nextPoint = _.find( points, position => position.x > toolPosition.x );
      if ( !nextPoint ) {
        const leftmostPosition = points[ 0 ];
        if ( !leftmostPosition.equals( toolPosition ) ) {
          nextPoint = leftmostPosition;
        }
      }
    }

    return nextPoint || null;
  }
}

geometricOptics.register( 'GOToolNode', GOToolNode );