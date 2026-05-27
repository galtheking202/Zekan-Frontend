import { Article, Location } from '../types';

export const MOCK_ARTICLES: Article[] = [
  {
    id: '1',
    header: 'IDF Confirms Precision Strike on Weapons Cache in Southern Lebanon',
    category: 'Defence and Security',
    summary:
      'Israeli forces conducted a targeted operation overnight, destroying an underground weapons depot used by Hezbollah near the border. No Israeli casualties were reported.',
    content: '',
    author: 'TPN Intelligence',
    date: new Date(Date.now() - 18 * 60000).toISOString(),
    created_at: new Date(Date.now() - 20 * 60000).toISOString(),
    last_updated: new Date(Date.now() - 18 * 60000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/defence1/800/400',
    credibility_score: 8.4,
    external_sources: [
      'https://www.timesofisrael.com/idf-strike-lebanon',
      'https://www.reuters.com/world/middle-east',
    ],
    area_exterior: null,
    region: 'Southern Lebanon',
    languages: {
      en: {
        title: 'IDF Confirms Precision Strike on Weapons Cache in Southern Lebanon',
        summary:
          'Israeli forces conducted a targeted operation overnight, destroying an underground weapons depot used by Hezbollah near the border.',
        body: 'IDF spokesperson confirmed the strike at 02:30 local time following a 48-hour surveillance operation. The Lebanese army was not involved in the incident and UN peacekeepers were notified after the operation concluded.',
        key_facts: [
          'Cache contained anti-tank missiles and drone components',
          'Strike preceded by 48-hour surveillance operation',
          'Lebanese army not involved in the incident',
          'UN peacekeepers notified after the operation',
        ],
      },
      he: {
        title: 'צה״ל מאשר תקיפה ממוקדת על מחסן נשק בדרום לבנון',
        summary:
          'כוחות ישראליים ביצעו מבצע ממוקד בלילה, והשמידו מחסן נשק תת-קרקעי של חיזבאללה סמוך לגבול. לא דווח על נפגעים ישראלים.',
        body: 'דובר צה״ל אישר את התקיפה בשעה 02:30 לפנות בוקר לאחר מבצע מעקב של 48 שעות. הצבא הלבנוני לא היה מעורב באירוע וכוחות האו״ם הוודעו לאחר סיום המבצע.',
        key_facts: [
          'המחסן הכיל טילים נגד-טנקים ורכיבי רחפנים',
          'התקיפה קדמה לה מעקב של 48 שעות',
          'הצבא הלבנוני לא היה מעורב באירוע',
          'כוחות האו״ם הוודעו לאחר המבצע',
        ],
      },
    },
  },
  {
    id: '2',
    header: 'Bank of Israel Raises Interest Rate to 5.25% Amid Inflation Concerns',
    category: 'Economy',
    summary:
      'The Bank of Israel announced a 25 basis-point rate hike today, the third consecutive increase this quarter, as inflation remains above the 3% target.',
    content: '',
    author: 'TPN Finance Desk',
    date: new Date(Date.now() - 2 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 2.5 * 3600000).toISOString(),
    last_updated: new Date(Date.now() - 2 * 3600000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/economy2/800/400',
    credibility_score: 9.1,
    external_sources: ['https://www.boi.org.il/en', 'https://www.calcalist.co.il'],
    area_exterior: null,
    region: 'Israel',
    languages: {
      en: {
        title: 'Bank of Israel Raises Interest Rate to 5.25% Amid Inflation Concerns',
        summary:
          'The Bank of Israel announced a 25 basis-point rate hike, the third consecutive increase this quarter.',
        body: 'The Monetary Committee voted 4-2 in favor of the hike as CPI rose 3.8% year-on-year in April. Housing prices continue to climb despite cooling measures, and the next review is scheduled for July 7th.',
        key_facts: [
          'CPI rose 3.8% year-on-year in April',
          'Housing prices continue to climb despite cooling measures',
          'Shekel strengthened 0.4% against the dollar',
          'Next review scheduled for July 7th',
        ],
      },
      he: {
        title: 'בנק ישראל מעלה את הריבית ל-5.25% על רקע חששות אינפלציה',
        summary:
          'בנק ישראל הודיע על העלאת ריבית של 25 נקודות בסיס, ההעלאה השלישית ברציפות ברבעון זה.',
        body: 'הוועדה המוניטרית הצביעה 4-2 בעד ההעלאה כאשר מדד המחירים לצרכן עלה ב-3.8% בשנה האחרונה. מחירי הדיור ממשיכים לעלות חרף אמצעי הקירור והדיון הבא מתוכנן ל-7 ביולי.',
        key_facts: [
          'מדד המחירים לצרכן עלה ב-3.8% בשנה האחרונה',
          'מחירי הדיור ממשיכים לעלות חרף אמצעי הקירור',
          'השקל התחזק ב-0.4% מול הדולר',
          'הדיון הבא מתוכנן ל-7 ביולי',
        ],
      },
    },
  },
  {
    id: '3',
    header: 'Knesset Passes Controversial Judicial Reform Bill in First Reading',
    category: 'Politics',
    summary:
      'The proposed legislation, which would limit Supreme Court oversight of government decisions, passed 64-56 in a tense late-night session, sparking immediate protests outside the parliament building.',
    content: '',
    author: 'TPN Political Desk',
    date: new Date(Date.now() - 5 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 6 * 3600000).toISOString(),
    last_updated: new Date(Date.now() - 5 * 3600000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/politics3/800/400',
    credibility_score: 7.8,
    external_sources: ['https://www.haaretz.com', 'https://www.jpost.com'],
    area_exterior: null,
    region: 'Jerusalem',
    languages: {
      en: {
        title: 'Knesset Passes Controversial Judicial Reform Bill in First Reading',
        summary:
          'The bill limiting Supreme Court oversight passed 64-56 in a late-night session, triggering protests outside parliament.',
        body: 'The vote concluded at 23:47 after 11 hours of debate. The opposition walked out before the final vote as thousands gathered outside the Knesset in protest. Legal experts warn of a constitutional crisis, with a second reading expected within 30 days.',
        key_facts: [
          'Opposition walked out before the final vote',
          'Thousands gathered outside the Knesset in protest',
          'Legal experts warn of constitutional crisis',
          'Second reading expected within 30 days',
        ],
      },
      he: {
        title: 'הכנסת העבירה את הצעת חוק הרפורמה השיפוטית השנויה במחלוקת בקריאה ראשונה',
        summary:
          'הצעת החוק להגבלת ביקורת בית המשפט העליון עברה 64-56 במליאת לילה סוערת, ועוררה מחאות מיידיות.',
        body: 'ההצבעה הסתיימה בשעה 23:47 לאחר 11 שעות של דיון. האופוזיציה עזבה לפני ההצבעה הסופית כאשר אלפים התכנסו מחוץ לכנסת למחאה. מומחי משפט מזהירים מפני משבר חוקתי וקריאה שנייה צפויה תוך 30 יום.',
        key_facts: [
          'האופוזיציה עזבה לפני ההצבעה הסופית',
          'אלפים התכנסו מחוץ לכנסת למחאה',
          'מומחי משפט מזהירים מפני משבר חוקתי',
          'קריאה שנייה צפויה תוך 30 יום',
        ],
      },
    },
  },
  {
    id: '4',
    header: 'Weizmann Institute Breakthrough: New Protein Identified in Alzheimer\'s Pathway',
    category: 'Health',
    summary:
      'Researchers at the Weizmann Institute of Science have identified a previously unknown protein that accelerates amyloid plaque formation, potentially opening new avenues for early Alzheimer\'s intervention.',
    content: '',
    author: 'TPN Science Desk',
    date: new Date(Date.now() - 1 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 1.1 * 86400000).toISOString(),
    last_updated: new Date(Date.now() - 1 * 86400000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/health4/800/400',
    credibility_score: 9.6,
    external_sources: ['https://www.weizmann.ac.il', 'https://www.nature.com/neuro'],
    area_exterior: null,
    region: 'Rehovot',
    languages: {
      en: {
        title: 'Weizmann Institute Breakthrough: New Protein Identified in Alzheimer\'s Pathway',
        summary:
          'Researchers identified a previously unknown protein that accelerates amyloid plaque formation, potentially enabling pre-symptomatic screening.',
        body: 'The study, published in Nature Neuroscience, involved 8 years of research in collaboration with Johns Hopkins and Hebrew University. The protein, designated WIS-Tau-47, was found in elevated levels 12 years before symptom onset, suggesting blood test detection could enable pre-symptomatic screening.',
        key_facts: [
          'Protein designated WIS-Tau-47 by the research team',
          'Found in elevated levels 12 years before symptom onset',
          'Blood test detection could enable pre-symptomatic screening',
          'Clinical trials for inhibitor compound expected to begin Q1 2027',
        ],
      },
      he: {
        title: 'פריצת דרך במכון ויצמן: זוהה חלבון חדש במסלול האלצהיימר',
        summary:
          'חוקרים זיהו חלבון שלא היה ידוע קודם לכן המאיץ יצירת רובדי עמילואיד, מה שעשוי לאפשר סקירה טרום-סימפטומטית.',
        body: 'המחקר, שפורסם ב-Nature Neuroscience, כלל 8 שנות מחקר בשיתוף עם אוניברסיטת ג׳ונס הופקינס והאוניברסיטה העברית. החלבון, המכונה WIS-Tau-47, נמצא ברמות גבוהות 12 שנה לפני הופעת התסמינים.',
        key_facts: [
          'החלבון מכונה WIS-Tau-47',
          'נמצא ברמות גבוהות 12 שנה לפני הופעת התסמינים',
          'בדיקת דם עשויה לאפשר סקירה מוקדמת',
          'ניסויים קליניים צפויים להתחיל ברבעון הראשון של 2027',
        ],
      },
    },
  },
  {
    id: '5',
    header: 'Tel Aviv Becomes First Middle East City to Deploy City-Wide EV Charging Grid',
    category: 'Technology',
    summary:
      'The Tel Aviv municipality announced the completion of its 1,200-station electric vehicle charging network, covering all major parking facilities and residential neighborhoods.',
    content: '',
    author: 'TPN Tech Desk',
    date: new Date(Date.now() - 2 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 2.2 * 86400000).toISOString(),
    last_updated: new Date(Date.now() - 2 * 86400000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/tech5/800/400',
    credibility_score: 8.9,
    external_sources: ['https://www.tel-aviv.gov.il', 'https://www.globes.co.il'],
    area_exterior: null,
    region: 'Tel Aviv',
    languages: {
      en: {
        title: 'Tel Aviv Becomes First Middle East City to Deploy City-Wide EV Charging Grid',
        summary:
          'Tel Aviv completed its 1,200-station EV charging network covering all major parking and residential areas.',
        body: 'Installation took 14 months across all 12 city districts. The network is integrated with the Moovit app for real-time availability and powered 60% by the city\'s solar rooftop program. Expansion to Bat Yam and Holon is planned for 2026.',
        key_facts: [
          '1,200 charging points, 300 of which are fast-chargers',
          'Integrated with Moovit for real-time availability',
          'Powered 60% by the city\'s solar rooftop program',
          'Expansion to Bat Yam and Holon planned for 2026',
        ],
      },
      he: {
        title: 'תל אביב הופכת לעיר הראשונה במזרח התיכון עם רשת טעינה לרכב חשמלי בכל הרחבי העיר',
        summary:
          'עיריית תל אביב הודיעה על השלמת רשת עמדות הטעינה לרכב חשמלי עם 1,200 תחנות המכסות את כל חניות ושכונות המגורים.',
        body: 'ההתקנה נמשכה 14 חודשים ב-12 מחוזות העיר. הרשת משולבת עם אפליקציית Moovit לזמינות בזמן אמת ו-60% מהחשמל מגיע מתוכנית הגגות הסולאריים. הרחבה לבת-ים וחולון מתוכננת ל-2026.',
        key_facts: [
          '1,200 נקודות טעינה, 300 מהן טעינה מהירה',
          'שילוב עם אפליקציית Moovit לזמינות בזמן אמת',
          '60% מהחשמל מגיע מתוכנית הגגות הסולאריים',
          'הרחבה לבת-ים וחולון מתוכננת ל-2026',
        ],
      },
    },
  },
  {
    id: '6',
    header: 'Dead Sea Water Level Drops Record 1.2 Meters in Single Year',
    category: 'Environment',
    summary:
      'A new study by the Hebrew University documents an unprecedented annual drop in the Dead Sea water level, attributing 70% of the decline to industrial extraction by the Dead Sea Works.',
    content: '',
    author: 'TPN Environment Desk',
    date: new Date(Date.now() - 3 * 86400000).toISOString(),
    created_at: new Date(Date.now() - 3.1 * 86400000).toISOString(),
    last_updated: new Date(Date.now() - 3 * 86400000).toISOString(),
    imageUrl: null,
    credibility_score: null,
    external_sources: null,
    area_exterior: null,
    region: 'Dead Sea',
    languages: {
      en: {
        title: 'Dead Sea Water Level Drops Record 1.2 Meters in Single Year',
        summary:
          'A Hebrew University study documents an unprecedented annual drop, attributing 70% to industrial extraction.',
        body: 'Satellite imagery combined with ground measurements confirm the record drop. Regional water authorities have declared an environmental emergency, while Jordan and Israel are in talks over a canal project to replenish the sea. Dead Sea Works declined to comment.',
      },
      he: {
        title: 'מפלס ים המלח יורד שיא של 1.2 מטר בשנה אחת',
        summary:
          'מחקר של האוניברסיטה העברית מתעד ירידה שנתית חסרת תקדים, ומייחס 70% מהירידה לתפקוד תעשייתי של מפעלי ים המלח.',
        body: 'תמונות לוויין ומדידות שטח מאשרות את הירידה השיאית. רשויות המים האזוריות מכריזות על חירום סביבתי וירדן וישראל מנהלות שיחות על פרויקט תעלה למילוי הים.',
      },
    },
  },
  {
    id: '7',
    header: 'Maccabi Tel Aviv Clinches EuroLeague Playoff Spot After Win Over Barcelona',
    category: 'Sports',
    summary:
      'A stunning 87-79 victory in Barcelona secures Maccabi Tel Aviv\'s place in the EuroLeague playoffs for the first time in four years. Scottie Wilbekin scored 28 points.',
    content: '',
    author: 'TPN Sports Desk',
    date: new Date(Date.now() - 4 * 3600000).toISOString(),
    created_at: new Date(Date.now() - 4.2 * 3600000).toISOString(),
    last_updated: new Date(Date.now() - 4 * 3600000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/sports7/800/400',
    credibility_score: 9.3,
    external_sources: ['https://www.euroleague.net', 'https://www.sport5.co.il'],
    area_exterior: null,
    region: 'Barcelona / Tel Aviv',
    languages: {
      en: {
        title: 'Maccabi Tel Aviv Clinches EuroLeague Playoff Spot After Win Over Barcelona',
        summary:
          'An 87-79 victory in Barcelona secures Maccabi Tel Aviv\'s EuroLeague playoff spot for the first time in four years.',
        body: 'The win seals 7th place in the EuroLeague standings. Head coach Oded Kattash praised the team\'s resilience throughout the season. The playoff schedule is expected to be announced on Friday.',
        key_facts: [
          'Wilbekin: 28 pts, 6 assists, 4 steals',
          'Lorenzo Brown: 19 pts, 11 rebounds',
          'First playoff qualification since 2021',
          'Playoff schedule to be announced Friday',
        ],
      },
      he: {
        title: 'מכבי תל אביב מבטיחה מקום בפלייאוף יורוליג לאחר ניצחון על ברצלונה',
        summary:
          'ניצחון מדהים 87-79 בברצלונה מבטיח למכבי תל אביב מקום בפלייאוף יורוליג לראשונה בארבע שנים.',
        body: 'הניצחון מבטיח את המקום השביעי בדירוג יורוליג. המאמן עודד קטש שיבח את חוסן הקבוצה לאורך העונה. לוח הפלייאוף צפוי להתפרסם ביום שישי.',
        key_facts: [
          'וילבקין: 28 נקודות, 6 בישולים, 4 ח׳טיפות',
          'לורנצו בראון: 19 נקודות, 11 ריבאונדים',
          'הסמכה ראשונה לפלייאוף מאז 2021',
          'לוח הפלייאוף יפורסם ביום שישי',
        ],
      },
    },
  },
  {
    id: '8',
    header: 'Gaza Ceasefire Talks Resume in Cairo as Mediators Push for 6-Week Deal',
    category: 'Defence and Security',
    summary:
      'Egyptian and Qatari mediators hosted a new round of negotiations in Cairo, with US envoy participation. Both sides are reportedly closer to agreeing on a 6-week ceasefire framework.',
    content: '',
    author: 'TPN Intelligence',
    date: new Date(Date.now() - 45 * 60000).toISOString(),
    created_at: new Date(Date.now() - 60 * 60000).toISOString(),
    last_updated: new Date(Date.now() - 45 * 60000).toISOString(),
    imageUrl: 'https://picsum.photos/seed/defence8/800/400',
    credibility_score: 6.8,
    external_sources: [
      'https://www.aljazeera.com/ceasefire-talks',
      'https://apnews.com/middle-east',
    ],
    area_exterior: null,
    region: 'Cairo / Gaza',
    languages: {
      en: {
        title: 'Gaza Ceasefire Talks Resume in Cairo as Mediators Push for 6-Week Deal',
        summary:
          'Egyptian and Qatari mediators hosted a new round of negotiations with US envoy participation. Both sides are reportedly closer to a 6-week ceasefire framework.',
        body: 'Talks entered their fourth day with senior delegations on both sides. A framework document is expected to be circulated by Sunday. The US Secretary of State spoke to both parties by phone.',
      },
      he: {
        title: 'שיחות הפסקת האש בעזה מתחדשות בקהיר כשהמתווכים דוחפים לעסקה של 6 שבועות',
        summary:
          'מתווכים מצריים וקטריים אירחו סבב חדש של משא ומתן עם השתתפות השליח האמריקאי. שני הצדדים לכאורה קרובים יותר למסגרת הפסקת אש.',
        body: 'השיחות נכנסו ליומן הרביעי עם משלחות בכירות משני הצדדים. מסמך מסגרת צפוי להיות מופץ עד יום ראשון. מזכיר המדינה האמריקאי דיבר עם שני הצדדים בטלפון.',
      },
    },
  },
  {
    id: '9',
    header: 'Rail Strike Disrupts Commuters Across Central Israel',
    category: 'Economy',
    summary:
      'A 24-hour walkout by railway workers over pension disputes left hundreds of thousands of commuters without train service on Thursday morning.',
    content: '',
    author: 'TPN Desk',
    date: new Date(Date.now() - 30 * 60000).toISOString(),
    created_at: new Date(Date.now() - 35 * 60000).toISOString(),
    last_updated: new Date(Date.now() - 30 * 60000).toISOString(),
    imageUrl: null,
    credibility_score: null,
    external_sources: null,
    area_exterior: null,
    region: 'Central Israel',
    languages: {
      en: {
        title: 'Rail Strike Disrupts Commuters Across Central Israel',
        summary:
          'A 24-hour walkout by railway workers over pension disputes left hundreds of thousands of commuters without train service on Thursday morning.',
        body: 'The strike was called by the Railway Workers Union after negotiations with the Transport Ministry broke down late Wednesday night. Bus operators reported a 40% surge in passengers during morning rush hour. The ministry said it expects service to resume by Friday.',
      },
      he: {
        title: 'שביתת הרכבת משבשת נוסעים ברחבי מרכז הארץ',
        summary:
          'שביתת 24 שעות של עובדי הרכבת בשל סכסוך פנסיוני הותירה מאות אלפי נוסעים ללא שירות ביום חמישי בבוקר.',
        body: 'השביתה הוכרזה על ידי ועד עובדי הרכבת לאחר שמשא ומתן עם משרד התחבורה קרס בלילה של יום רביעי. מפעילי אוטובוסים דיווחו על עלייה של 40% בנוסעים בשעות השיא. המשרד אמר שהוא מצפה לחזרת השירות עד יום שישי.',
      },
    },
  },
];

export const MOCK_LOCATIONS: Location[] = [
  { id: 'loc1', name: 'Tel Aviv', level: 'city', parent: null, polygon: null },
  { id: 'loc2', name: 'Jerusalem', level: 'city', parent: null, polygon: null },
  { id: 'loc3', name: 'Gaza', level: 'region', parent: null, polygon: null },
  { id: 'loc4', name: 'Southern Lebanon', level: 'region', parent: null, polygon: null },
  { id: 'loc5', name: 'West Bank', level: 'region', parent: null, polygon: null },
];
