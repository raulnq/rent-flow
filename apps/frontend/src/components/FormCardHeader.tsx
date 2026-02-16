import { CardDescription, CardTitle, CardHeader } from './ui/card';

type FormCardHeaderProps = {
  title: string;
  description: string;
  children?: React.ReactNode;
};

export function FormCardHeader({
  title,
  description,
  children,
}: FormCardHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        {children && <div className="flex gap-2">{children}</div>}
      </div>
    </CardHeader>
  );
}
