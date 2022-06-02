// Copyright 2022, University of Colorado Boulder

/**
 * FramedImageMaskNode is the mask for a framed image.
 * It's used to fine-tune how translucent the image is where its 3D perspective occludes the optical axis and rays.
 * See https://github.com/phetsims/geometric-optics/issues/283.
 *
 * To visually inspect this mask, run with ?debugMask.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */

import { Shape } from '../../../../kite/js/imports.js';
import geometricOptics from '../../geometricOptics.js';
import Matrix3 from '../../../../dot/js/Matrix3.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import GOColors from '../GOColors.js';
import GOQueryParameters from '../GOQueryParameters.js';

export default class FramedImageMaskNode extends Node {

  private readonly path: Path;

  // Shapes for the 2 orientations of a frame image
  private readonly rightFacingMaskShape: Shape;
  private readonly leftFacingMaskShape: Shape;

  public constructor( imageWidth: number, imageHeight: number ) {

    const rightFacingMaskShape = new MaskShape( imageWidth, imageHeight );

    // Same shape as the right-facing mask, but reflected about the y-axis, and shifted to the right.
    const leftFacingMaskShape = new MaskShape( imageWidth, imageHeight ).transformed( new Matrix3().rowMajor(
      -1, 0, imageWidth,
      0, 1, 0,
      0, 0, 1
    ) );

    const path = new Path( rightFacingMaskShape, {
      fill: GOColors.screenBackgroundColorProperty,
      opacity: GOQueryParameters.frameImageMaskOpacity,
      stroke: GOQueryParameters.debugMask ? 'red' : null
    } );

    super( {
      children: [ path ] // wrapped in Node so we don't expose Path API
    } );

    this.path = path;
    this.rightFacingMaskShape = rightFacingMaskShape;
    this.leftFacingMaskShape = leftFacingMaskShape;
  }

  public setIsRightFacing( isRightFacing: boolean ): void {
    this.path.shape = ( isRightFacing ? this.rightFacingMaskShape : this.leftFacingMaskShape );
  }
}

/**
 * MaskShape is the Shape of the framed-image mask, in right-facing orientation. Use when the image is on the left
 * side of the optic, and its 3D perspective shows the image facing right, towards the optic.
 *
 * The original approach was to use imageNode.getSelfShape to create a Shape that matched the image exactly. But
 * getSelfShape is expensive, and caused performance issues when dragging the optical image. See
 * https://github.com/phetsims/geometric-optics/issues/361.  So I switched to drawing a specific Shape that matches
 * the image 'close enough'. This Shape was created empirically, by manually fiddling with the Shape until it matched
 * the outline of framed images. It is dependent on the .PNG files for the framed images, and also assumes that
 * all .PNG files for frames images have the same dimensions.
 */
class MaskShape extends Shape {

  public constructor( imageWidth: number, imageHeight: number ) {

    // insets are numbered as they are used, as we move clockwise
    const xInset1 = 1;
    const xInset2 = 12;
    const xInset3 = 10;
    const yInset1 = 6;
    const yInset2 = 3;
    const yInset3 = 55;

    super();

    // Outline a right-facing framed image, starting at topLeft and moving clockwise.
    this.moveTo( xInset1, yInset1 )
      .lineTo( xInset3, yInset2 )
      .lineTo( imageWidth - xInset2, yInset3 )
      .lineTo( imageWidth - xInset2, imageHeight - yInset3 )
      .lineTo( xInset3, imageHeight - yInset2 )
      .lineTo( xInset1, imageHeight - yInset1 )
      .close();
  }
}

geometricOptics.register( 'FramedImageMaskNode', FramedImageMaskNode );