
import type { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({
  icon: Icon,
  title,
  description,
}: FeatureCardProps) {
  return (
    <article className="feature-card">
      <div className="feature-icon">
        <Icon
          size={24}
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </article>
  );
}
