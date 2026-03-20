import { SiGithub, SiOpenstreetmap, SiThreedotjs } from 'solid-icons/si';
import { TbOutlineMap } from 'solid-icons/tb';

export function Header() {
  return (
    <header class="py-4 flex justify-between items-center px-6 bg-white text-gray-900 border-b border-gray-900 shrink-0">
      <span class="text-base font-semibold tracking-[0.04em]">
        OSM Drone Simulator
      </span>
      <div class="flex gap-4">
        <a
          href="https://www.openstreetmap.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="OpenStreetMap"
          title="Map data © OpenStreetMap contributors"
          class="text-gray-900/70 no-underline flex items-center transition-colors duration-150 hover:text-gray-900"
        >
          <SiOpenstreetmap size={24} />
        </a>
        <a
          href="https://overturemaps.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Overture Maps"
          title="Building & POI data from Overture Maps"
          class="text-gray-900/70 no-underline flex items-center transition-colors duration-150 hover:text-gray-900"
        >
          <TbOutlineMap size={24} />
        </a>
        <a
          href="https://threejs.org"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Three.js"
          title="3D rendering powered by Three.js"
          class="text-gray-900/70 no-underline flex items-center transition-colors duration-150 hover:text-gray-900"
        >
          <SiThreedotjs size={24} />
        </a>
        <a
          href="https://github.com/OlivierB-OB/drone-simulator"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub"
          title="View source on GitHub"
          class="text-gray-900/70 no-underline flex items-center transition-colors duration-150 hover:text-gray-900"
        >
          <SiGithub size={24} />
        </a>
      </div>
    </header>
  );
}
