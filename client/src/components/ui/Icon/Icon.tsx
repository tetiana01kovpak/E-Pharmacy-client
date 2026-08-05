type IconProps = {
  name: string;
  size?: number;
  className?: string;
};

export function Icon({ name, size = 20, className }: IconProps) {
  return (
    <svg className={className} width={size} height={size} aria-hidden="true" focusable="false">
      <use href={`/icons/sprite.svg#icon-${name}`} />
    </svg>
  );
}
