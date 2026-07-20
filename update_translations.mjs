import fs from 'fs';

let content = fs.readFileSync('src/lib/mddw/translations.ts', 'utf-8');

const missingKeys = [
  "ing_idli_with_peanut_chutney_veg",
  "ing_pesarattu_with_upma_nuts",
  "ing_pesarattu_with_upma_veg",
  "ing_uggani_with_bajji_veg",
  "ing_uggani_with_bajji_nuts",
  "ing_uggani_with_bajji_pulses",
  "ing_minapa_dosa_with_tomato_chutney_veg",
  "ing_pongal_nuts",
  "ing_pongal_veg",
  "ing_puri_with_potato_curry_roots",
  "ing_puri_with_potato_curry_veg",
  "dish_masala_dosa",
  "ing_masala_dosa_grains",
  "ing_masala_dosa_roots",
  "ing_masala_dosa_nuts",
  "ing_masala_dosa_pulses",
  "ing_masala_dosa_veg",
  "ing_rice_with_gutti_vankaya_kura_veg",
  "ing_rice_with_sambar_and_cabbage_poriyal_veg",
  "ing_rice_with_sambar_and_cabbage_poriyal_nuts",
  "ing_lemon_rice_with_curd_pulses",
  "ing_lemon_rice_with_curd_nuts",
  "dish_fish_curry_with_rice",
  "ing_fish_curry_with_rice_grains",
  "ing_fish_curry_with_rice_meat",
  "ing_fish_curry_with_rice_veg",
  "dish_egg_curry_with_rice",
  "ing_egg_curry_with_rice_grains",
  "ing_egg_curry_with_rice_eggs",
  "ing_egg_curry_with_rice_veg",
  "ing_mirchi_bajji_veg",
  "ing_mirchi_bajji_pulses",
  "ing_mirchi_bajji_leafy",
  "ing_bobbatlu_dairy",
  "ing_bobbatlu_nuts",
  "ing_punugulu_with_coconut_chutney_nuts",
  "ing_punugulu_with_coconut_chutney_leafy",
  "ing_atukulu_with_roasted_chana_nuts",
  "ing_upma_grains",
  "ing_ragi_sangati_with_groundnut_chutney_pulses",
  "ing_tomato_pappu_with_rice_veg",
  "dish_dal_rice",
  "ing_dal_rice_grains",
  "ing_dal_rice_pulses",
  "dish_roti_sabzi",
  "ing_roti_sabzi_grains",
  "ing_roti_sabzi_veg",
  "dish_bhindi_masala_rice",
  "ing_bhindi_masala_rice_grains",
  "ing_bhindi_masala_rice_veg",
  "dish_palak_paneer_roti",
  "ing_palak_paneer_roti_grains",
  "ing_palak_paneer_roti_dairy",
  "ing_palak_paneer_roti_leafy"
];

function generateEn(key) {
  if (key.startsWith('dish_')) {
    return key.replace('dish_', '').split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }
  if (key.startsWith('ing_')) {
    if (key.endsWith('_veg')) return "Vegetables";
    if (key.endsWith('_nuts')) return "Nuts/Seeds";
    if (key.endsWith('_pulses')) return "Pulses/Dal";
    if (key.endsWith('_roots')) return "Roots (Potato)";
    if (key.endsWith('_grains')) return "Grains/Millets";
    if (key.endsWith('_meat')) return "Meat/Fish";
    if (key.endsWith('_eggs')) return "Eggs";
    if (key.endsWith('_leafy')) return "Leafy Greens";
    if (key.endsWith('_dairy')) return "Dairy (Ghee/Butter)";
    return "Ingredient";
  }
  return key;
}

function generateHi(key) {
  if (key === 'dish_masala_dosa') return "मसाला डोसा";
  if (key === 'dish_fish_curry_with_rice') return "फिश करी और चावल";
  if (key === 'dish_egg_curry_with_rice') return "अंडा करी और चावल";
  if (key === 'dish_dal_rice') return "दाल चावल";
  if (key === 'dish_roti_sabzi') return "रोटी सब्ज़ी";
  if (key === 'dish_bhindi_masala_rice') return "भिंडी मसाला और चावल";
  if (key === 'dish_palak_paneer_roti') return "पालक पनीर और रोटी";
  
  if (key.startsWith('ing_')) {
    if (key.endsWith('_veg')) return "सब्जियां";
    if (key.endsWith('_nuts')) return "मेवे/बीज";
    if (key.endsWith('_pulses')) return "दाल";
    if (key.endsWith('_roots')) return "आलू";
    if (key.endsWith('_grains')) return "अनाज";
    if (key.endsWith('_meat')) return "मांस/मछली";
    if (key.endsWith('_eggs')) return "अंडे";
    if (key.endsWith('_leafy')) return "हरी पत्तेदार सब्जियां";
    if (key.endsWith('_dairy')) return "डेयरी (घी/मक्खन)";
  }
  return generateEn(key);
}

function generateTe(key) {
  if (key === 'dish_masala_dosa') return "మసాలా దోశ";
  if (key === 'dish_fish_curry_with_rice') return "చేపల కూర మరియు అన్నం";
  if (key === 'dish_egg_curry_with_rice') return "గుడ్డు కూర మరియు అన్నం";
  if (key === 'dish_dal_rice') return "పప్పు అన్నం";
  if (key === 'dish_roti_sabzi') return "రోటి కూర";
  if (key === 'dish_bhindi_masala_rice') return "బెండకాయ మసాలా మరియు అన్నం";
  if (key === 'dish_palak_paneer_roti') return "పాలక్ పనీర్ మరియు రోటి";
  
  if (key.startsWith('ing_')) {
    if (key.endsWith('_veg')) return "కూరగాయలు";
    if (key.endsWith('_nuts')) return "గింజలు/పల్లీలు";
    if (key.endsWith('_pulses')) return "పప్పులు";
    if (key.endsWith('_roots')) return "బంగాళదుంప";
    if (key.endsWith('_grains')) return "ధాన్యాలు/చిరుధాన్యాలు";
    if (key.endsWith('_meat')) return "మాంసం/చేపలు";
    if (key.endsWith('_eggs')) return "గుడ్లు";
    if (key.endsWith('_leafy')) return "ఆకుకూరలు";
    if (key.endsWith('_dairy')) return "నెయ్యి/వెన్న";
  }
  return generateEn(key);
}

function insertAtEnd(dictName, generateFn) {
  const dictStart = content.indexOf(`const ${dictName}: Dict = {`);
  const dictEnd = content.indexOf(`};`, dictStart);
  
  let newEntries = [];
  for (const key of missingKeys) {
    newEntries.push(`  ${key}: "${generateFn(key)}",`);
  }
  
  content = content.slice(0, dictEnd) + newEntries.join('\n') + '\n' + content.slice(dictEnd);
}

insertAtEnd('en', generateEn);
insertAtEnd('hi', generateHi);
insertAtEnd('te', generateTe);

fs.writeFileSync('src/lib/mddw/translations.ts', content, 'utf-8');
console.log("Updated translations.ts!");
