interface AvatarProps {
  name?: string;
  src?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizes = { sm: 'h-8 w-8', md: 'h-12 w-12', lg: 'h-20 w-20' };

export function Avatar({ name, src, size = 'md', className = '' }: AvatarProps) {
  const avatarSrc = src ?? `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name ?? 'user')}`;
  return (
    <img
      src={avatarSrc}
      alt={name ?? 'Avatar'}
      className={`rounded-full bg-slate-200 object-cover ${sizes[size]} ${className}`}
    />
  );
}
