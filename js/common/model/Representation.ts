// Copyright 2021-2022, University of Colorado Boulder

//TODO name is too vague, maybe SourceRepresentation?
/**
 * Representation is a set of static representation for Objects and Light Sources.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import lamp1_png from '../../../images/lamp1_png.js';
import lightIcon_png from '../../../images/lightIcon_png.js';
import pencilIcon_png from '../../../images/pencilIcon_png.js';
import pencilLeftFacingInverted_png from '../../../images/pencilLeftFacingInverted_png.js';
import pencilLeftFacingUpright_png from '../../../images/pencilLeftFacingUpright_png.js';
import pencilRightFacingInverted_png from '../../../images/pencilRightFacingInverted_png.js';
import pencilRightFacingUpright_png from '../../../images/pencilRightFacingUpright_png.js';
import penguinIcon_png from '../../../images/penguinIcon_png.js';
import penguinLeftFacingInverted_png from '../../../images/penguinLeftFacingInverted_png.js';
import penguinLeftFacingUpright_png from '../../../images/penguinLeftFacingUpright_png.js';
import penguinRightFacingInverted_png from '../../../images/penguinRightFacingInverted_png.js';
import penguinRightFacingUpright_png from '../../../images/penguinRightFacingUpright_png.js';
import planetIcon_png from '../../../images/planetIcon_png.js';
import planetLeftFacingInverted_png from '../../../images/planetLeftFacingInverted_png.js';
import planetLeftFacingUpright_png from '../../../images/planetLeftFacingUpright_png.js';
import planetRightFacingInverted_png from '../../../images/planetRightFacingInverted_png.js';
import planetRightFacingUpright_png from '../../../images/planetRightFacingUpright_png.js';
import starIcon_png from '../../../images/starIcon_png.js';
import starLeftFacingInverted_png from '../../../images/starLeftFacingInverted_png.js';
import starLeftFacingUpright_png from '../../../images/starLeftFacingUpright_png.js';
import starRightFacingInverted_png from '../../../images/starRightFacingInverted_png.js';
import starRightFacingUpright_png from '../../../images/starRightFacingUpright_png.js';
import geometricOptics from '../../geometricOptics.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';

// constants
const FRAMED_OBJECT_SCALE_FACTOR = 4;
const LIGHT_SOURCE_SCALE_FACTOR = 2;

// How much to shift the upper-left corner of the framed Object image, in cm.
// This is specific to the object PNG files, and must be uniform for all object PNG files.
// x should be 1/2 of PNG file width. y should be tip of pencil.
const FRAMED_OBJECT_OFFSET = new Vector2( -68.5, 100 );

// How much to shift the upper-left corner of the light source, in cm.
// This is specific to the light-source PNG files, and must be uniform for all light-source PNG files.
const LIGHT_SOURCE_OFFSET = new Vector2( -62, 40 );

// Configuration provided to the constructor
type RepresentationConfig = {

  // true = framed Object, false = Light Source
  isFramedObject: boolean,

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
  readonly isFramedObject: boolean;
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
    this.isFramedObject = config.isFramedObject;
    this.label = config.label;
    this.icon = config.icon;
    this.rightFacingUpright = config.rightFacingUpright;
    this.rightFacingInverted = config.rightFacingInverted;
    this.leftFacingUpright = config.leftFacingUpright;
    this.leftFacingInverted = config.leftFacingInverted;
    this.rightFacingUprightOffset = config.rightFacingUprightOffset;
    this.tandemPrefix = config.tandemPrefix;

    // additional fields
    this.scaleFactor = this.isFramedObject ? FRAMED_OBJECT_SCALE_FACTOR : LIGHT_SOURCE_SCALE_FACTOR;
  }
}

// static instances of Representation
const RepresentationStaticInstances: Representation[] = [

  // Pencil
  new Representation( {
    isFramedObject: true,
    label: geometricOpticsStrings.pencil,
    icon: pencilIcon_png,
    rightFacingUpright: pencilRightFacingUpright_png,
    rightFacingInverted: pencilRightFacingInverted_png,
    leftFacingUpright: pencilLeftFacingUpright_png,
    leftFacingInverted: pencilLeftFacingInverted_png,
    rightFacingUprightOffset: FRAMED_OBJECT_OFFSET,
    tandemPrefix: 'pencil'
  } ),

  // Penguin
  new Representation( {
    isFramedObject: true,
    label: geometricOpticsStrings.penguin,
    icon: penguinIcon_png,
    rightFacingUpright: penguinRightFacingUpright_png,
    rightFacingInverted: penguinRightFacingInverted_png,
    leftFacingUpright: penguinLeftFacingUpright_png,
    leftFacingInverted: penguinLeftFacingInverted_png,
    rightFacingUprightOffset: FRAMED_OBJECT_OFFSET,
    tandemPrefix: 'penguin'
  } ),

  // Planet
  new Representation( {
    isFramedObject: true,
    label: geometricOpticsStrings.planet,
    icon: planetIcon_png,
    rightFacingUpright: planetRightFacingUpright_png,
    rightFacingInverted: planetRightFacingInverted_png,
    leftFacingUpright: planetLeftFacingUpright_png,
    leftFacingInverted: planetLeftFacingInverted_png,
    rightFacingUprightOffset: FRAMED_OBJECT_OFFSET,
    tandemPrefix: 'planet'
  } ),

  // Star
  new Representation( {
    isFramedObject: true,
    label: geometricOpticsStrings.star,
    icon: starIcon_png,
    rightFacingUpright: starRightFacingUpright_png,
    rightFacingInverted: starRightFacingInverted_png,
    leftFacingUpright: starLeftFacingUpright_png,
    leftFacingInverted: starLeftFacingInverted_png,
    rightFacingUprightOffset: FRAMED_OBJECT_OFFSET,
    tandemPrefix: 'star'
  } ),

  // Light
  new Representation( {
    isFramedObject: false, // this is what identifies it as a Light Source
    label: geometricOpticsStrings.light,
    icon: lightIcon_png,
    rightFacingUpright: lamp1_png,
    rightFacingInverted: null,
    leftFacingUpright: null,
    leftFacingInverted: null,
    rightFacingUprightOffset: LIGHT_SOURCE_OFFSET,
    tandemPrefix: 'light'
  } )
];

geometricOptics.register( 'Representation', Representation );
export { Representation as default, RepresentationStaticInstances };