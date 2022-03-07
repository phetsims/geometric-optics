// Copyright 2022, University of Colorado Boulder

/**
 * TODO https://github.com/phetsims/geometric-optics/issues/326
 * This is a collection of temporary types for options, missing from common code when this sim was implemented.
 * As common code is converted to TypeScript, these temporary types should be replaced with the real deal.
 * The goal is to eventually delete this file.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import { PickOptional } from '../../../phet-core/js/types/PickOptional.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions, RectangleOptions, SceneryEvent } from '../../../scenery/js/imports.js';
import { PhetioObjectOptions } from '../../../tandem/js/PhetioObject.js';
import { ButtonNodeOptions } from '../../../sun/js/buttons/ButtonNode.js';
import Tandem from '../../../tandem/js/Tandem.js';

export type ArrowNodeOptions = {
  headWidth?: number,
  headHeight?: number,
  tailWidth?: number,
  isHeadDynamic?: boolean,
  doubleHead?: boolean,
  fractionalHeadHeight?: number,
  fill?: ColorDef,
  stroke?: ColorDef,
} & NodeOptions;

export type BackgroundNodeOptions = {
  xMargin?: number,
  yMargin?: number,
  rectangleOptions?: RectangleOptions
} & NodeOptions;

export type BooleanRectangularToggleButtonOptions = {
  touchAreaXDilation?: number,
  touchAreaYDilation?: number,
  mouseAreaXDilation?: number,
  mouseAreaYDilation?: number
} & ButtonNodeOptions;

export type BooleanRoundToggleButtonOptions = {
  radius?: number,
  xMargin?: number,
  yMargin?: number,
  touchAreaDilation?: number
} & ButtonNodeOptions;

export type CheckboxOptions = {
  boxWidth: number
} & NodeOptions;

export type KeyboardDragListenerOptions = {
  positionProperty?: IProperty<Vector2> | null,
  dragBoundsProperty?: IReadOnlyProperty<Bounds2> | null,
  transform?: ModelViewTransform2,
  drag?: ( event: SceneryEvent ) => void,
  start?: ( event: SceneryEvent ) => void
  end?: ( event: SceneryEvent ) => void
} & PickOptional<PhetioObjectOptions, 'tandem'>;

export type PanelOptions = {
  align?: 'left' | 'right' | 'center',
  cornerRadius?: number,
  xMargin?: number,
  yMargin?: number,
  fill?: ColorDef,
  stroke?: ColorDef
} & NodeOptions;

export type RectangularRadioButtonGroupOptions = {
  orientation?: 'horizontal' | 'vertical',
  spacing?: number,
  cornerRadius?: number,
  baseColor?: ColorDef,
  selectedStroke?: ColorDef,
  deselectedStroke?: ColorDef,
  deselectedLineWidth?: number,
  selectedLineWidth?: number,
  buttonContentXMargin?: number,
  buttonContentYMargin?: number,
  touchAreaXDilation?: number,
  touchAreaYDilation?: number
} & NodeOptions;

export type SimOptions = {
  credits?: object,
  hasKeyboardHelpContent?: boolean,
  createOptionsDialogContent?: ( tandem: Tandem ) => Node
};