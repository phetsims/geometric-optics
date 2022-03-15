// Copyright 2021-2022, University of Colorado Boulder

/**
 * CueingArrowsNode is the cueing arrows used to indicate that something can be dragged in some direction.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import geometricOptics from '../../geometricOptics.js';
import { Path, PathOptions } from '../../../../scenery/js/imports.js';
import ArrowShape from '../../../../scenery-phet/js/ArrowShape.js';
import { Shape } from '../../../../kite/js/imports.js';
import GOConstants from '../GOConstants.js';
import optionize from '../../../../phet-core/js/optionize.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import GOGlobalOptions from '../GOGlobalOptions.js';
import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import IReadOnlyProperty from '../../../../axon/js/IReadOnlyProperty.js';

type CueingArrowsDirection = 'horizontal' | 'vertical' | 'both';

type SelfOptions = {
  direction?: CueingArrowsDirection;
  length?: number;
};

type CueingArrowsNodeOptions = SelfOptions &
  PickOptional<PathOptions, 'fill' | 'stroke' | 'scale' | 'visibleProperty' | 'left' | 'centerY'>;

class CueingArrowsNode extends Path {

  // length of the arrows, from tip to tip
  private readonly length: number;

  /**
   * @param providedOptions
   */
  constructor( providedOptions?: CueingArrowsNodeOptions ) {

    const options = optionize<CueingArrowsNodeOptions, SelfOptions, PathOptions>( {

      // CueingArrowsNodeOptions
      direction: 'both',
      length: 35,

      // PathOptions
      fill: 'rgb( 0, 200, 0 )',
      stroke: 'black'

    }, providedOptions );

    super( createArrowsShape( options.direction, options.length ), options );

    this.length = options.length;

    this.boundsProperty.link( () => {
      this.touchArea = this.localBounds.dilated( 5 );
      this.mouseArea = this.localBounds.dilated( 3 );
    } );
  }

  public setDirection( direction: CueingArrowsDirection ): void {
    this.shape = createArrowsShape( direction, this.length );
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  /**
   * Common method of creating the visibleProperty for cueing arrows when they are associated with a draggable Node.
   * @param inputEnabledProperty - is input enabled for the associated Node?
   * @param wasDraggedProperty - has the associated Node been dragged?
   */
  static createVisibleProperty( inputEnabledProperty: IReadOnlyProperty<boolean>, wasDraggedProperty: IReadOnlyProperty<boolean> ) {
    return new DerivedProperty(
      [ GOGlobalOptions.cueingArrowsEnabledProperty, inputEnabledProperty, wasDraggedProperty ],
      ( cueingArrowsEnabled: boolean, inputEnabled: boolean, wasDragged: boolean ) =>
        ( cueingArrowsEnabled && inputEnabled && !wasDragged ) );
  }
}

function createArrowsShape( direction: CueingArrowsDirection, length: number ): Shape {

  const arrowShapeOptions = optionize<ArrowNodeOptions, {}, ArrowNodeOptions>( {
    doubleHead: true
  }, GOConstants.CUEING_ARROW_SHAPE_OPTIONS );

  let shape;
  if ( direction === 'horizontal' ) {
    shape = new ArrowShape( -length / 2, 0, length / 2, 0, arrowShapeOptions );
  }
  else if ( direction === 'vertical' ) {
    shape = new ArrowShape( 0, -length / 2, 0, length / 2, arrowShapeOptions );
  }
  else {
    const leftRightArrowShape = new ArrowShape( -length / 2, 0, length / 2, 0, arrowShapeOptions );
    const upDownArrowShape = new ArrowShape( 0, -length / 2, 0, length / 2, arrowShapeOptions );
    shape = Shape.union( [ leftRightArrowShape, upDownArrowShape ] );
  }
  return shape;
}

geometricOptics.register( 'CueingArrowsNode', CueingArrowsNode );
export default CueingArrowsNode;