

// lib/venueMap.ts
export const venueMap: Record<string, string> = {
  'IEEE Trans. Mobile Comput.': 'IEEE Transactions on Mobile Computing',
  'IEEE Trans. Pattern Anal. Mach. Intell.': 'IEEE Transactions on Pattern Analysis and Machine Intelligence',
  'IEEE J. Sel. Areas Commun.': 'IEEE Journal on Selected Areas in Communications',
  'Proc. IEEE ICC': 'IEEE International Conference on Communications',
  'Proc. ACM MobiCom': 'ACM International Conference on Mobile Computing and Networking',
};

// Short venue labels for the homepage publication badges (e.g. "TMC 2026").
export const venueShort: Record<string, string> = {
  'IEEE Trans. Mobile Comput.': 'TMC',
  'IEEE Trans. Pattern Anal. Mach. Intell.': 'TPAMI',
  'IEEE J. Sel. Areas Commun.': 'JSAC',
  'Proc. IEEE ICC': 'ICC',
  'Proc. ACM MobiCom': 'MobiCom',
};
