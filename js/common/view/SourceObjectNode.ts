// Copyright 2021, University of Colorado Boulder

/**
 * SourceObjectNode is the view of the source object and first light source.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds2 from '../../../../dot/js/Bounds2.js';
import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { DragListener } from '../../../../scenery/js/imports.js';
import { Image } from '../../../../scenery/js/imports.js';
import { Node } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import SourceObject from '../model/SourceObject.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Representation from '../model/Representation.js';
import UnconstrainedCueingArrowsNode from './UnconstrainedCueingArrowsNode.js';
import GeometricOpticsGlobalOptions from '../GeometricOpticsGlobalOptions.js';
import Tandem from '../../../../tandem/js/Tandem.js';
import merge from '../../../../phet-core/js/merge.js';

// Closest that source object can be moved to the optic, in cm. This avoid problems that occur when the object is
// too close to a mirror. See https://github.com/phetsims/geometric-optics/issues/73
const MIN_X_DISTANCE_TO_OPTIC = 40;

class SourceObjectNode extends Node {

  // so that 1st and 2nd light source can share drag bounds
  public readonly dragBoundsProperty: Property<Bounds2>;
  private readonly resetSourceObjectNode: () => void;

  /**
   * @param representationProperty
   * @param sourceObject
   * @param modelBoundsProperty
   * @param opticPositionProperty
   * @param modelViewTransform
   * @param options
   * */
  constructor( representationProperty: Property<Representation>, sourceObject: SourceObject,
               modelBoundsProperty: Property<Bounds2>, opticPositionProperty: Property<Vector2>,
               modelViewTransform: ModelViewTransform2, options?: any ) {

    options = merge( {

      // phet-io
      tandem: Tandem.REQUIRED,
      phetioInputEnabledPropertyInstrumented: true
    }, options );

    // Origin of this Node is at the upper-left corner of sourceObjectImage.
    const sourceObjectImage = new Image( representationProperty.value.rightFacingUpright );

    const cueingArrowsNode = new UnconstrainedCueingArrowsNode();

    assert && assert( !options.children );
    options.children = [ sourceObjectImage, cueingArrowsNode ];

    super( options );

    // Keep cueing arrows next to the source object.
    sourceObjectImage.boundsProperty.link( ( bounds: Bounds2 ) => {
      cueingArrowsNode.right = sourceObjectImage.left - 10;
      cueingArrowsNode.centerY = sourceObjectImage.centerY;
    } );

    // Scale the source object.
    const scaleSourceObject = (): void => {

      const initialWidth = sourceObjectImage.width;
      const initialHeight = sourceObjectImage.height;

      const bounds = sourceObject.boundsProperty.value;
      const viewBounds = modelViewTransform.modelToViewBounds( bounds );

      const scaleX = viewBounds.width / initialWidth;
      const scaleY = viewBounds.height / initialHeight;
      sourceObjectImage.scale( scaleX, scaleY );
    };

    // Translate the source object to the specified position.
    // This Node's origin is at the left-top of sourceObjectImage, so set translation.
    const translateSourceObject = ( leftTop: Vector2 ): void => {
      this.translation = modelViewTransform.modelToViewPosition( leftTop );
    };

    // {DerivedProperty.<Bounds2} keep at least half of the projection screen within visible bounds and right of the optic.
    // opticPositionProperty is not a dependency because it only moves in the y dimension, so x is constant.
    //TODO This is problematic. There's no dependency on representationProperty here. The actual dependency is on
    // sourceObject.boundsProperty, and we're relying on that changing before this value is derived. But changing
    // the dependency to sourceObject.boundsProperty results in a reentry assertion failure.
    this.dragBoundsProperty = new DerivedProperty<Bounds2>(
      [ modelBoundsProperty, representationProperty ],
      ( modelBounds: Bounds2, representation: Representation ) =>
        new Bounds2(
          modelBounds.minX,
          modelBounds.minY + sourceObject.boundsProperty.value.height,
          opticPositionProperty.value.x - sourceObject.boundsProperty.value.width / 2 - MIN_X_DISTANCE_TO_OPTIC,
          modelBounds.maxY
        )
    );
    this.dragBoundsProperty.link( dragBounds => {
      sourceObject.leftTopProperty.value = dragBounds.closestPointTo( sourceObject.leftTopProperty.value );
    } );

    // create drag listener for source
    const sourceObjectDragListener = new DragListener( {
      pressCursor: 'pointer',
      useInputListenerCursor: true,
      positionProperty: sourceObject.leftTopProperty,
      transform: modelViewTransform,
      dragBoundsProperty: this.dragBoundsProperty,
      drag: () => {
        cueingArrowsNode.visible = false;
      }
    } );
    this.addInputListener( sourceObjectDragListener );

    sourceObject.leftTopProperty.link( leftTop => {
      scaleSourceObject();
      translateSourceObject( leftTop );
    } );

    representationProperty.link( representation => {
      sourceObjectImage.image = representation.rightFacingUpright;
      scaleSourceObject();
      translateSourceObject( sourceObject.leftTopProperty.value );
    } );

    Property.multilink(
      [ GeometricOpticsGlobalOptions.cueingArrowsEnabledProperty, this.inputEnabledProperty ],
      ( cueingArrowsEnabled: boolean, inputEnabled: boolean ) => {
        cueingArrowsNode.visible = ( cueingArrowsEnabled && inputEnabled );
      }
    );

    this.resetSourceObjectNode = (): void => {
      cueingArrowsNode.visible = ( GeometricOpticsGlobalOptions.cueingArrowsEnabledProperty.value &&
                                   this.inputEnabledProperty.value );
    };
  }

  public dispose(): void {
    assert && assert( false, 'dispose is not supported, exists for the lifetime of the sim' );
    super.dispose();
  }

  public reset(): void {
    this.resetSourceObjectNode();
  }
}

geometricOptics.register( 'SourceObjectNode', SourceObjectNode );
export default SourceObjectNode;