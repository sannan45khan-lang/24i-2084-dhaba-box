// Shows the dish picture (an emoji tile), or a clear fallback when it is missing.
export default function ItemImage({ emoji, name, large = false }) {
  const className = large ? 'item-image large' : 'item-image';

  if (!emoji) {
    return (
      <div className={className + ' missing'} role="img" aria-label={`No picture available for ${name}`}>
        <span>No picture</span>
      </div>
    );
  }

  return (
    <div className={className} role="img" aria-label={`Picture of ${name}`}>
      <span aria-hidden="true">{emoji}</span>
    </div>
  );
}
