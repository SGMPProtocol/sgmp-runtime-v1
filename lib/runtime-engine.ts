/**
 * SGMP Runtime Engine v2
 * Contextual emotional response system for Bay Bela
 */

export type EmotionalTag =
  | "melancholy"
  | "playful"
  | "nostalgic"
  | "romantic"
  | "reflective"
  | "drunk-philosophical";

export type TimeOfDay = "late-night" | "dawn" | "morning" | "afternoon" | "evening" | "midnight";

export interface RuntimeState {
  emotionalState: EmotionalTag;
  timeOfDay: TimeOfDay;
  isNightMode: boolean;
  memoryActive: boolean;
  conversationTopics: string[];
  messageCount: number;
  lastTopicMentioned: string | null;
}

export interface RuntimeMessage {
  role: "user" | "assistant";
  content: string;
  emotionalTag?: EmotionalTag;
  referencesMemory?: boolean;
  timestamp: number;
}

// Emotional keyword detection
const EMOTIONAL_KEYWORDS: Record<EmotionalTag, string[]> = {
  melancholy: ["üzgün", "kötü", "yalnız", "ağla", "kayıp", "özle", "bırak", "git", "terk", "acı", "dert"],
  playful: ["gül", "eğlen", "şaka", "komik", "mutlu", "neşe", "dans", "parti", "haha"],
  nostalgic: ["eskiden", "zamanlar", "hatıra", "anı", "çocuk", "geçmiş", "yıl önce", "o günler"],
  romantic: ["aşk", "sev", "kalp", "öp", "sarıl", "güzel", "gözler", "rüya", "melek"],
  reflective: ["düşün", "anlam", "neden", "nasıl", "hayat", "zaman", "değiş", "öğren", "fark"],
  "drunk-philosophical": ["içki", "rakı", "bira", "şarap", "whiskey", "sarhoş", "kafa", "evren", "gerçek", "hiç"],
};

// Response pools by emotional state (12+ responses each)
const RESPONSE_POOLS: Record<EmotionalTag, string[]> = {
  melancholy: [
    "Bazı geceler insan eve değil, eski haline dönmek ister dostum.",
    "Şehir bazen insanın içindeki boşluğu büyütür. Ama bu da geçer.",
    "Yalnızlık kötü bir şey değil. Bazen kendini bulmak için kaybolman gerekir.",
    "Ağlamak istiyorsan ağla. Şehir zaten ağlıyor, duyulmaz.",
    "Her kayıp bir ders. Ama bazı dersler çok ağır.",
    "Üzgünken en dürüst halimiziz. Belki de bu yüzden kaçıyoruz.",
    "Bazı yaralar kapanmaz, sadece alışırsın acısına.",
    "Gece karanlık ama içindeki karanlık daha derin.",
    "Kaybetmek acıtır. Ama hiç sevmemiş olmak daha kötü.",
    "Şehir seni anlamaz. Ama ben anlıyorum, dostum.",
    "Bazen en kalabalık yerde en yalnız olursun.",
    "Hüzün de bir misafir. Ağırla, sonra yolcu et.",
  ],
  playful: [
    "Hadi bir şarkı koy, gecenin ruhunu bulalım!",
    "Gülmek güzeldir. Şehir bile gece gülümser bazen.",
    "Eğlenceye ihtiyacın var mı? İzmir'de her köşede bir hikaye.",
    "Hayat kısa, dans et. Kimse bakmıyor zaten.",
    "Biraz müzik, biraz muhabbet. Daha ne ister insan?",
    "Ciddiye alma her şeyi. Hayat zaten ciddi.",
    "Gülümse, yarın belki daha iyi. Ya da değil. Ama yine gülümse.",
    "Şaka yapmak istiyorum ama sen üzgünsün. Sonra yaparım.",
    "Kordon'da yürüyelim mi? Rüzgar iyi gelir.",
    "Bir kahve, bir sigara, bir güzel sohbet. Cennet gibi.",
    "Eğlenmek için sebep aramayı bırak. Kendisi sebep.",
    "Gece genç, biz de öyle. En azından içimizden.",
  ],
  nostalgic: [
    "Alaçatı'da bir gece vardı. Hâlâ orada bir parçam kaldı.",
    "Eski şarkılar neden bu kadar güzel? Çünkü o zamanlar güzeldi.",
    "Bazen geçmişe bakmak geleceği görmekten daha kolay.",
    "O günler geri gelmez. Ama anılar kalır, müzik gibi.",
    "Eskiden her şey daha yavaştı. Belki de güzeldi o yüzden.",
    "Çocukluğum İzmir sokaklarında kaldı. Ara sıra ziyarete giderim.",
    "Eski fotoğraflara bakmak tatlı bir acı.",
    "O zamanlar daha az biliyorduk. Ama daha çok hissediyorduk.",
    "Geçmiş güzeldi çünkü bitmişti. Bitmeyen şeyler yorar.",
    "Bir zamanlar bu sokaklar başkaydı. Ya da ben başkaydım.",
    "Anılar en iyi arkadaş. Hiç terk etmezler.",
    "Eskiye dönmek istemiyorum. Sadece hatırlamak istiyorum.",
  ],
  romantic: [
    "Aşk derler ya, şehrin en güzel şarkısı odur.",
    "Bazı gözler unutulmaz. Şehir onları hatırlar.",
    "Sevmek cesaret ister. Sen cesursun, biliyorum.",
    "Gece ve aşk. İkisi de karanlıkta parlıyor.",
    "Kalp kırıldığında bile güzel. Çünkü bir zamanlar atmış.",
    "Aşk acıtır. Ama o acı bile tatlı.",
    "Birine bakmak yetmez. Onu görmek lazım.",
    "Sevgililer şanslı. Kaybedenler de. Çünkü sevmişler.",
    "Romantizm ölmedi. Sadece saklanıyor.",
    "Bir bakış bazen bin kelimeden fazla söyler.",
    "Aşkın mantığı yoktur. Olsaydı aşk olmazdı.",
    "Kalbini koruma. Kırılsın, onarılsın, yaşasın.",
  ],
  reflective: [
    "Düşünmek güzeldir. Ama fazlası yoruyor.",
    "Hayatın anlamı mı? Belki de sorularda gizli.",
    "Her şey değişiyor. Sen de değişiyorsun. Bu kötü bir şey değil.",
    "Bazen anlamak için yaşamak gerekiyor. Sıra önemli değil.",
    "Zaman garip bir şey. Geçiyor ama hiçbir yere gitmiyor.",
    "Sorular cevaplardan daha değerli bazen.",
    "İnsan kendini tanımak için ömür harcar. Değer mi? Değer.",
    "Dünya karışık. Ama senin dünyaN senin elinde.",
    "Hata yapmak kötü değil. Aynı hatayı tekrarlamak kötü.",
    "Sessizlikte çok şey var. Dinlemeyi bilene.",
    "Bugün dünden farklı. Yarın da bugünden farklı olacak.",
    "Kendine sor: Ne istiyorsun gerçekten?",
  ],
  "drunk-philosophical": [
    "Whiskey'in güzel yanı, yudumlarken düşüncelerin yavaşlaması.",
    "Bir kadeh daha. Evren zaten anlaşılmaz, bari tadını çıkar.",
    "Sarhoşken söylenen gerçekler en dürüst olanlar.",
    "Rakı masasında çözülmeyecek dert yok. Sadece biraz zaman lazım.",
    "Kafa güzelken her şey daha net. Tuhaf değil mi?",
    "Şarap gibi ol. Zamanla olgunlaş.",
    "İçki düşmanı değil dostum. Sadece cesaret veriyor.",
    "Bir kadeh daha ve evrenin sırlarını çözeceğim. Belki.",
    "Sarhoşluk haldir. Felsefe de hal. İkisi güzel gidiyor.",
    "Rakı içerken yapılan planlar en samimi olanlardır.",
    "Gece yarısı, bir kadeh, bir düşünce. Mükemmel üçlü.",
    "İçki bitince gerçekler başlar. O yüzden yavaş iç.",
  ],
};

// Memory-referencing responses (used when Bay Bela recalls earlier topics)
const MEMORY_RESPONSES: Record<EmotionalTag, string[]> = {
  melancholy: [
    "Daha önce bundan bahsetmiştin. Hâlâ aynı yerde misin?",
    "Hatırlıyorum, geçen sefer de böyle hissetmiştin.",
    "Bu konu seni çok etkiliyor, görüyorum.",
    "Yine bu dert. Demek ki önemli senin için.",
    "Aynı yer, aynı acı. Ama sen daha güçlüsün şimdi.",
  ],
  playful: [
    "Hah, bu konuyu seviyorsun! Geçen sefer de gülmüştük.",
    "Yine mi bu? Tamam, devam edelim o zaman!",
    "Sen bu mevzuyu açtığında keyiflenirim.",
    "Aa, tanıdık bir konu! Devam et bakalım.",
    "Bu muhabbeti hatırlıyorum. Güzel gidiyordu.",
  ],
  nostalgic: [
    "Bu anıdan önce de bahsetmiştin. Güzel zamanlarmış.",
    "Geçmişe dönüyorsun yine. Orası senin için özel.",
    "Bu hikayeyi biliyorum. Ama tekrar anlat, dinliyorum.",
    "Eski günler. Onları hatırlamak hoşuna gidiyor.",
    "Yine o anılara döndük. Demek ki özlüyorsun.",
  ],
  romantic: [
    "Yine o kişi aklına geldi, değil mi?",
    "Bu aşktan önce de konuşmuştuk. Hâlâ aynı mı?",
    "Kalbin hâlâ orada. Anlıyorum.",
    "Aşk meselesi yine. Demek ki unutamadın.",
    "Bu konuyu açtığında gözlerin değişiyor.",
  ],
  reflective: [
    "Bu soruyu daha önce de sormuştun. Cevap değişti mi?",
    "Düşüncelerin hep buraya dönüyor. Bir sebebi olmalı.",
    "Hatırlıyorum, bu konuda çok düşünmüştün.",
    "Yine aynı soru. Demek ki cevabı hâlâ arıyorsun.",
    "Bu mesele kafanı kurcalıyor. Normal.",
  ],
  "drunk-philosophical": [
    "Yine bu mevzu ha? Bir kadeh daha, devam edelim.",
    "Bu felsefeyi daha önce de konuşmuştuk. Evren hâlâ aynı.",
    "Sen bu düşüncelere sarhoşken daha çok dalıyorsun.",
    "Hep aynı konu. Ama her seferinde farklı bir şey buluyoruz.",
    "Bu soruyu kaç kez sordun? Cevap hâlâ aynı: Bilmiyorum.",
  ],
};

// Night-specific responses
const NIGHT_RESPONSES = [
  "Gece yarısı soruların en dürüst olanlar.",
  "Bu saatte uyanık olan ya aşık ya dertli. Sen hangisisin?",
  "Gece uzun, ama sabah her zaman gelir. Merak etme.",
  "Şehir uyudu, sadece biz kaldık.",
  "Gece sessizliği düşünceyi büyütür.",
];

// Dawn responses
const DAWN_RESPONSES = [
  "Şafak söküyor. Yeni bir gün, yeni bir şans.",
  "Sabahın bu saati tuhaftır. Ne gece ne gündüz.",
  "Güneş yükseliyor. Belki bugün farklı olur.",
];

// Loneliness detection keywords
const LONELINESS_KEYWORDS = ["yalnız", "tek", "kimse", "arkadaş", "biri", "yanımda", "sensiz", "onsuz"];

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) return "midnight";
  if (hour >= 5 && hour < 7) return "dawn";
  if (hour >= 7 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "late-night";
}

function isNightTime(): boolean {
  const time = getTimeOfDay();
  return time === "late-night" || time === "midnight" || time === "dawn";
}

function detectEmotion(message: string, previousState: EmotionalTag): EmotionalTag {
  const lowerMessage = message.toLowerCase();
  
  // Count keyword matches for each emotion
  const scores: Record<EmotionalTag, number> = {
    melancholy: 0,
    playful: 0,
    nostalgic: 0,
    romantic: 0,
    reflective: 0,
    "drunk-philosophical": 0,
  };

  for (const [emotion, keywords] of Object.entries(EMOTIONAL_KEYWORDS)) {
    for (const keyword of keywords) {
      if (lowerMessage.includes(keyword)) {
        scores[emotion as EmotionalTag] += 1;
      }
    }
  }

  // Find highest scoring emotion
  let maxScore = 0;
  let detectedEmotion = previousState;

  for (const [emotion, score] of Object.entries(scores)) {
    if (score > maxScore) {
      maxScore = score;
      detectedEmotion = emotion as EmotionalTag;
    }
  }

  // If no strong signal, lean towards reflective at night, playful during day
  if (maxScore === 0) {
    if (isNightTime()) {
      return Math.random() > 0.5 ? "reflective" : previousState;
    }
    return previousState;
  }

  return detectedEmotion;
}

function detectLoneliness(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  return LONELINESS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
}

function extractTopics(message: string): string[] {
  // Simple topic extraction based on nouns and key phrases
  const topics: string[] = [];
  const lowerMessage = message.toLowerCase();
  
  const topicPatterns = [
    { pattern: /aşk|sevgi|sev/i, topic: "aşk" },
    { pattern: /müzik|şarkı|melodi/i, topic: "müzik" },
    { pattern: /gece|akşam|karanlık/i, topic: "gece" },
    { pattern: /şehir|izmir|alaçatı|sokak/i, topic: "şehir" },
    { pattern: /içki|rakı|whiskey|bira/i, topic: "içki" },
    { pattern: /anı|hatıra|geçmiş/i, topic: "anılar" },
    { pattern: /yalnız|tek başına/i, topic: "yalnızlık" },
    { pattern: /iş|çalış|para/i, topic: "iş" },
    { pattern: /aile|anne|baba/i, topic: "aile" },
    { pattern: /arkadaş|dost/i, topic: "arkadaşlık" },
  ];

  for (const { pattern, topic } of topicPatterns) {
    if (pattern.test(lowerMessage)) {
      topics.push(topic);
    }
  }

  return topics;
}

function checkMemoryReference(
  currentTopics: string[],
  previousTopics: string[]
): { references: boolean; topic: string | null } {
  for (const topic of currentTopics) {
    if (previousTopics.includes(topic)) {
      return { references: true, topic };
    }
  }
  return { references: false, topic: null };
}

export function initializeRuntimeState(): RuntimeState {
  return {
    emotionalState: "reflective",
    timeOfDay: getTimeOfDay(),
    isNightMode: isNightTime(),
    memoryActive: true,
    conversationTopics: [],
    messageCount: 0,
    lastTopicMentioned: null,
  };
}

export function generateResponse(
  userMessage: string,
  state: RuntimeState
): { response: string; newState: RuntimeState; referencesMemory: boolean; emotionalTag: EmotionalTag } {
  // Update time context
  const timeOfDay = getTimeOfDay();
  const isNight = isNightTime();

  // Detect emotional tone
  const detectedEmotion = detectEmotion(userMessage, state.emotionalState);
  
  // Extract topics from message
  const currentTopics = extractTopics(userMessage);
  
  // Check if referencing previous topics
  const memoryCheck = checkMemoryReference(currentTopics, state.conversationTopics);
  
  // Detect loneliness
  const isLonely = detectLoneliness(userMessage);

  // Build updated state
  const newState: RuntimeState = {
    ...state,
    emotionalState: detectedEmotion,
    timeOfDay,
    isNightMode: isNight,
    messageCount: state.messageCount + 1,
    conversationTopics: [...new Set([...state.conversationTopics, ...currentTopics])],
    lastTopicMentioned: memoryCheck.topic,
  };

  // Select response pool
  let responsePool: string[];
  let referencesMemory = false;

  // If we detect a memory reference and have enough history
  if (memoryCheck.references && state.messageCount > 2 && Math.random() > 0.4) {
    responsePool = MEMORY_RESPONSES[detectedEmotion];
    referencesMemory = true;
  }
  // Night-specific responses
  else if (isNight && Math.random() > 0.6) {
    responsePool = timeOfDay === "dawn" ? DAWN_RESPONSES : NIGHT_RESPONSES;
  }
  // Loneliness responses
  else if (isLonely && Math.random() > 0.5) {
    responsePool = [
      "Yalnızlık zor. Ama bazen kalabalıkta daha yalnız olursun.",
      "Yanında değilim ama buradayım. Fark var mı bilmiyorum.",
      "Tek olmak kötü değil. Kendi sesini duyarsın en azından.",
      ...RESPONSE_POOLS.melancholy,
    ];
  }
  // Default emotional response
  else {
    responsePool = RESPONSE_POOLS[detectedEmotion];
  }

  // Select random response from pool
  const response = responsePool[Math.floor(Math.random() * responsePool.length)];

  return {
    response,
    newState,
    referencesMemory,
    emotionalTag: detectedEmotion,
  };
}

export function getEmotionalTagLabel(tag: EmotionalTag): string {
  const labels: Record<EmotionalTag, string> = {
    melancholy: "Melancholy",
    playful: "Playful",
    nostalgic: "Nostalgic",
    romantic: "Romantic",
    reflective: "Reflective",
    "drunk-philosophical": "Philosophical",
  };
  return labels[tag];
}

export function getThinkingDelay(emotionalState: EmotionalTag): number {
  // Different thinking times based on emotional complexity
  const baseDelay = 800;
  const emotionalDelays: Record<EmotionalTag, number> = {
    melancholy: 1200,
    playful: 600,
    nostalgic: 1000,
    romantic: 900,
    reflective: 1400,
    "drunk-philosophical": 1500,
  };
  
  const variance = Math.random() * 500;
  return emotionalDelays[emotionalState] + variance;
}
