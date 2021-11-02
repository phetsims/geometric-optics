// Copyright 2021, University of Colorado Boulder

//TODO name is too vague, maybe SourceRepresentation?
/**
 * Representation is a set of static representation for source objects and light sources.
 *
 * @author Martin Veillette
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import merge from '../../../../phet-core/js/merge.js';
import required from '../../../../phet-core/js/required.js';
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
const OBJECT_SCALE_FACTOR = 4;
const SOURCE_SCALE_FACTOR = 2;

// How much to shift the upper-left corner of the Object image, in cm.
// This is specific to the object PNG files, and must be uniform for all object PNG files.
const OBJECT_OFFSET = new Vector2( -67, 100 );

// How much to shift the upper-left corner of the light source, in cm.
// This is specific to the light-source PNG files, and must be uniform for all light-source PNG files.
const LIGHT_SOURCE_OFFSET = new Vector2( -62, 40 );

class Representation {

  // See config documentation
  readonly isObject: boolean;
  readonly label: string;
  readonly icon: HTMLImageElement;
  readonly rightFacingUpright: HTMLImageElement;
  readonly rightFacingInverted: HTMLImageElement | null;
  readonly leftFacingUpright: HTMLImageElement | null;
  readonly leftFacingInverted: HTMLImageElement | null;
  readonly rightFacingUprightOffset: Vector2;
  readonly tandemPrefix: string;

  /**
   * @param {Object} config
   */
  constructor( config: any ) { //TODO-TS any

    config = merge( {

      // {boolean} true = source object, false = light source
      isObject: required( config.isObject ),

      // {string} label for the representation
      label: required( config.label ),

      // required fields
      // {HTMLImageElement} icon - the icon that appears in UI controls
      icon: required( config.icon ),

      // images
      rightFacingUpright: required( config.rightFacingUpright ), // {HTMLImageElement}
      rightFacingInverted: required( config.rightFacingInverted ), // {HTMLImageElement|null}
      leftFacingUpright: required( config.leftFacingUpright ), // {HTMLImageElement|null}
      leftFacingInverted: required( config.leftFacingInverted ), // {HTMLImageElement|null}

      // {Vector2} offset between point of interest and left-top corner of rightFacingUpright
      rightFacingUprightOffset: required( config.rightFacingUprightOffset ),

      // phet-io
      tandemPrefix: required( config.tandemPrefix ) // {string}
    }, config );

    this.isObject = config.isObject;
    this.label = config.label;
    this.icon = config.icon;
    this.rightFacingUpright = config.rightFacingUpright;
    this.rightFacingInverted = config.rightFacingInverted;
    this.leftFacingUpright = config.leftFacingUpright;
    this.leftFacingInverted = config.leftFacingInverted;
    this.rightFacingUprightOffset = config.rightFacingUprightOffset;
    this.tandemPrefix = config.tandemPrefix;
  }

  /**
   * Gets the scale factor to use for this RepresentationValue.
   * @public
   * @returns {number}
   */
  getScaleFactor() {
    return this.isObject ? OBJECT_SCALE_FACTOR : SOURCE_SCALE_FACTOR;
  }
}

// static instances of Representation
const RepresentationStaticInstances = [

  // Pencil
  new Representation( {
    label: geometricOpticsStrings.pencil,
    icon: pencilIcon_png,
    rightFacingUpright: pencilRightFacingUpright_png,
    rightFacingInverted: pencilRightFacingInverted_png,
    leftFacingUpright: pencilLeftFacingUpright_png,
    leftFacingInverted: pencilLeftFacingInverted_png,
    rightFacingUprightOffset: OBJECT_OFFSET,
    isObject: true,
    tandemPrefix: 'pencil'
  } ),

  // Penguin
  new Representation( {
    label: geometricOpticsStrings.penguin,
    icon: penguinIcon_png,
    rightFacingUpright: penguinRightFacingUpright_png,
    rightFacingInverted: penguinRightFacingInverted_png,
    leftFacingUpright: penguinLeftFacingUpright_png,
    leftFacingInverted: penguinLeftFacingInverted_png,
    rightFacingUprightOffset: OBJECT_OFFSET,
    isObject: true,
    tandemPrefix: 'penguin'
  } ),

  // Planet
  new Representation( {
    label: geometricOpticsStrings.planet,
    icon: planetIcon_png,
    rightFacingUpright: planetRightFacingUpright_png,
    rightFacingInverted: planetRightFacingInverted_png,
    leftFacingUpright: planetLeftFacingUpright_png,
    leftFacingInverted: planetLeftFacingInverted_png,
    rightFacingUprightOffset: OBJECT_OFFSET,
    isObject: true,
    tandemPrefix: 'planet'
  } ),

 // Star
  new Representation( {
    label: geometricOpticsStrings.star,
    icon: starIcon_png,
    rightFacingUpright: starRightFacingUpright_png,
    rightFacingInverted: starRightFacingInverted_png,
    leftFacingUpright: starLeftFacingUpright_png,
    leftFacingInverted: starLeftFacingInverted_png,
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
export default Representation;
export { RepresentationStaticInstances };