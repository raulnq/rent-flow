import { Plus } from 'lucide-react';
import { Button } from './ui/button';
import { CardTitle, CardHeader, CardDescription } from './ui/card';
import { Link } from 'react-router';

type ListCardHeaderProps = {
  title: string;
  description: string;
  children: React.ReactNode;
  addNewLink: string;
  addNewText: string;
};

export function ListCardHeader({
  title,
  description,
  children,
  addNewLink,
  addNewText,
}: ListCardHeaderProps) {
  return (
    <CardHeader className="border-b">
      <div className="flex items-start justify-between">
        <div>
          <CardTitle className="text-base">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
        <Button className="sm:self-start" asChild>
          <Link to={addNewLink}>
            <Plus className="h-4 w-4 mr-2" />
            {addNewText}
          </Link>
        </Button>
      </div>
      {children}
    </CardHeader>
  );
}
