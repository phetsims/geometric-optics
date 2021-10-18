/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;