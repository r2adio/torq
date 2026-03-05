export interface Stats {
  runTime: string;
  rssSync: string;
  torrents: number;
  totalSize: string;
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
  selfTune: number;
  diskThrash: string;
  reserveSlots: number;
  peerSlots: number;
  readSlots: number;
  writeSlots: number;
}

export default function getStats(): Stats {
  return {
    runTime: "1h 23m",
    rssSync: `${Math.floor(Math.random() * 100)}%`,
    torrents: 42,
    totalSize: "123 GB",
    dllSpeed: "5.2 MB/s",
    sessionDll: "1.2 GB",
    lifetimeDll: "450 GB",
    ulSpeed: "1.8 MB/s",
    sessionUl: "800 MB",
    lifetimeUl: "120 GB",
    cpu: "23%",
    ram: "512 MB",
    disk: "150 MB/s",
    seek: "120/s",
    latency: "45ms",
    iops: "5000",
    selfTune: 5,
    diskThrash: "Low",
    reserveSlots: 2,
    peerSlots: 100,
    readSlots: 8,
    writeSlots: 8,
  };
}
