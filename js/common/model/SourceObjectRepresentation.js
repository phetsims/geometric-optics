// Copyright 2021, University of Colorado Boulder

/**
 * Enumeration of the representation of the objects
 *
 * @author Martin Veillette
 */

import Enumeration from '../../../../phet-core/js/Enumeration.js';
import geometricOpticsStrings from '../../geometricOpticsStrings.js';
import geometricOptics from '../../geometricOptics.js';

import rocket3dImage from '../../../images/rocket-3d_png.js';
import rocketImage from '../../../images/rocket_png.js';
import rocket3dReversedImage from '../../../images/rocket-3d-reversed_png.js';
import lampRedImage from '../../../images/lamp-red_png.js';
import lampBlueImage from '../../../images/lamp-blue_png.js';
import pencilImage from '../../../images/pencil_png.js';
import pencil3dImage from '../../../images/pencil-3d_png.js';
import pencil3dInvertedImage from '../../../images/pencil-3d-inverted_png.js';
import pencil3dReversedImage from '../../../images/pencil-3d-reversed_png.js';
import pencil3dReversedInvertedImage from '../../../images/pencil-3d-reversed-inverted_png.js';
import treeImage from '../../../images/tree_png.js';
import tree3dImage from '../../../images/tree-3d_png.js';
import tree3dReversedImage from '../../../images/tree-3d-reversed_png.js';
import screen3dImage from '../../../images/screen-3d_png.js';

const pencilString = geometricOpticsStrings.object.pencil;
const rocketString = geometricOpticsStrings.object.rocket;
const lightString = geometricOpticsStrings.object.light;
const treeString = geometricOpticsStrings.object.tree;

/**
 * Generator of type
 * @param {Image} logo
 * @param {Image} sourceUpright
 * @param {Image} sourceInverted
 * @param {Image} targetUpright
 * @param {Image} targetInverted
 * @param {string} label
 * @param {boolean} isObject
 * @returns {{targetInverted, targetUpright, sourceUpright, sourceInverted, isObject, logo, label}}
 */
const representationGenerator = ( logo, sourceUpright, sourceInverted, targetUpright, targetInverted, label, isObject ) => {
  return {
    logo: logo,
    sourceUpright: sourceUpright,
    sourceInverted: sourceInverted,
    targetUpright: targetUpright,
    targetInverted: targetInverted,
    label: label,
    isObject: isObject
  };
};

const SourceObjectRepresentation = Enumeration.byMap( {
  PENCIL: representationGenerator( pencilImage,
    pencil3dImage,
    pencil3dInvertedImage,
    pencil3dReversedInvertedImage,
    pencil3dReversedImage,
    pencilString, true ),
  TREE: representationGenerator( treeImage,
    tree3dImage,
    tree3dImage,
    tree3dReversedImage,
    tree3dReversedImage,
    treeString, true ),
  ROCKET: representationGenerator( rocketImage,
    rocket3dImage,
    rocket3dImage,
    rocket3dReversedImage,
    rocket3dReversedImage,
    rocketString, true ),
  LIGHT: representationGenerator( lampRedImage,
    lampBlueImage,
    lampBlueImage,
    screen3dImage,
    screen3dImage,
    lightString, false )
} );


geometricOptics.register( 'SourceObjectRepresentation', SourceObjectRepresentation );
export default SourceObjectRepresentation;
