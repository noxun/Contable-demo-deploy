import { Button } from "@/components/ui/button";

interface AccountNavigationProps {
  currentIndex: number;
  total: number;
  onPrevious: () => void;
  onNext: () => void;
}

export const AccountNavigation = ({
  currentIndex,
  total,
  onPrevious,
  onNext,
}: AccountNavigationProps) => {
  return (
    <div className="flex items-center justify-center gap-4">
      <Button onClick={onPrevious} disabled={currentIndex === 0}>
        Anterior
      </Button>
      <span className="text-sm">
        Cuenta {currentIndex + 1} de {total}
      </span>
      <Button onClick={onNext} disabled={currentIndex === total - 1}>
        Siguiente
      </Button>
    </div>
  );
};
