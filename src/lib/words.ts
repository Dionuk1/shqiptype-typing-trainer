export type Dictionary = "standarde" | "kosove";

export const DICTIONARIES: Record<Dictionary, { label: string; words: string[] }> = {
  standarde: {
    label: "Standard",
    words: [
      "drita", "nata", "deti", "mali", "lumi", "qyteti", "fshati", "shtëpia", "libri", "fjala",
      "gjuha", "zemra", "mendja", "duart", "sytë", "ylli", "hëna", "dielli", "qielli", "toka",
      "ujë", "zjarri", "era", "shiu", "bora", "pranvera", "vera", "vjeshta", "dimri", "koha",
      "dita", "java", "muaji", "viti", "njeriu", "gruaja", "burri", "fëmija", "nëna", "babai",
      "vlai", "motra", "gjyshi", "gjyshja", "shoku", "shoqja", "mësuesi", "nxënësi", "shkolla", "universiteti",
      "rruga", "ura", "kisha", "xhamia", "kalaja", "muzeu", "teatri", "kinema", "kënga", "valleja",
      "buka", "djathi", "qumështi", "mjalti", "vaji", "vera", "rakia", "kafja", "çaji", "mjedra",
      "molla", "dardha", "rrushi", "fiku", "arrë", "luledielli", "trëndafili", "liljani", "boronica", "blini",
      "shqiponja", "guri", "flamuri", "kombi", "atdheu", "liria", "paqja", "dashuria", "shpresa", "besimi",
      "punoj", "lexoj", "shkruaj", "flas", "dëgjoj", "shoh", "ec", "vrapoj", "këndoj", "vallëzoj",
      "bëj", "kam", "jam", "them", "pyes", "përgjigjem", "mendoj", "kuptoj", "ndjej", "dua",
      "i madh", "i vogël", "i bukur", "i mirë", "i keq", "i shpejtë", "i ngadaltë", "i fortë", "i dobët", "i ri",
      "i vjetër", "i gjatë", "i shkurtër", "i lartë", "i ulët", "i gjerë", "i ngushtë", "i thellë", "i cekët", "i pastër",
      "sot", "nesër", "dje", "tani", "pastaj", "gjithmonë", "kurrë", "ndonjëherë", "shpesh", "rrallë",
      "këtu", "atje", "lart", "poshtë", "brenda", "jashtë", "afër", "larg", "para", "pas",
    ],
  },
  kosove: {
    label: "Kosovë",
    words: [
      "qika", "qka", "krejt", "meniherë", "përmeni", "hëne", "hëna", "erë", "era", "mirë",
      "mbremje", "mbrëmje", "shpia", "shtëpia", "gjithë", "gjith", "dreq", "hallall", "marshalla", "inaç",
      "çeta", "çete", "kaç", "kaçi", "po", "pesh", "shko", "shkon", "shkom", "shkove",
      "kom", "kon", "kena", "kena", "jena", "jemi", "jane", "janë", "me", "pa",
      "me shku", "me ardh", "me ba", "me than", "me pa", "me lan", "me marr", "me dhân", "me hyp", "me zbrit",
      "tash", "tashi", "natën", "naten", "ditën", "diten", "mëngjes", "mengjes", "mbramje", "mbramja",
      "oj", "a more", "hajde", "hajt", "bre", "more", "mori", "zot", "zoti", "çoban",
      "mal", "mali", "bjeshkë", "bjeshka", "bjeshkët", "karadak", "karadaku", "sharri", "sharr", "rugova",
      "prishtina", "prizreni", "peja", "gjakova", "mitrovica", "ferizaj", "gjilani", "podujeva", "vushtrria", "skënderaj",
      "flija", "tavë", "tava", "qebapa", "qebap", "mantia", "mantije", "sarma", "jufka", "petla",
      "kange", "kënga", "kangë", "vallja", "valle", "vallja e rugovës", "çiftelia", "sharkia", "lahuta", "defi",
      "burrnishe", "burrnesha", "besa", "besën", "mikpritja", "mikpritje", "sofra", "sofra", "odë", "oda",
      "plisi", "plis", "qeleshja", "qeleshja e bardhë", "xhubleta", "xhubletën", "jeleku", "jelek", "brezat", "brezi",
      "dreqin", "hajde mo", "po pra", "shej", "shejtan", "kushëri", "kusheri", "nip", "mbesa", "mbese",
    ],
  },
};

export function generateWords(dictionary: Dictionary, count: number): string[] {
  const bank = DICTIONARIES[dictionary].words;
  const result: string[] = [];
  let prev = -1;
  for (let i = 0; i < count; i++) {
    let idx = Math.floor(Math.random() * bank.length);
    if (idx === prev) idx = (idx + 1) % bank.length;
    prev = idx;
    result.push(bank[idx]!);
  }
  return result;
}

/** Maps ë→e and ç→c (both cases) for US-keyboard friendly typing. */
export function simplifyAlbanian(word: string): string {
  return word.replace(/ë/g, "e").replace(/Ë/g, "E").replace(/ç/g, "c").replace(/Ç/g, "C");
}
