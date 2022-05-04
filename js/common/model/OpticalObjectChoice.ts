// Copyright 2022, University of Colorado Boulder

/**
 * OpticalObjectChoice is a rich enumeration of choices for the optical object.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import EnumerationValue from '../../../../phet-core/js/EnumerationValue.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import pencilIcon_png from '../../../images/pencilIcon_png.js';
import penguinIcon_png from '../../../images/penguinIcon_png.js';
import lightIcon_png from '../../../images/lightIcon_png.js';
import geometricOptics from '../../geometricOptics.js';
import pencilRightFacingUpright_png from '../../../images/pencilRightFacingUpright_png.js';
import pencilRightFacingInverted_png from '../../../images/pencilRightFacingInverted_png.js';
import pencilLeftFacingUpright_png from '../../../images/pencilLeftFacingUpright_png.js';
import pencilLeftFacingInverted_png from '../../../images/pencilLeftFacingInverted_png.js';
import penguinRightFacingUpright_png from '../../../images/penguinRightFacingUpright_png.js';
import penguinRightFacingInverted_png from '../../../images/penguinRightFacingInverted_png.js';
import penguinLeftFacingUpright_png from '../../../images/penguinLeftFacingUpright_png.js';
import penguinLeftFacingInverted_png from '../../../images/penguinLeftFacingInverted_png.js';
import GOConstants from '../GOConstants.js';
import ArrowNode, { ArrowNodeOptions } from '../../../../scenery-phet/js/ArrowNode.js';
import { Node } from '../../../../scenery/js/imports.js';
import GOColors from '../GOColors.js';
import optionize from '../../../../phet-core/js/optionize.js';
import starRightFacingUpright_png from '../../../images/starRightFacingUpright_png.js';
import starRightFacingInverted_png from '../../../images/starRightFacingInverted_png.js';
import starLeftFacingUpright_png from '../../../images/starLeftFacingUpright_png.js';
import starLeftFacingInverted_png from '../../../images/starLeftFacingInverted_png.js';
import starIcon_png from '../../../images/starIcon_png.js';

// Identifies the general type of optical object for a choice in the combo box. I'd prefer not to have this addition
// type baggage, but it's symptomatic of the fact that we have 3 scenes and 5 choices (3 of which map to the same scene).
// So this was a small compromise to having to make even larger changes.
type OpticalObjectType = 'framed' | 'arrow' | 'light';

// Set of HTMLImageElements (PNG files) that depict a framed object and its associated optical image.
// These PNG files have 3D perspective, and the field names used here refer to the orientation of the image.
export type ObjectHTMLImageElements = {
  rightFacingUpright: HTMLImageElement;
  rightFacingInverted: HTMLImageElement;
  leftFacingUpright: HTMLImageElement;
  leftFacingInverted: HTMLImageElement;
};

type OpticalObjectChoiceOptions = {

  // type of optical object
  type: OpticalObjectType;

  // label that appears in combo box
  label: string;

  // icon that appears in combo box
  icon: HTMLImageElement | Node;

  // prefix used for tandem name
  tandemPrefix: string;

  // HTMLImageElements (PNG files) for optical objects that require them
  objectHTMLImageElements?: ObjectHTMLImageElements;
};

// icon used for 'Arrow' in the combo box
const ARROW_ICON = new ArrowNode( 0, 0, 0, -50,
  optionize<ArrowNodeOptions, {}, ArrowNodeOptions>()( {
    fill: GOColors.arrow1FillProperty,
    stroke: null,
    scale: 0.5
  }, GOConstants.ARROW_NODE_OPTIONS ) );

export default class OpticalObjectChoice extends EnumerationValue {

  public static PENCIL = new OpticalObjectChoice( {
    type: 'framed',
    label: geometricOpticsStrings.pencil,
    icon: pencilIcon_png,
    tandemPrefix: 'pencil',
    objectHTMLImageElements: {
      rightFacingUpright: pencilRightFacingUpright_png,
      rightFacingInverted: pencilRightFacingInverted_png,
      leftFacingUpright: pencilLeftFacingUpright_png,
      leftFacingInverted: pencilLeftFacingInverted_png
    }
  } );

  public static PENGUIN = new OpticalObjectChoice( {
    type: 'framed',
    label: geometricOpticsStrings.penguin,
    icon: penguinIcon_png,
    tandemPrefix: 'penguin',
    objectHTMLImageElements: {
      rightFacingUpright: penguinRightFacingUpright_png,
      rightFacingInverted: penguinRightFacingInverted_png,
      leftFacingUpright: penguinLeftFacingUpright_png,
      leftFacingInverted: penguinLeftFacingInverted_png
    }
  } );

  public static STAR = new OpticalObjectChoice( {
    type: 'framed',
    label: geometricOpticsStrings.star,
    icon: starIcon_png,
    tandemPrefix: 'star',
    objectHTMLImageElements: {
      rightFacingUpright: starRightFacingUpright_png,
      rightFacingInverted: starRightFacingInverted_png,
      leftFacingUpright: starLeftFacingUpright_png,
      leftFacingInverted: starLeftFacingInverted_png
    }
  } );

  public static ARROW = new OpticalObjectChoice( {
    type: 'arrow',
    label: geometricOpticsStrings.arrow,
    icon: ARROW_ICON,
    tandemPrefix: 'arrow'
  } );

  public static LIGHT = new OpticalObjectChoice( {
    type: 'light',
    label: geometricOpticsStrings.light,
    icon: lightIcon_png,
    tandemPrefix: 'light'
  } );

  // Gets a list of keys, values and mapping between them. For use by EnumerationProperty and PhET-iO.
  public static enumeration = new Enumeration( OpticalObjectChoice, {
    phetioDocumentation: 'describes an optical object choice'
  } );

  // see OpticalObjectChoiceOptions
  public readonly type: OpticalObjectType;
  public readonly label: string;
  public readonly icon: HTMLImageElement | Node;
  public readonly tandemPrefix: string;
  public readonly objectHTMLImageElements?: ObjectHTMLImageElements;

  constructor( options: OpticalObjectChoiceOptions ) {
    super();
    this.type = options.type;
    this.label = options.label;
    this.icon = options.icon;
    this.tandemPrefix = options.tandemPrefix;
    this.objectHTMLImageElements = options.objectHTMLImageElements;
  }
}

geometricOptics.register( 'OpticalObjectChoice', OpticalObjectChoice );
