/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;