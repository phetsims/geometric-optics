// Copyright 2021, University of Colorado Boulder

//TODO name is too vague, maybe SourceRepresentation?
/**
 * Representation is a set of static representation for source objects and light sources.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import lamp1_png from '../../../images/lamp1_png.js';
import lightIcon_png from '../../../images/lightIcon_png.js';
import pencilIcon_png from '../../../images/pencilIcon_png.js';
import pencilInverted_png from '../../../images/pencilInverted_png.js';
import pencilReflected_png from '../../../images/pencilReflected_png.js';
import pencil_png from '../../../images/pencil_png.js';
import penguinIcon_png from '../../../images/penguinIcon_png.js';
import penguinInverted_png from '../../../images/penguinInverted_png.js';
import penguinReflected_png from '../../../images/penguinReflected_png.js';
import penguin_png from '../../../images/penguin_png.js';
import planetIcon_png from '../../../images/planetIcon_png.js';
import planetInverted_png from '../../../images/planetInverted_png.js';
import planetReflected_png from '../../../images/planetReflected_png.js';
import planet_png from '../../../images/planet_png.js';
import starIcon_png from '../../../images/starIcon_png.js';
import starInverted_png from '../../../images/starInverted_png.js';
import starReflected_png from '../../../images/starReflected_png.js';
import star_png from '../../../images/star_png.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

// constants
const OBJECT_SCALE_FACTOR = 4;
const SOURCE_SCALE_FACTOR = 2;

// How much to shift the upper-left corner of the Object image, in cm.
// This is specific to the object PNG files, and must be uniform for all object PNG files.
const OBJECT_OFFSET = new Vector2( -107, 46 );

// How much to shift the upper-left corner of the light source, in cm.
// This is specific to the light-source PNG files, and must be uniform for all light-source PNG files.
const LIGHT_SOURCE_OFFSET = new Vector2( -62, 40 );

// Configuration provided to the constructor
type RepresentationConfig = {

  // true = source object, false = light source
  isObject: boolean,

  // label for the representation, appears in combo box
  label: string,

  // the icon that appears in UI controls
  icon: HTMLImageElement,

  // images
  rightFacingUpright: HTMLImageElement,
  rightFacingInverted: HTMLImageElement | null,
  leftFacingUpright: HTMLImageElement | null,
  leftFacingInverted: HTMLImageElement | null,

  // offset between point of interest and left-top corner of rightFacingUpright
  rightFacingUprightOffset: Vector2,

  // phet-io
  tandemPrefix: string
};

class Representation {

  // See RepresentationConfig documentation
  readonly isObject: boolean;
  readonly label: string;
  readonly icon: HTMLImageElement;
  readonly rightFacingUpright: HTMLImageElement;
  readonly rightFacingInverted: HTMLImageElement | null;
  readonly leftFacingUpright: HTMLImageElement | null;
  readonly leftFacingInverted: HTMLImageElement | null;
  readonly rightFacingUprightOffset: Vector2;
  readonly tandemPrefix: string;

  // Scale used when displaying the representation.
  readonly scaleFactor: number;

  /**
   * @param config
   */
  constructor( config: RepresentationConfig ) {

    // unpack config
    this.isObject = config.isObject;
    this.label = config.label;
    this.icon = config.icon;
    this.rightFacingUpright = config.rightFacingUpright;
    this.rightFacingInverted = config.rightFacingInverted;
    this.leftFacingUpright = config.leftFacingUpright;
    this.leftFacingInverted = config.leftFacingInverted;
    this.rightFacingUprightOffset = config.rightFacingUprightOffset;
    this.tandemPrefix = config.tandemPrefix;

    // additional fields
    this.scaleFactor = this.isObject ? OBJECT_SCALE_FACTOR : SOURCE_SCALE_FACTOR;
  }
}

// static instances of Representation
const RepresentationStaticInstances: Representation[] = [

  // Pencil
  new Representation( {
    label: geometricOpticsStrings.pencil,
    icon: pencilIcon_png,
    rightFacingUpright: pencil_png,
    rightFacingInverted: pencilInverted_png,
    leftFacingUpright: pencilReflected_png,
    leftFacingInverted: pencilInverted_png,
    rightFacingUprightOffset: OBJECT_OFFSET,
    isObject: true,
    tandemPrefix: 'pencil'
  } ),

  // Penguin
  new Representation( {
    label: geometricOpticsStrings.penguin,
    icon: penguinIcon_png,
    rightFacingUpright: penguin_png,
    rightFacingInverted: penguinInverted_png,
    leftFacingUpright: penguinReflected_png,
    leftFacingInverted: penguinInverted_png,
    rightFacingUprightOffset: OBJECT_OFFSET,
    isObject: true,
    tandemPrefix: 'penguin'
  } ),

  // Planet
  new Representation( {
    label: geometricOpticsStrings.planet,
    icon: planetIcon_png,
    rightFacingUpright: planet_png,
    rightFacingInverted: planetInverted_png,
    leftFacingUpright: planetReflected_png,
    leftFacingInverted: planetInverted_png,
    rightFacingUprightOffset: OBJECT_OFFSET,
    isObject: true,
    tandemPrefix: 'planet'
  } ),

  // Star
  new Representation( {
    label: geometricOpticsStrings.star,
    icon: starIcon_png,
    rightFacingUpright: star_png,
    rightFacingInverted: starInverted_png,
    leftFacingUpright: starReflected_png,
    leftFacingInverted: starInverted_png,
    rightFacingUprightOffset: OBJECT_OFFSET,
    isObject: true,
    tandemPrefix: 'star'
  } ),

  // Light
  new Representation( {
    label: geometricOpticsStrings.light,
    icon: lightIcon_png,
    rightFacingUpright: lamp1_png,
    rightFacingInverted: null,
    leftFacingUpright: null,
    leftFacingInverted: null,
    rightFacingUprightOffset: LIGHT_SOURCE_OFFSET,
    isObject: false, // this is what identifies it as a light source
    tandemPrefix: 'light'
  } )
];

geometricOptics.register( 'Representation', Representation );
export { Representation as default, RepresentationStaticInstances };