import { categorizeApps, getWeatherForecast } from '@/app/actions';
import { ALL_APPS_SORTED, INSTALLED_APPS } from '@/lib/apps';
import type { App } from '@/lib/types';
import HomeScreen from '@/components/launcher/HomeScreen';
import PhoneShell from '@/components/launcher/PhoneShell';
import type { WeatherForecastOutput } from '@/ai/types';

export default async function Home() {
  const appNames = INSTALLED_APPS.map((app) => app.name);
  let categorizedApps: { [key: string]: string } = {};
  let weatherForecast: WeatherForecastOutput | null = null;

  try {
    const result = await categorizeApps({ appNames });
    if (result && Array.isArray(result.categorizations)) {
      categorizedApps = result.categorizations.reduce((acc, item) => {
        acc[item.appName] = item.category;
        return acc;
      }, {} as { [key: string]: string });
    } else {
        throw new Error("Invalid response format from categorizeApps");
    }
  } catch (error) {
    console.error("Failed to categorize apps:", error);
    // Assign a default 'Other' category to all apps on failure
    categorizedApps = appNames.reduce((acc, name) => {
      acc[name] = 'Other';
      return acc;
    }, {} as { [key: string]: string });
  }

  try {
    weatherForecast = await getWeatherForecast({ location: 'Mountain View' });
  } catch (error) {
    console.error("Failed to get weather forecast:", error);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#D3D3D3] p-4 font-body antialiased dark:bg-neutral-900">
      <PhoneShell>
        <HomeScreen
          categorizedApps={categorizedApps}
          allApps={ALL_APPS_SORTED}
          weatherForecast={weatherForecast}
        />
      </PhoneShell>
    </main>
  );
}
