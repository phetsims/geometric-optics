// Copyright 2021-2023, University of Colorado Boulder

/**
 * LightRaysNode is the base class for Nodes that render light rays.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Martin Veillette
 */

import ModelViewTransform2 from '../../../../phetcommon/js/view/ModelViewTransform2.js';
import { Line, LineOptions, Node, NodeOptions } from '../../../../scenery/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import { LightRaySegment } from '../model/LightRay.js';
import LightRays from '../model/LightRays.js';
import PickOptional from '../../../../phet-core/js/types/PickOptional.js';
import optionize, { EmptySelfOptions } from '../../../../phet-core/js/optionize.js';

type SelfOptions = EmptySelfOptions;

export type LightRaysNodeOptions = SelfOptions & PickOptional<NodeOptions, 'visibleProperty'>;

export default class LightRaysNode extends Node {

  /**
   * @param lightRays - model element
   * @param update - called when LightRays.raysProcessedEmitter fires
   * @param providedOptions
   */
  protected constructor( lightRays: LightRays, update: ( thisNode: Node ) => void, providedOptions: LightRaysNodeOptions ) {

    const options = optionize<LightRaysNodeOptions, SelfOptions, NodeOptions>()( {

      // NodeOptions
      isDisposable: false
    }, providedOptions );

    super( options );

    // Update this Node when the model tells us that it's time to update.
    lightRays.raysProcessedEmitter.addListener( () => update( this ) );

    update( this );
  }

  /**
   * Converts LightRaySegment[] (model) to scenery Line[] (view).
   * @param segments
   * @param modelViewTransform
   * @param lineOptions - options to Line
   */
  public static segmentsToLines( segments: LightRaySegment[], modelViewTransform: ModelViewTransform2, lineOptions: LineOptions ): Line[] {

    // When attempting to render the rays as a single phet.scenery.Path, we were seeing incorrect closed-path triangles
    // being rendered. We had to resort to a phet.scenery.Line per segment to make the problem go away.
    // See https://github.com/phetsims/geometric-optics/issues/209
    return segments.map( segment => {
      const viewStartPoint = modelViewTransform.modelToViewPosition( segment.startPoint );
      const viewEndPoint = modelViewTransform.modelToViewPosition( segment.endPoint );
      return new Line( viewStartPoint, viewEndPoint, lineOptions );
    } );
  }
}

geometricOptics.register( 'LightRaysNode', LightRaysNode );