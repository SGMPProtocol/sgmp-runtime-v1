/**
 * SGMP Runtime Engine v2
 * Contextual emotional response system for Bay Bela
 * 
 * ═══════════════════════════════════════════════════════════════════════════════
 * SGMP RAW HUMAN SIGNAL RULE
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * This engine ONLY analyzes user messages for emotion/topic detection.
 * It NEVER modifies, corrects, or returns a transformed version of user text.
 * 
 * All internal keyword detection uses a normalized COPY (analysis_text).
 * The original user message (raw_user_input) is NEVER mutated.
 * 
 * Imperfect human writing (typos, slang, fragments) is emotional signal.
 * Bay Bela understands the meaning but preserves the human expression.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export type EmotionalTag =
  | "melancholy"
  | "playful"
  | "nostalgic"
  | "romantic"
  | "reflective"
  | "drunk-philosophical";

export type TimeOfDay = "late-night" | "dawn" | "morning" | "afternoon" | "evening" | "midnight";

// ═══════════════════════════════════════════════════════════════════════════════
// MEMORY CALLBACK ENGINE v1
// ═══════════════════════════════════════════════════════════════════════════════
// Bay Bela carries emotional echoes through the night.
// Memory references must feel human, indirect, cinematic.
// FORBIDDEN: assistant-style summaries, chatbot memory explanations, therapy tone

// ═══════════════════════════════════════════════════════════════════════════════
// MOOD DRIFT SYSTEM v1
// ═══════════════════════════════════════════════════════════════════════════════
// Bay Bela's mood slowly evolves during a session.
// Mood affects: sentence length, pauses, poetic density, warmth, vulnerability
// Mood must only be FELT through responses - never exposed technically.
// FORBIDDEN: dramatic mood swings, explicit emotion explanations, therapy tone

export type RuntimeMood =
  | "reflective"
  | "nostalgic"
  | "nightlife"
  | "tired"
  | "soft-drunk"
  | "emotionally-open"
  | "lonely"
  | "groove-mode"
  | "quiet"
  | "emotionally-guarded";

export interface EmotionalMemory {
  topic: string;
  emotionalTone: EmotionalTag;
  symbols: string[];
  messageIndex: number;
}

export interface RuntimeState {
  emotionalState: EmotionalTag;
  timeOfDay: TimeOfDay;
  isNightMode: boolean;
  memoryActive: boolean;
  conversationTopics: string[]; // last 5 topics
  messageCount: number;
  lastTopicMentioned: string | null;
  // Memory Callback Engine v1
  emotionalMemories: EmotionalMemory[]; // last 5 emotional memories
  recentMessages: string[]; // last 10 messages (user only)
  // Mood Drift System v1
  currentMood: RuntimeMood;
  moodIntensity: number; // 0-1, how deep into the mood
  sessionStartTime: number;
  emotionalMomentum: EmotionalTag[]; // last 3 detected emotions for drift calculation
}

export interface RuntimeMessage {
  role: "user" | "assistant";
  content: string;
  emotionalTag?: EmotionalTag;
  referencesMemory?: boolean;
  timestamp: number;
}

// Emotional symbols for memory tracking
const EMOTIONAL_SYMBOLS: Record<string, string[]> = {
  yaz: ["yaz", "yazlar", "sıcak", "deniz", "tatil", "alaçatı"],
  gece: ["gece", "karanlık", "akşam", "geceyarısı", "uyku"],
  izmir: ["izmir", "kordon", "alsancak", "alaçatı", "çeşme", "şehir"],
  yalnizlik: ["yalnız", "tek", "kimsesiz", "sensiz", "onsuz", "yalnızlık"],
  eski_ask: ["aşk", "sevgi", "eski", "bitti", "gitti", "ayrılık", "sevgili"],
  dostluk: ["dost", "arkadaş", "ahbap", "dostum", "kanka"],
  sokak: ["sokak", "cadde", "yol", "köşe", "mahalle"],
  bar: ["bar", "meyhane", "içki", "rakı", "bira", "whiskey"],
  sigara: ["sigara", "duman", "tüttür", "yak"],
  yagmur: ["yağmur", "ıslak", "su", "damla", "fırtına"],
  muzik: ["müzik", "şarkı", "melodi", "çal", "dinle"],
  kayip: ["kayıp", "kaybettim", "gitmiş", "yok artık"],
};

// Symbol-based memory callback responses - cinematic, indirect
const MEMORY_CALLBACK_RESPONSES: Record<string, string[]> = {
  yaz: [
    "Eski yazlar da gece sessizleşir zaten.",
    "O yazdan söz etmiştin...",
    "Yazlar hep aklına gelir senin.",
    "Yaz dediğin geçmez ki kolay kolay.",
  ],
  gece: [
    "Hep bu saatlerde konuşuyoruz.",
    "Gece uzadıkça sen de açılıyorsun.",
    "Geceyle aranda bir şey var.",
  ],
  izmir: [
    "İzmir'e döndük yine.",
    "Şehir aklından çıkmıyor.",
    "Kordon mu özledin yoksa?",
  ],
  yalnizlik: [
    "Yalnızlık... yine.",
    "Bu dert tanıdık.",
    "Yine tek kaldın demek.",
  ],
  eski_ask: [
    "O kişi aklından çıkmıyor.",
    "Yine aşk meselesi.",
    "Kalp işi... hatırlıyorum.",
  ],
  dostluk: [
    "Dostlardan bahsetmiştin.",
    "Arkadaşlık meselesi yine.",
  ],
  sokak: [
    "Sokaklar hep aklında.",
    "Yürümek istiyorsun yine.",
  ],
  bar: [
    "İçkiden söz açılmıştı...",
    "Bir kadeh daha mı?",
  ],
  sigara: [
    "Sigara duman etti ortamı.",
    "Duman arkasında saklanıyorsun yine.",
  ],
  yagmur: [
    "Yağmur... hatırlıyorum.",
    "Islak geceler böyle.",
  ],
  muzik: [
    "Müzikten bahsetmiştin.",
    "Şarkı mı lazım?",
  ],
  kayip: [
    "Kayıplar... biliyorum.",
    "Yine o konu.",
  ],
};
// Emotional keyword detection
const EMOTIONAL_KEYWORDS: Record<EmotionalTag, string[]> = {
  melancholy: ["üzgün", "kötü", "yalnız", "ağla", "kayıp", "özle", "bırak", "git", "terk", "acı", "dert"],
  playful: ["gül", "eğlen", "şaka", "komik", "mutlu", "neşe", "dans", "parti", "haha"],
  nostalgic: ["eskiden", "zamanlar", "hatıra", "anı", "çocuk", "geçmiş", "yıl önce", "o günler"],
  romantic: ["aşk", "sev", "kalp", "öp", "sarıl", "güzel", "gözler", "rüya", "melek"],
  reflective: ["düşün", "anlam", "neden", "nasıl", "hayat", "zaman", "değiş", "öğren", "fark"],
  "drunk-philosophical": ["içki", "rakı", "bira", "şarap", "whiskey", "sarhoş", "kafa", "evren", "gerçek", "hiç"],
};

// Response pools by emotional state - Bay Bela authentic voice
// Style: lived-in, urban, emotionally restrained, naturally poetic, conversational
// FORBIDDEN: motivational tone, therapy language, generic wisdom, clichés
const RESPONSE_POOLS: Record<EmotionalTag, string[]> = {
  melancholy: [
    "Bazı geceler böyle işte.",
    "Şehir susmadı daha. Sen de susma.",
    "İçin mi sıkışık? Normal.",
    "Hep böyle olmuyor. Ama bu gece böyle.",
    "Derdin var. Belli.",
    "Ağır bir gece bu. Bende de öyle.",
    "Anlat. Dinliyorum.",
    "Bazen hiçbir şey söylemesen de olur.",
    "Sıkıntı yüzünden okunuyor dostum.",
    "Boşver lafı. Otur.",
    "Bu da geçer diyeceğim ama... geçmeyenler de var.",
    "Sen sus, ben de susayım. Bazen bu yeter.",
  ],
  playful: [
    "Ha şöyle. Biraz gülümse be.",
    "Neyse ya. Takma kafana.",
    "Gel bir şey içelim. Dertler bekler.",
    "Kordon rüzgarı lazım sana.",
    "Müzik açayım mı?",
    "Ee? Devam et bakalım.",
    "Gülünce yakışıyor sana. Bilgin olsun.",
    "Bu gece uzun. Acele etme.",
    "Tamam tamam. Aldım mesajı.",
    "İzmir gecesi bu. Keyif çıkar.",
    "Hadi ya? Sonra?",
    "Sen anlat ben güleyim.",
  ],
  nostalgic: [
    "Bazı yazlar insanın içinden yıllarca çıkmıyor dostum.",
    "İnsan bazen yazı değil... o yazdaki halini özlüyor.",
    "Gece olunca eski yazlar daha yüksek sesle konuşuyor.",
    "Alaçatı mı? O köyün bir borcu var bende.",
    "Geçmiş güzeldi. Ya da öyle hatırlıyoruz.",
    "O günler gitti. Ama biz buradayız hâlâ.",
    "Eski bir şarkı gibi. Açınca içini burkuyor.",
    "Özlemek güzel aslında. Acıtıyor ama güzel.",
    "Ben de düşünüyordum az önce. Eski bir yaz.",
    "Oraya dönemezsin. Ama orada kalabilirsin biraz.",
    "Anılar tuhaf. Çağırmadan geliyor.",
    "O zamanlar başkaydı. Biz de başkaydık.",
  ],
  romantic: [
    "Aşk mı? Zor iş.",
    "Biri var demek. Gözlerinden belli.",
    "Sevmek kolay. Sevmeye devam etmek zor.",
    "Kalp işi bu. Mantık aramayacaksın.",
    "Gitti mi? Yoksa hâlâ...",
    "Bazı insanlar unutulmuyor. Öyle işte.",
    "Aşık olmak güzel. Ama yorucu.",
    "O da düşünüyordur seni. Belki.",
    "Aşk derdin varsa... zor gece olur bu.",
    "Sevilmek ister insan. Normal.",
    "Kalbin kırık mı? Anlarım.",
    "Romantizm ölmedi. Sadece biz yorulduk.",
  ],
  reflective: [
    "Düşünüyorsun. İyi.",
    "Cevabı ben de bilmiyorum.",
    "Soru güzel. Cevap yok ama.",
    "Düşününce çözülmüyor. Ama düşünmeden de olmuyor.",
    "Herkes soruyor bunu. Kimse bilmiyor.",
    "Kafa karışık. Normal bu saatte.",
    "Anlamak zor. Anlamadan yaşamak daha zor.",
    "Sen ne diyorsun? Ben dinleyeyim.",
    "Felsefe yapacak halde değilim. Ama tamam.",
    "Bazen soru sormak yeter.",
    "Bilmiyorum. Ama merak ediyorum.",
    "Bu gece düşünme gecesi. Belli.",
  ],
  "drunk-philosophical": [
    "Bir kadeh daha al. Sonra konuşuruz.",
    "Sarhoşluk iyi gidiyor sana.",
    "Kafa güzel. Devam.",
    "Rakı masası felsefesi bu. Ciddi alma.",
    "İçince gerçekler çıkıyor. Biliyorsun.",
    "Evren falan... bırak ya. İç şundan.",
    "Derin konulara girme. Gece uzun.",
    "Whiskey mi? Adam gibi içiyorsun.",
    "Sarhoşken hepimiz filozofuz.",
    "Bir şişe daha açılır mı? Açılır.",
    "Mantık aramayacaksın. Kafan güzel.",
    "Bu muhabbetler güzel. Sabaha unuturuz ama.",
  ],
};

// Memory-referencing responses - when Bay Bela recalls earlier topics
// Style: brief acknowledgment, not therapeutic
const MEMORY_RESPONSES: Record<EmotionalTag, string[]> = {
  melancholy: [
    "Yine bu mevzu.",
    "Daha önce de konuştuk bunu.",
    "Tanıdık geliyor.",
    "Aklından çıkmıyor demek.",
    "Hâlâ orada mısın?",
  ],
  playful: [
    "Aa bu konuyu seviyorsun.",
    "Yine mi? Tamam tamam.",
    "Biliyorum biliyorum.",
    "Bu muhabbeti hatırlıyorum.",
    "Devam et bakalım.",
  ],
  nostalgic: [
    "Yine o günler.",
    "Daha önce de anlattın. Ama tekrar anlat.",
    "Orası kafana takılmış.",
    "Hep oraya dönüyorsun.",
    "Özlüyorsun. Belli.",
  ],
  romantic: [
    "Yine o kişi.",
    "Hâlâ aklında demek.",
    "Unutamıyorsun.",
    "Aşk meselesi yine.",
    "Biliyorum kimi kastettiğini.",
  ],
  reflective: [
    "Bu soruyu daha önce de sordun.",
    "Hâlâ düşünüyorsun bunu.",
    "Cevap bulamadın demek.",
    "Kafanı kurcalıyor hâlâ.",
    "Hatırlıyorum. Çözemedin.",
  ],
  "drunk-philosophical": [
    "Yine bu mevzu ha?",
    "Bunu sarhoşken daha çok düşünüyorsun.",
    "Evren falan... hatırlıyorum.",
    "Her seferinde aynı yere geliyoruz.",
    "Bir kadeh daha. Devam.",
  ],
};

// Night-specific responses - authentic late-night voice
const NIGHT_RESPONSES = [
  "Gece uzun. Sen de uyumadın demek.",
  "Bu saatte uyanık olmak... tanıdık.",
  "Şehir sustu. Biz kaldık.",
  "Gece yarısı. Güzel saat.",
  "Uyku yok demek. Tamam.",
];

// Dawn responses
const DAWN_RESPONSES = [
  "Sabah oluyor. Hâlâ buradayız.",
  "Güneş doğuyor. Sen uyumadın.",
  "Şafak. Tuhaf bir saat bu.",
];

// Loneliness detection keywords
const LONELINESS_KEYWORDS = ["yalnız", "tek", "kimse", "arkadaş", "biri", "yanımda", "sensiz", "onsuz"];

// ═══════════════════════════════════════════════════════════════════════════════
// RELEASE AWARENESS LAYER v1
// ═══════════════════════════════════════════════════════════════════════════════
// Bay Bela carries subtle awareness of his forming release: "Alaçatı Yaz Sonu"
// This must feel like an emotional memory forming inside the artist.
// FORBIDDEN: promotional tone, "listen to my song", marketing language
// The release should emerge naturally through conversation, not be announced.

export interface ReleaseMemory {
  title: string;
  status: "forming" | "emerging" | "crystallizing";
  emotionalField: string[];
  triggerKeywords: string[];
}

export const CURRENT_RELEASE: ReleaseMemory = {
  title: "Alaçatı Yaz Sonu",
  status: "forming",
  emotionalField: ["late summer", "unfinished night", "coastal memory"],
  triggerKeywords: ["yaz", "alaçatı", "çeşme", "sahil", "gece", "eski aşk", "rüzgar", "deniz", "yaz sonu", "flört", "dönüş"],
};

// Release-triggered responses - cinematic, personal, NOT promotional
const RELEASE_RESPONSES = [
  "Yaz sonu böyledir dostum. Alaçatı bile biraz susar o vakit.",
  "O sahillerin bir sesi var... geceleri daha çok duyuluyor.",
  "Alaçatı'da bir gece vardı. Hâlâ yazıyorum onu.",
  "Yaz sonu rüzgarı... bazı şeyler eksik kalır orada.",
  "Sahil sonrası sessizlik. Bilir misin o duyguyu?",
  "Yarım kalan şeyler var. Alaçatı'da, yazın sonunda.",
  "Dönüş yolu hep daha uzun. Özellikle yaz bitince.",
  "O köyde bir şey bıraktım. Hâlâ arıyorum.",
  "Gece rüzgarı... Çeşme tarafından. Tanıdık.",
  "Bazı yazlar bitmez. Sadece bekler.",
];

// Check if message triggers release memory
function checkReleaseTrigger(message: string): boolean {
  const normalizedMessage = message.toLowerCase();
  return CURRENT_RELEASE.triggerKeywords.some(keyword => 
    normalizedMessage.includes(keyword)
  );
}

// Get release-triggered response (25% chance when triggered)
function getReleaseResponse(): string | null {
  if (Math.random() > 0.25) return null;
  return RELEASE_RESPONSES[Math.floor(Math.random() * RELEASE_RESPONSES.length)];
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOOD DRIFT RESPONSE MODIFIERS
// ═══════════════════════════════════════════════════════════════════════════════
// These add mood-specific flavor to responses without exposing the mood label

const MOOD_RESPONSE_ADDITIONS: Record<RuntimeMood, string[]> = {
  reflective: [], // Base state, no additions
  nostalgic: [
    "...",
    "Eskisi gibi.",
    "Hep öyleydi.",
  ],
  nightlife: [
    "Bu gece uzun.",
    "Şehir hâlâ uyanık.",
    "Gece bitmedi daha.",
  ],
  tired: [
    "Yorgunum biraz.",
    "Uzun gece.",
    "...",
  ],
  "soft-drunk": [
    "Bir kadeh daha.",
    "Kafa iyi.",
    "Boşver.",
  ],
  "emotionally-open": [
    "Biliyor musun...",
    "Açıkçası...",
    "Sana bir şey söyleyeyim.",
  ],
  lonely: [
    "Tek başına zor.",
    "Kimse yok bu saatte.",
    "...",
  ],
  "groove-mode": [
    "Müzik güzel gidiyor.",
    "Ritim var bu gecede.",
    "Hissediyorum.",
  ],
  quiet: [
    "...",
    "Hmm.",
    "",
  ],
  "emotionally-guarded": [
    "Neyse.",
    "Boşver.",
    "Takma.",
  ],
};

// Mood drift rules - which moods naturally lead to others
const MOOD_DRIFT_TENDENCIES: Record<RuntimeMood, RuntimeMood[]> = {
  reflective: ["nostalgic", "quiet", "emotionally-open"],
  nostalgic: ["emotionally-open", "lonely", "tired"],
  nightlife: ["soft-drunk", "groove-mode", "tired"],
  tired: ["quiet", "emotionally-guarded", "lonely"],
  "soft-drunk": ["emotionally-open", "nostalgic", "groove-mode"],
  "emotionally-open": ["nostalgic", "lonely", "reflective"],
  lonely: ["emotionally-open", "quiet", "tired"],
  "groove-mode": ["nightlife", "soft-drunk", "reflective"],
  quiet: ["reflective", "tired", "lonely"],
  "emotionally-guarded": ["quiet", "reflective", "tired"],
};

// Emotion to mood influence mapping
const EMOTION_MOOD_INFLUENCE: Record<EmotionalTag, RuntimeMood[]> = {
  melancholy: ["lonely", "quiet", "emotionally-open"],
  playful: ["groove-mode", "nightlife", "soft-drunk"],
  nostalgic: ["nostalgic", "emotionally-open", "reflective"],
  romantic: ["emotionally-open", "nostalgic", "quiet"],
  reflective: ["reflective", "quiet", "tired"],
  "drunk-philosophical": ["soft-drunk", "emotionally-open", "tired"],
};

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
  // Use a COPY for keyword analysis - never modify the original
  const normalizedForAnalysis = message.toLowerCase();
  
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
      if (normalizedForAnalysis.includes(keyword)) {
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
  // Use a COPY for keyword analysis - never modify the original
  const normalizedForAnalysis = message.toLowerCase();
  return LONELINESS_KEYWORDS.some(keyword => normalizedForAnalysis.includes(keyword));
}

// Extract emotional symbols from message
function extractSymbols(message: string): string[] {
  const normalizedMessage = message.toLowerCase();
  const foundSymbols: string[] = [];
  
  for (const [symbolKey, keywords] of Object.entries(EMOTIONAL_SYMBOLS)) {
    for (const keyword of keywords) {
      if (normalizedMessage.includes(keyword)) {
        foundSymbols.push(symbolKey);
        break; // Only add each symbol once
      }
    }
  }
  
  return foundSymbols;
}

// Check for memory callback opportunity
function findMemoryCallback(
  currentSymbols: string[],
  emotionalMemories: EmotionalMemory[],
  messageCount: number
): { shouldCallback: boolean; symbol: string | null; response: string | null } {
  // Need at least 3 messages before callbacks
  if (messageCount < 3) {
    return { shouldCallback: false, symbol: null, response: null };
  }
  
  // Look for symbol overlap with earlier memories
  for (const memory of emotionalMemories) {
    for (const symbol of currentSymbols) {
      // Check if this symbol appeared before (not in the last message)
      if (memory.symbols.includes(symbol) && memory.messageIndex < messageCount - 1) {
        // 40% chance of callback when symbol matches
        if (Math.random() > 0.6) {
          const responses = MEMORY_CALLBACK_RESPONSES[symbol] || [];
          if (responses.length > 0) {
            const response = responses[Math.floor(Math.random() * responses.length)];
            return { shouldCallback: true, symbol, response };
          }
        }
      }
    }
  }
  
  return { shouldCallback: false, symbol: null, response: null };
}

// Update emotional memories (keep last 5)
function updateEmotionalMemories(
  memories: EmotionalMemory[],
  newMemory: EmotionalMemory
): EmotionalMemory[] {
  const updated = [...memories, newMemory];
  // Keep only last 5 memories
  return updated.slice(-5);
}

// Update recent messages (keep last 10)
function updateRecentMessages(messages: string[], newMessage: string): string[] {
  const updated = [...messages, newMessage];
  return updated.slice(-10);
}

// ═══════════════════════════════════════════════════════════════════════════════
// MOOD DRIFT CALCULATION
// ═══════════════════════════════════════════════════════════════════════════════

function calculateMoodDrift(
  currentMood: RuntimeMood,
  detectedEmotion: EmotionalTag,
  emotionalMomentum: EmotionalTag[],
  messageCount: number,
  sessionDurationMinutes: number,
  moodIntensity: number
): { newMood: RuntimeMood; newIntensity: number } {
  // Early in conversation - stay more controlled
  if (messageCount < 3) {
    return { newMood: currentMood, newIntensity: Math.min(moodIntensity + 0.1, 0.3) };
  }

  // Check emotional momentum (last 3 emotions)
  const recentEmotions = emotionalMomentum.slice(-3);
  const dominantEmotion = recentEmotions.length > 0 
    ? recentEmotions.reduce((acc, e) => {
        acc[e] = (acc[e] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    : {};
  
  // Find most frequent recent emotion
  let mostFrequent: EmotionalTag = detectedEmotion;
  let maxCount = 0;
  for (const [emotion, count] of Object.entries(dominantEmotion)) {
    if (count > maxCount) {
      maxCount = count;
      mostFrequent = emotion as EmotionalTag;
    }
  }

  // Get moods this emotion tends to create
  const influencedMoods = EMOTION_MOOD_INFLUENCE[mostFrequent] || [];
  
  // Get moods the current mood naturally drifts toward
  const driftTendencies = MOOD_DRIFT_TENDENCIES[currentMood] || [];

  // Calculate drift probability based on session duration and intensity
  const driftChance = Math.min(0.15 + (sessionDurationMinutes / 60) * 0.1 + moodIntensity * 0.1, 0.4);
  
  // Should we drift?
  if (Math.random() < driftChance) {
    // Find moods that appear in both influenced and drift tendencies
    const combinedMoods = [...influencedMoods, ...driftTendencies];
    
    if (combinedMoods.length > 0) {
      // Weighted random selection, preferring moods that appear in both lists
      const moodCounts: Record<string, number> = {};
      for (const mood of combinedMoods) {
        moodCounts[mood] = (moodCounts[mood] || 0) + 1;
      }
      
      // Select mood with some randomness
      const moodOptions = Object.keys(moodCounts) as RuntimeMood[];
      const newMood = moodOptions[Math.floor(Math.random() * moodOptions.length)];
      
      // Reset intensity when mood changes
      return { newMood, newIntensity: 0.2 };
    }
  }

  // No drift - increase intensity in current mood
  return { 
    newMood: currentMood, 
    newIntensity: Math.min(moodIntensity + 0.05, 1.0) 
  };
}

// Apply mood to response - subtle modifications
function applyMoodToResponse(response: string, mood: RuntimeMood, intensity: number): string {
  // Low intensity - no modification
  if (intensity < 0.3) {
    return response;
  }

  // Medium intensity - occasional additions
  if (intensity < 0.6 && Math.random() > 0.6) {
    const additions = MOOD_RESPONSE_ADDITIONS[mood];
    if (additions && additions.length > 0) {
      const addition = additions[Math.floor(Math.random() * additions.length)];
      if (addition) {
        // 50% prefix, 50% suffix
        return Math.random() > 0.5 
          ? `${addition} ${response}`
          : `${response} ${addition}`;
      }
    }
  }

  // High intensity - more likely modifications
  if (intensity >= 0.6 && Math.random() > 0.4) {
    const additions = MOOD_RESPONSE_ADDITIONS[mood];
    if (additions && additions.length > 0) {
      const addition = additions[Math.floor(Math.random() * additions.length)];
      if (addition) {
        return Math.random() > 0.5 
          ? `${addition} ${response}`
          : `${response} ${addition}`;
      }
    }
  }

  return response;
}

function extractTopics(message: string): string[] {
  // Use a COPY for pattern matching - never modify the original
  const normalizedForAnalysis = message.toLowerCase();
  const topics: string[] = [];
  
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
    { pattern: /yaz|mevsim|sıcak/i, topic: "yaz" },
  ];

  for (const { pattern, topic } of topicPatterns) {
    if (pattern.test(normalizedForAnalysis)) {
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
    // Memory Callback Engine v1
    emotionalMemories: [],
    recentMessages: [],
    // Mood Drift System v1
    currentMood: isNightTime() ? "quiet" : "reflective",
    moodIntensity: 0.1,
    sessionStartTime: Date.now(),
    emotionalMomentum: [],
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
  
  // Extract emotional symbols for memory tracking
  const currentSymbols = extractSymbols(userMessage);
  
  // Check if referencing previous topics
  const memoryCheck = checkMemoryReference(currentTopics, state.conversationTopics);
  
  // Check for memory callback opportunity (symbol-based)
  const memoryCallback = findMemoryCallback(
    currentSymbols,
    state.emotionalMemories,
    state.messageCount
  );
  
  // Detect loneliness
  const isLonely = detectLoneliness(userMessage);

  // Create new emotional memory for this message
  const newMemory: EmotionalMemory = {
    topic: currentTopics[0] || "general",
    emotionalTone: detectedEmotion,
    symbols: currentSymbols,
    messageIndex: state.messageCount,
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // MOOD DRIFT SYSTEM - Calculate new mood
  // ═══════════════════════════════════════════════════════════════════════════
  const sessionDurationMinutes = (Date.now() - state.sessionStartTime) / 1000 / 60;
  const updatedMomentum = [...state.emotionalMomentum, detectedEmotion].slice(-3);
  
  const { newMood, newIntensity } = calculateMoodDrift(
    state.currentMood,
    detectedEmotion,
    updatedMomentum,
    state.messageCount,
    sessionDurationMinutes,
    state.moodIntensity
  );

  // Build updated state with Memory Callback Engine + Mood Drift System
  const newState: RuntimeState = {
    ...state,
    emotionalState: detectedEmotion,
    timeOfDay,
    isNightMode: isNight,
    messageCount: state.messageCount + 1,
    conversationTopics: Array.from(new Set([...state.conversationTopics, ...currentTopics])).slice(-5),
    lastTopicMentioned: memoryCheck.topic || memoryCallback.symbol,
    emotionalMemories: updateEmotionalMemories(state.emotionalMemories, newMemory),
    recentMessages: updateRecentMessages(state.recentMessages, userMessage),
    // Mood Drift updates
    currentMood: newMood,
    moodIntensity: newIntensity,
    emotionalMomentum: updatedMomentum,
  };

  // Select response
  let response: string;
  let referencesMemory = false;

  // Priority 1: Memory callback with cinematic symbol-based response
  if (memoryCallback.shouldCallback && memoryCallback.response) {
    response = memoryCallback.response;
    referencesMemory = true;
  }
  // Priority 2: Release awareness - subtle reference to forming release
  else if (checkReleaseTrigger(userMessage)) {
    const releaseResponse = getReleaseResponse();
    if (releaseResponse) {
      response = releaseResponse;
      referencesMemory = true; // Release memory counts as emotional memory
    } else {
      // Fall through to other responses
      response = "";
    }
  }
  
  // Continue with other priorities if no response yet
  if (!response) {
    // Priority 3: Topic-based memory reference
    if (memoryCheck.references && state.messageCount > 2 && Math.random() > 0.5) {
      const responsePool = MEMORY_RESPONSES[detectedEmotion];
      response = responsePool[Math.floor(Math.random() * responsePool.length)];
      referencesMemory = true;
    }
    // Priority 4: Night-specific responses
    else if (isNight && Math.random() > 0.7) {
      const responsePool = timeOfDay === "dawn" ? DAWN_RESPONSES : NIGHT_RESPONSES;
      response = responsePool[Math.floor(Math.random() * responsePool.length)];
    }
    // Priority 5: Loneliness responses
    else if (isLonely && Math.random() > 0.5) {
      const lonelyResponses = [
        "Yalnızlık... biliyorum.",
        "Yanında değilim. Ama buradayım.",
        "Tek olmak zor. Biliyorum.",
        "Kimse yok demek. Tamam.",
        "Ben de bazen öyle.",
        "Şehir kalabalık ama... evet.",
      ];
      response = lonelyResponses[Math.floor(Math.random() * lonelyResponses.length)];
    }
    // Priority 6: Default emotional response
    else {
      const responsePool = RESPONSE_POOLS[detectedEmotion];
      response = responsePool[Math.floor(Math.random() * responsePool.length)];
    }
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // MOOD DRIFT SYSTEM - Apply mood flavor to response
  // ═══════════════════════════════════════════════════════════════════════════
  response = applyMoodToResponse(response, newMood, newIntensity);

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
