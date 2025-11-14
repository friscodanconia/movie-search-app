import GridDiscovery from '@/components/GridDiscovery';

export const metadata = {
  title: 'Discover | CineMagic',
  description: 'Browse personalized movie and TV show recommendations'
};

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-cinema-dark">
      <GridDiscovery region="IN" />
    </div>
  );
}
