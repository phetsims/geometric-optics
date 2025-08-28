// Copyright 2022-2025, University of Colorado Boulder

/**
 * Guides is a pair of guides (top and bottom) associated with the same point-of-interest.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Disposable from '../../../../axon/js/Disposable.js';
import { TReadOnlyProperty } from '../../../../axon/js/TReadOnlyProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import geometricOptics from '../../geometricOptics.js';
import Guide from './Guide.js';
import Optic from './Optic.js';

export default class Guides {

  // the pair of guides
  public readonly topGuide: Guide;
  public readonly bottomGuide: Guide;

  /**
   * @param optic - the optic that these guides are associated with
   * @param opticalObjectPositionProperty - position of the optical object
   */
  public constructor( optic: Optic, opticalObjectPositionProperty: TReadOnlyProperty<Vector2> ) {

    this.topGuide = new Guide( optic, opticalObjectPositionProperty, 'top' );

    this.bottomGuide = new Guide( optic, opticalObjectPositionProperty, 'bottom' );
  }

  public dispose(): void {
    Disposable.assertNotDisposable();
  }
}

geometricOptics.register( 'Guides', Guides );