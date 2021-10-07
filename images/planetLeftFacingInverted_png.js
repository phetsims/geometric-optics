/* eslint-disable */
import asyncLoader from '../../phet-core/js/asyncLoader.js';

const image = new Image();
const unlock = asyncLoader.createLock( image );
image.onload = unlock;
image.src = 'data:image/png;base64,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';
export default image;