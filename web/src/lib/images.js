/** Builds a cropped Pexels CDN URL so layout never depends on the original ratio. */
export const photo = (id, width, height, ext = 'jpeg') =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.${ext}` +
  `?auto=compress&cs=tinysrgb&fit=crop&w=${width}&h=${height}`;

const persianTwoDigit = new Intl.NumberFormat('fa-IR', { minimumIntegerDigits: 2 });

export const slideNumber = (index) => persianTwoDigit.format(index + 1);
