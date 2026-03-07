interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({
  message = 'Chargement...',
}: LoadingScreenProps) => {
  return (
    <div className="h-screen w-screen flex items-center justify-center bg-dark text-gold">
      <div className="flex flex-col items-center gap-4">
        {/* Le Spinner */}
        <div className="animate-spin border-4 border-gold/20 border-t-gold rounded-full h-12 w-12" />
        {/* Le Message */}
        <div className="animate-pulse italic uppercase tracking-widest text-sm text-center px-6">
          {message}
        </div>
      </div>
    </div>
  );
};
