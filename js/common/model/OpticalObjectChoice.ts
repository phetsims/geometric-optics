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

// Set of HTMLImageElements (PNG files) that depict a framed object and its associated optical image
export type ObjectHTMLImageElements = {
  rightFacingUpright: HTMLImageElement,
  rightFacingInverted: HTMLImageElement,
  leftFacingUpright: HTMLImageElement,
  leftFacingInverted: HTMLImageElement
};

// icon used for 'Arrow' in the combo box
const arrowIcon = new ArrowNode( 0, 0, 0, -50,
  optionize<ArrowNodeOptions, {}, ArrowNodeOptions>( {
    fill: GOColors.arrow1FillProperty,
    stroke: null,
    scale: 0.5
  }, GOConstants.ARROW_NODE_OPTIONS ) );

class OpticalObjectChoice extends EnumerationValue {

  static ARROW = new OpticalObjectChoice( geometricOpticsStrings.arrow, arrowIcon, 'arrow' );

  static PENCIL = new OpticalObjectChoice( geometricOpticsStrings.pencil, pencilIcon_png, 'pencil', {
    rightFacingUpright: pencilRightFacingUpright_png,
    rightFacingInverted: pencilRightFacingInverted_png,
    leftFacingUpright: pencilLeftFacingUpright_png,
    leftFacingInverted: pencilLeftFacingInverted_png
  } );

  static PENGUIN = new OpticalObjectChoice( geometricOpticsStrings.penguin, penguinIcon_png, 'penguin', {
    rightFacingUpright: penguinRightFacingUpright_png,
    rightFacingInverted: penguinRightFacingInverted_png,
    leftFacingUpright: penguinLeftFacingUpright_png,
    leftFacingInverted: penguinLeftFacingInverted_png
  } );

  static STAR = new OpticalObjectChoice( geometricOpticsStrings.star, starIcon_png, 'star', {
    rightFacingUpright: starRightFacingUpright_png,
    rightFacingInverted: starRightFacingInverted_png,
    leftFacingUpright: starLeftFacingUpright_png,
    leftFacingInverted: starLeftFacingInverted_png
  } );

  static LIGHT = new OpticalObjectChoice( geometricOpticsStrings.light, lightIcon_png, 'light' );

  // These values correspond to framed objects.
  private static FRAMED_OBJECT_CHOICES = [
    OpticalObjectChoice.PENCIL,
    OpticalObjectChoice.PENGUIN,
    OpticalObjectChoice.STAR
  ];

  // Gets a list of keys, values and mapping between them. For use by EnumerationProperty and PhET-iO.
  static enumeration = new Enumeration( OpticalObjectChoice, {
    phetioDocumentation: 'describes an optical object choice'
  } );

  // Label that appears in OpticalObjectChoiceComboBox
  public readonly label: string;

  // Icon that appears in OpticalObjectChoiceComboBox
  public readonly icon: HTMLImageElement | Node;

  // Prefix for tandems related to the OpticalObjectChoice
  public readonly tandemPrefix: string;

  // Set of HTMLImageElements related to the OpticalObjectChoice. Populated for framed objects, null otherwise.
  public readonly objectHTMLImageElements: ObjectHTMLImageElements | null;

  /**
   * @param label
   * @param icon
   * @param tandemPrefix
   * @param objectHTMLImageElements
   */
  constructor( label: string, icon: HTMLImageElement | Node, tandemPrefix: string, objectHTMLImageElements: ObjectHTMLImageElements | null = null ) {
    super();
    this.label = label;
    this.icon = icon;
    this.tandemPrefix = tandemPrefix;
    this.objectHTMLImageElements = objectHTMLImageElements;
  }

  /**
   * Is the choice an arrow object?
   * @param choice
   */
  static isArrowObject( choice: OpticalObjectChoice ): boolean {
    return ( choice === OpticalObjectChoice.ARROW );
  }

  /**
   * Is the choice a framed object?
   * @param choice
   */
  static isFramedObject( choice: OpticalObjectChoice ): boolean {
    return OpticalObjectChoice.FRAMED_OBJECT_CHOICES.includes( choice );
  }

  /**
   * Is the choice a light object?
   * @param choice
   */
  static isLight( choice: OpticalObjectChoice ): boolean {
    return ( choice === OpticalObjectChoice.LIGHT );
  }
}

geometricOptics.register( 'OpticalObjectChoice', OpticalObjectChoice );
export default OpticalObjectChoice;
