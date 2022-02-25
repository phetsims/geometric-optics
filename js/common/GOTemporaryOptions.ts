// Copyright 2022, University of Colorado Boulder

/**
 * TODO https://github.com/phetsims/geometric-optics/issues/326
 * This is a collection of temporary types for options, missing from common code when this sim was implemented.
 * As common code is converted to TypeScript, these temporary types should be replaced with the real deal.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import IProperty from '../../../axon/js/IProperty.js';
import IReadOnlyProperty from '../../../axon/js/IReadOnlyProperty.js';
import Bounds2 from '../../../dot/js/Bounds2.js';
import Dimension2 from '../../../dot/js/Dimension2.js';
import Vector2 from '../../../dot/js/Vector2.js';
import ModelViewTransform2 from '../../../phetcommon/js/view/ModelViewTransform2.js';
import { Node, NodeOptions, RectangleOptions, RichTextOptions, SceneryEvent, TextOptions } from '../../../scenery/js/imports.js';
import Tandem from '../../../tandem/js/Tandem.js';

export type ArrowNodeOptions = {
  headWidth?: number,
  headHeight?: number,
  tailWidth?: number,
  isHeadDynamic?: boolean,
  doubleHead?: boolean,
  fractionalHeadHeight?: number,
  fill?: ColorDef,
  stroke?: number | null,
  scale?: number
} & NodeOptions;

export type BackgroundNodeOptions = {
  xMargin?: number,
  yMargin?: number,
  rectangleOptions: RectangleOptions
} & NodeOptions;

export type BooleanRectangularToggleButtonOptions = {
  touchAreaXDilation?: number,
  touchAreaYDilation?: number,
  mouseAreaXDilation?: number,
  mouseAreaYDilation?: number
} & ButtonNodeOptions;

export type ButtonNodeOptions = {
  baseColor?: ColorDef,
  disabledColor?: ColorDef,
  buttonAppearanceStrategy?: any
} & NodeOptions;

export type KeyboardDragListenerOptions = {
  positionProperty?: IProperty<Vector2> | null,
  dragBoundsProperty?: IReadOnlyProperty<Bounds2> | null,
  transform?: ModelViewTransform2,
  drag?: ( event: SceneryEvent ) => void,
  start?: ( event: SceneryEvent ) => void
  end?: ( event: SceneryEvent ) => void
}

export type NumberControlOptions = {
  delta?: number,
  layoutFunction?: ( options: any ) => void,
  titleNodeOptions?: TextOptions,
  sliderOptions: SliderOptions,
  numberDisplayOptions: NumberDisplayOptions
} & NodeOptions;

export type NumberDisplayOptions = {
  maxWidth?: number,
  textOptions?: TextOptions | RichTextOptions
} & NodeOptions;

export type SimOptions = {
  credits?: object,
  hasKeyboardHelpContent?: boolean,
  createOptionsDialogContent?: ( tandem: Tandem ) => Node
};

export type SliderOptions = {
  trackSize?: Dimension2,
  thumbSize?: Dimension2,
  thumbTouchAreaXDilation: number,
  thumbTouchAreaYDilation: number
} & NodeOptions;

export type VSeparatorOptions = {
  stroke?: ColorDef,
  lineWidth?: number
} & NodeOptions;