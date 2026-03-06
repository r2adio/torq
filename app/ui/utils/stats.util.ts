export interface Stats {
  runTime: string;
  rssSync: string;
  torrents: string;
  dllSpeed: string;
  sessionDll: string;
  lifetimeDll: string;
  ulSpeed: string;
  sessionUl: string;
  lifetimeUl: string;
  cpu: string;
  ram: string;
  disk: string;
  seek: string;
  latency: string;
  iops: string;
  selfTune: string;
  diskThrash: string;
  reserveSlots: number;
  peerSlots: string;
  readSlots: number;
  writeSlots: string;
}

export default function getStats(): Stats {
  return {
    runTime: "2m 20s",
    rssSync: "12m 43s",
    torrents: `${59} (${66.82} GB)`,
    dllSpeed: `${68.79} Mbps`,
    sessionDll: `${1.23} GB`,
    lifetimeDll: `${323.45} GB`,
    ulSpeed: `${545.7} Kbps`,
    sessionUl: `${30.56} MB`,
    lifetimeUl: `${217.5} GB`,
    cpu: `${15}%`,
    ram: `${1.3}% (${101.05} MB)`,
    disk: `   ↑ ${484.2} Kbps  ↓ ${18.87} Mbps`,
    seek: `   ↑ ${84.2} MB     ↓ ${364.87} MB`,
    latency: `↑ ${125.2} ms    ↓ ${4.68} ms`,
    iops: `   ↑ ${4} ops/s     ↓ ${2} ops/s`,
    selfTune: `${68661225} (${+0}%)`,
    diskThrash: `${5763} (${-3}%)`,
    reserveSlots: 2,
    peerSlots: `${80} / ${1265} (${+18}%)`,
    readSlots: 8,
    writeSlots: `${602} (${-18})`,
  };
}
