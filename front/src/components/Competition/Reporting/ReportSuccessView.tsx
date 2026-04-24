import { Text } from '@/components/UI';

export const ReportSuccessView = () => (
  <div className="text-center animate-fade-in py-4" role="status">
    <div className="relative inline-block mb-4" aria-hidden="true">
      <span className="text-5xl block animate-bounce">📩</span>
      <div className="absolute -inset-2 bg-success-bright/20 blur-xl rounded-full animate-pulse" />
    </div>
    <Text
      id="report-success-title"
      variant="h2"
      className="text-success-bright italic text-2xl"
    >
      C'est envoyé !
    </Text>
    <Text variant="micro" className="mt-3 block text-white">
      L'arbitre va trancher... Préparez les mouchoirs.
    </Text>
  </div>
);
