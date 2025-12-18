import React, { useState, useRef } from 'react';

// Detailed ingredient information database
const INGREDIENT_DETAILS = {
  'high fructose corn syrup': {
    severity: 'high',
    category: 'Sweetener',
    shortReason: 'Industrial sweetener linked to metabolic issues',
    details: 'High fructose corn syrup (HFCS) is an industrial sweetener made by converting corn starch to glucose, then partially converting it to fructose. Unlike table sugar, HFCS is processed differently by the liver, potentially contributing to fatty liver disease, insulin resistance, and metabolic syndrome. Studies have linked high HFCS consumption to obesity, type 2 diabetes, and cardiovascular disease. It\'s ubiquitous in processed foods because it\'s cheaper than sugar and extends shelf life.',
    alternatives: ['Honey', 'Maple syrup', 'Date sugar', 'Fresh fruit'],
    commonIn: ['Soft drinks', 'Candy', 'Bread', 'Cereals', 'Condiments', 'Yogurt']
  },
  'maltodextrin': {
    severity: 'high',
    category: 'Additive',
    shortReason: 'Highly processed starch, spikes blood sugar',
    details: 'Maltodextrin is a white powder made from corn, rice, potato, or wheat starch through partial hydrolysis. It has a glycemic index of 85-105, higher than table sugar (65), meaning it causes rapid blood sugar spikes. It\'s used as a thickener, filler, and preservative. Research suggests maltodextrin may alter gut bacteria composition, potentially promoting harmful bacteria growth and increasing intestinal inflammation. It provides empty calories with no nutritional value.',
    alternatives: ['Tapioca starch', 'Arrowroot', 'Whole food thickeners'],
    commonIn: ['Protein powders', 'Sugar-free products', 'Salad dressings', 'Chips', 'Instant puddings']
  },
  'sodium nitrite': {
    severity: 'high',
    category: 'Preservative',
    shortReason: 'Preservative linked to health concerns',
    details: 'Sodium nitrite is a synthetic preservative that gives processed meats their pink color and prevents bacterial growth, particularly botulism. When heated or combined with stomach acid and amino acids, nitrites can form nitrosamines, which are potent carcinogens. The WHO classifies processed meats containing nitrites as Group 1 carcinogens. Regular consumption is associated with increased risk of colorectal cancer, stomach cancer, and possibly pancreatic cancer.',
    alternatives: ['Celery powder (natural nitrates)', 'Fresh unprocessed meats', 'Salt-cured without nitrites'],
    commonIn: ['Bacon', 'Hot dogs', 'Deli meats', 'Sausages', 'Ham', 'Jerky']
  },
  'aspartame': {
    severity: 'high',
    category: 'Artificial Sweetener',
    shortReason: 'Artificial sweetener',
    details: 'Aspartame is an artificial sweetener 200x sweeter than sugar, made from aspartic acid and phenylalanine. While FDA-approved, it remains controversial. In 2023, the WHO\'s IARC classified it as "possibly carcinogenic to humans." Some studies link it to headaches, mood changes, and altered gut microbiome. People with phenylketonuria (PKU) must avoid it entirely. Despite being calorie-free, research suggests artificial sweeteners may paradoxically increase sugar cravings and disrupt metabolic responses.',
    alternatives: ['Stevia', 'Monk fruit', 'Small amounts of real sugar', 'Honey'],
    commonIn: ['Diet sodas', 'Sugar-free gum', 'Light yogurts', 'Protein bars', 'Tabletop sweeteners']
  },
  'red 40': {
    severity: 'high',
    category: 'Artificial Color',
    shortReason: 'Synthetic dye',
    details: 'Red 40 (Allura Red AC) is a petroleum-derived synthetic dye and the most widely used food coloring in the US. It\'s banned or requires warning labels in several European countries. Studies have linked it to hyperactivity in children, and some research suggests it may cause hypersensitivity reactions. Animal studies have shown potential genotoxicity and effects on the immune system. It provides no nutritional value and exists solely for visual appeal.',
    alternatives: ['Beet juice', 'Paprika', 'Tomato paste', 'Pomegranate juice'],
    commonIn: ['Candy', 'Cereals', 'Beverages', 'Snack foods', 'Ice cream', 'Baked goods']
  },
  'partially hydrogenated': {
    severity: 'high',
    category: 'Fat',
    shortReason: 'Trans fats',
    details: 'Partially hydrogenated oils are the primary source of artificial trans fats, created by adding hydrogen to liquid oils to make them solid. Trans fats are now recognized as extremely harmful—they raise LDL (bad) cholesterol, lower HDL (good) cholesterol, and significantly increase heart disease risk. The FDA banned them in 2018, but products manufactured before the deadline may still contain them. Even small amounts are harmful; there is no safe level of consumption.',
    alternatives: ['Olive oil', 'Avocado oil', 'Coconut oil', 'Butter (in moderation)'],
    commonIn: ['Some margarines', 'Shortening', 'Fried foods', 'Baked goods', 'Non-dairy creamers']
  },
  'monosodium glutamate': {
    severity: 'medium',
    category: 'Flavor Enhancer',
    shortReason: 'Flavor enhancer',
    details: 'MSG is the sodium salt of glutamic acid, an amino acid naturally found in many foods like tomatoes and parmesan. While generally recognized as safe by the FDA, some people report sensitivity symptoms including headaches, flushing, and sweating ("MSG symptom complex"). The main concern is that MSG makes processed foods hyper-palatable, encouraging overconsumption. It\'s often hidden under names like "natural flavoring," "hydrolyzed protein," or "yeast extract."',
    alternatives: ['Mushrooms', 'Aged cheeses', 'Tomato paste', 'Seaweed'],
    commonIn: ['Chinese food', 'Chips', 'Instant noodles', 'Soups', 'Processed meats', 'Seasoning blends']
  },
  'carrageenan': {
    severity: 'medium',
    category: 'Thickener',
    shortReason: 'Thickener with gut health concerns',
    details: 'Carrageenan is derived from red seaweed and used as a thickener and stabilizer. While it sounds natural, research has raised concerns about gut inflammation. Degraded carrageenan (poligeenan) is a known carcinogen, and some studies suggest food-grade carrageenan may degrade in the digestive system. It\'s been linked to intestinal inflammation, glucose intolerance, and may exacerbate inflammatory bowel conditions. Some organic standards have moved to ban it.',
    alternatives: ['Guar gum', 'Locust bean gum', 'Gelatin', 'Agar'],
    commonIn: ['Non-dairy milks', 'Ice cream', 'Deli meats', 'Infant formula', 'Cottage cheese']
  },
  'palm oil': {
    severity: 'medium',
    category: 'Fat',
    shortReason: 'Refined industrial oil',
    details: 'Palm oil is extracted from oil palm fruit and is the world\'s most consumed vegetable oil. While not inherently unhealthy, most palm oil is highly refined and processed at high temperatures, which can create harmful compounds. It\'s high in saturated fat (50%), which in excess raises LDL cholesterol. Beyond health, palm oil production is linked to massive deforestation, habitat destruction, and climate change. Its presence often indicates a highly processed product.',
    alternatives: ['Olive oil', 'Avocado oil', 'Coconut oil', 'Sunflower oil'],
    commonIn: ['Cookies', 'Crackers', 'Chocolate', 'Margarine', 'Ice cream', 'Instant noodles']
  },
  'natural flavor': {
    severity: 'low',
    category: 'Flavoring',
    shortReason: 'Often industrially extracted',
    details: '"Natural flavors" is a catch-all term that can include hundreds of chemicals derived from natural sources through industrial processes. While the source is natural, the extraction and combination process is highly industrial. These flavors are designed by flavor scientists to make processed foods more addictive and appealing. The term is intentionally vague, preventing consumers from knowing what they\'re actually eating. They\'re generally safe but indicate a processed product.',
    alternatives: ['Whole herbs and spices', 'Fresh citrus zest', 'Real vanilla', 'Actual fruit'],
    commonIn: ['Almost all processed foods', 'Beverages', 'Snacks', 'Frozen meals']
  },
  'soy lecithin': {
    severity: 'low',
    category: 'Emulsifier',
    shortReason: 'Common emulsifier',
    details: 'Soy lecithin is a byproduct of soybean oil production, used as an emulsifier to keep ingredients from separating. It\'s generally considered safe and may even have health benefits—lecithin is a source of choline, important for brain health. However, most soy in the US is GMO (unless organic), and some people have soy allergies. Its presence indicates processing, but it\'s one of the more benign additives. Sunflower lecithin is a non-GMO alternative.',
    alternatives: ['Sunflower lecithin', 'Egg yolk', 'Mustard'],
    commonIn: ['Chocolate', 'Baked goods', 'Margarine', 'Salad dressings', 'Infant formula']
  },
  'citric acid': {
    severity: 'low',
    category: 'Preservative/Acidulant',
    shortReason: 'Usually fine, industrially produced',
    details: 'Citric acid occurs naturally in citrus fruits but is industrially produced via fermentation using Aspergillus niger mold, often on corn substrates. It\'s used as a preservative, flavor enhancer, and to adjust acidity. While generally recognized as safe, some people with mold sensitivities or corn allergies may react. Industrially-produced citric acid is chemically identical to natural citric acid. It\'s one of the most common and generally harmless additives.',
    alternatives: ['Lemon juice', 'Lime juice', 'Vinegar'],
    commonIn: ['Soft drinks', 'Candy', 'Canned foods', 'Frozen foods', 'Wine']
  },
  'xanthan gum': {
    severity: 'low',
    category: 'Thickener',
    shortReason: 'Industrial thickener',
    details: 'Xanthan gum is produced by fermenting sugar with Xanthomonas campestris bacteria. It\'s an effective thickener and stabilizer used in tiny amounts. While generally safe, it can cause digestive issues in large quantities (bloating, gas). Some people with corn, wheat, or soy allergies may react since these are common fermentation substrates. It\'s commonly used in gluten-free baking as a gluten substitute. In small amounts, it\'s considered one of the safer additives.',
    alternatives: ['Psyllium husk', 'Chia seeds', 'Flax meal', 'Agar'],
    commonIn: ['Salad dressings', 'Sauces', 'Ice cream', 'Gluten-free baked goods', 'Cosmetics']
  },
  'titanium dioxide': {
    severity: 'high',
    category: 'Whitener',
    shortReason: 'Industrial whitener',
    details: 'Titanium dioxide (E171) is a white pigment used to brighten foods and make them appear more appealing. It provides no nutritional value. The EU banned it in food in 2022 due to concerns about genotoxicity—potential DNA damage that could lead to cancer. Studies show nanoparticles can accumulate in organs and cross the blood-brain barrier. It\'s still permitted in the US, but many major brands are removing it due to consumer pressure and lawsuits.',
    alternatives: ['Calcium carbonate', 'Rice starch', 'Products without whiteners'],
    commonIn: ['Candy', 'Frosting', 'Coffee creamer', 'Chewing gum', 'Supplements', 'Toothpaste']
  },
  'polysorbate': {
    severity: 'high',
    category: 'Emulsifier',
    shortReason: 'Industrial emulsifier',
    details: 'Polysorbates (like Polysorbate 80) are synthetic emulsifiers made from sorbitol and fatty acids. Research has raised serious concerns—animal studies show they can damage the gut lining, alter gut microbiome composition, and promote inflammation that may contribute to inflammatory bowel disease and metabolic syndrome. They allow water and oil to mix, extending shelf life of processed foods. The EU has set strict limits, but US limits are higher.',
    alternatives: ['Sunflower lecithin', 'Egg yolk', 'Gum arabic'],
    commonIn: ['Ice cream', 'Salad dressings', 'Sauces', 'Baked goods', 'Vaccines', 'Cosmetics']
  },
  'tbhq': {
    severity: 'high',
    category: 'Preservative',
    shortReason: 'Synthetic antioxidant',
    details: 'TBHQ (tert-Butylhydroquinone) is a synthetic antioxidant derived from butane, used to extend shelf life by preventing oils from going rancid. High doses have caused stomach tumors in lab animals. It may weaken the immune system\'s response to influenza and reduce vaccine effectiveness. The FDA limits it to 0.02% of oil content, but it accumulates in the body over time. It\'s often found in products with long shelf lives.',
    alternatives: ['Vitamin E (tocopherols)', 'Rosemary extract', 'Fresh foods without preservatives'],
    commonIn: ['Frozen fish', 'Fast food', 'Crackers', 'Noodles', 'Microwave popcorn', 'Chicken nuggets']
  },
  'azodicarbonamide': {
    severity: 'high',
    category: 'Dough Conditioner',
    shortReason: 'Dough conditioner, banned in EU',
    details: 'Azodicarbonamide (ADA) is used to bleach flour and condition dough, making bread softer and more consistent. It\'s banned in the EU, Australia, and many other countries. When baked, it breaks down into semicarbazide and urethane, both potential carcinogens. It\'s also used to make yoga mats and shoe soles. The "Subway yoga mat" controversy in 2014 led many companies to remove it, but it\'s still legal in the US.',
    alternatives: ['Ascorbic acid', 'Enzymes', 'Unbleached flour', 'Traditional bread-making'],
    commonIn: ['Commercial bread', 'Burger buns', 'Frozen dough', 'Packaged baked goods']
  },
  'sucralose': {
    severity: 'high',
    category: 'Artificial Sweetener',
    shortReason: 'Artificial sweetener',
    details: 'Sucralose (Splenda) is an artificial sweetener made by chlorinating sugar, making it 600x sweeter than sugar. Recent research has raised concerns—it may damage DNA, alter gut bacteria, and affect blood sugar regulation despite being marketed as "diabetic-friendly." A 2023 study found it caused DNA damage at levels equivalent to drinking 3-4 diet sodas. When heated, it can release toxic compounds called chloropropanols.',
    alternatives: ['Stevia', 'Monk fruit', 'Small amounts of real sugar', 'Honey'],
    commonIn: ['Diet drinks', 'Sugar-free products', 'Protein powders', 'Baked goods', 'Chewing gum']
  },
  'sodium benzoate': {
    severity: 'medium',
    category: 'Preservative',
    shortReason: 'Synthetic preservative',
    details: 'Sodium benzoate is a synthetic preservative that prevents mold and bacteria growth. The main concern is that when combined with vitamin C (ascorbic acid), it can form benzene, a known carcinogen. This reaction is accelerated by heat and light. Some studies link it to hyperactivity in children when combined with artificial colors. It may also deplete mitochondria of oxygen, potentially accelerating aging and disease.',
    alternatives: ['Vitamin E', 'Rosemary extract', 'Proper refrigeration'],
    commonIn: ['Soft drinks', 'Fruit juices', 'Pickles', 'Salad dressings', 'Condiments']
  },
  'enriched flour': {
    severity: 'low',
    category: 'Grain',
    shortReason: 'Refined with added vitamins',
    details: 'Enriched flour is white flour that has had nutrients added back after processing stripped them away. Whole wheat has over 20 nutrients; enriched flour adds back only 5. The fiber, healthy fats, and many vitamins are permanently lost. Enriched flour spikes blood sugar similarly to sugar. While not harmful per se, it indicates a highly processed product and provides far less nutrition than whole grains. It\'s essentially refined carbohydrates with synthetic vitamins.',
    alternatives: ['Whole wheat flour', 'Almond flour', 'Oat flour', 'Coconut flour'],
    commonIn: ['White bread', 'Pasta', 'Crackers', 'Cookies', 'Cakes', 'Most baked goods']
  },
  'mono and diglycerides': {
    severity: 'medium',
    category: 'Emulsifier',
    shortReason: 'Industrial emulsifier',
    details: 'Mono and diglycerides are fat-based emulsifiers that keep ingredients mixed and extend shelf life. While similar to natural fats, they may contain artificial trans fats that don\'t have to be labeled. Research shows they can alter gut bacteria and potentially increase intestinal inflammation. They\'re made industrially from glycerol and fatty acids. While generally recognized as safe, their presence indicates a processed food designed for long shelf life.',
    alternatives: ['Egg yolks', 'Lecithin', 'Whole food emulsifiers'],
    commonIn: ['Bread', 'Peanut butter', 'Ice cream', 'Margarine', 'Whipped cream']
  },
  'cellulose': {
    severity: 'medium',
    category: 'Filler',
    shortReason: 'Wood pulp filler',
    details: 'Cellulose is plant fiber, often derived from wood pulp or cotton. It\'s used as a filler, thickener, and anti-caking agent. While technically fiber and indigestible (thus calorie-free), it provides none of the benefits of dietary fiber from whole foods. It\'s used to bulk up processed foods cheaply. Powdered cellulose in shredded cheese prevents clumping but also prevents proper melting. It\'s not harmful but indicates cost-cutting and processing.',
    alternatives: ['Whole food thickeners', 'Real cheese without anti-caking agents'],
    commonIn: ['Shredded cheese', 'Ice cream', 'Bread', 'Sauces', 'Supplements']
  },
  'caramel color': {
    severity: 'medium',
    category: 'Color',
    shortReason: 'Industrial coloring, may contain 4-MEI',
    details: 'Caramel color is the most widely used food coloring, giving colas and many foods their brown color. The concern is 4-MEI (4-methylimidazole), a byproduct of certain manufacturing processes, which is a possible carcinogen. California requires warning labels above certain levels. Class III and IV caramel colors (made with ammonia) have the highest 4-MEI. While moderate consumption is likely fine, it provides no benefit other than appearance.',
    alternatives: ['Molasses', 'Cocoa', 'Coffee extract', 'Beet sugar'],
    commonIn: ['Cola', 'Beer', 'Soy sauce', 'Bread', 'Gravy', 'Candy']
  }
};

// Expand UPF_MARKERS with detail lookups
const UPF_MARKERS = [
  { ingredient: 'high fructose corn syrup', severity: 'high', reason: 'Industrial sweetener linked to metabolic issues' },
  { ingredient: 'hfcs', severity: 'high', reason: 'Industrial sweetener linked to metabolic issues' },
  { ingredient: 'maltodextrin', severity: 'high', reason: 'Highly processed starch, spikes blood sugar' },
  { ingredient: 'dextrose', severity: 'medium', reason: 'Industrial sugar derivative' },
  { ingredient: 'modified starch', severity: 'high', reason: 'Chemically altered starch' },
  { ingredient: 'modified food starch', severity: 'high', reason: 'Chemically altered starch' },
  { ingredient: 'modified corn starch', severity: 'high', reason: 'Chemically altered starch' },
  { ingredient: 'hydrolyzed', severity: 'high', reason: 'Industrially broken down proteins' },
  { ingredient: 'protein isolate', severity: 'high', reason: 'Extracted and processed protein' },
  { ingredient: 'soy protein isolate', severity: 'high', reason: 'Heavily processed soy derivative' },
  { ingredient: 'whey protein isolate', severity: 'medium', reason: 'Processed protein extract' },
  { ingredient: 'invert sugar', severity: 'medium', reason: 'Chemically modified sugar' },
  { ingredient: 'glucose syrup', severity: 'high', reason: 'Industrial sugar' },
  { ingredient: 'corn syrup', severity: 'high', reason: 'Industrial sweetener' },
  { ingredient: 'aspartame', severity: 'high', reason: 'Artificial sweetener' },
  { ingredient: 'sucralose', severity: 'high', reason: 'Artificial sweetener' },
  { ingredient: 'acesulfame', severity: 'high', reason: 'Artificial sweetener' },
  { ingredient: 'saccharin', severity: 'high', reason: 'Artificial sweetener' },
  { ingredient: 'sodium nitrite', severity: 'high', reason: 'Preservative linked to health concerns' },
  { ingredient: 'sodium nitrate', severity: 'high', reason: 'Preservative linked to health concerns' },
  { ingredient: 'bha', severity: 'high', reason: 'Synthetic antioxidant' },
  { ingredient: 'bht', severity: 'high', reason: 'Synthetic antioxidant' },
  { ingredient: 'tbhq', severity: 'high', reason: 'Synthetic antioxidant' },
  { ingredient: 'monosodium glutamate', severity: 'medium', reason: 'Flavor enhancer' },
  { ingredient: 'msg', severity: 'medium', reason: 'Flavor enhancer' },
  { ingredient: 'disodium inosinate', severity: 'medium', reason: 'Flavor enhancer' },
  { ingredient: 'disodium guanylate', severity: 'medium', reason: 'Flavor enhancer' },
  { ingredient: 'autolyzed yeast', severity: 'medium', reason: 'Flavor enhancer (hidden MSG)' },
  { ingredient: 'yeast extract', severity: 'medium', reason: 'Flavor enhancer (hidden MSG)' },
  { ingredient: 'carrageenan', severity: 'medium', reason: 'Thickener with gut health concerns' },
  { ingredient: 'xanthan gum', severity: 'low', reason: 'Industrial thickener' },
  { ingredient: 'guar gum', severity: 'low', reason: 'Industrial thickener' },
  { ingredient: 'cellulose', severity: 'medium', reason: 'Wood pulp filler' },
  { ingredient: 'methylcellulose', severity: 'medium', reason: 'Synthetic cellulose' },
  { ingredient: 'polysorbate', severity: 'high', reason: 'Industrial emulsifier' },
  { ingredient: 'mono and diglycerides', severity: 'medium', reason: 'Industrial emulsifier' },
  { ingredient: 'sodium stearoyl lactylate', severity: 'medium', reason: 'Synthetic emulsifier' },
  { ingredient: 'datem', severity: 'medium', reason: 'Dough conditioner' },
  { ingredient: 'artificial flavor', severity: 'high', reason: 'Synthetic flavoring compounds' },
  { ingredient: 'natural flavor', severity: 'low', reason: 'Often industrially extracted' },
  { ingredient: 'natural flavors', severity: 'low', reason: 'Often industrially extracted' },
  { ingredient: 'caramel color', severity: 'medium', reason: 'Industrial coloring, may contain 4-MEI' },
  { ingredient: 'red 40', severity: 'high', reason: 'Synthetic dye' },
  { ingredient: 'red 3', severity: 'high', reason: 'Synthetic dye' },
  { ingredient: 'yellow 5', severity: 'high', reason: 'Synthetic dye (tartrazine)' },
  { ingredient: 'yellow 6', severity: 'high', reason: 'Synthetic dye' },
  { ingredient: 'blue 1', severity: 'high', reason: 'Synthetic dye' },
  { ingredient: 'titanium dioxide', severity: 'high', reason: 'Industrial whitener' },
  { ingredient: 'partially hydrogenated', severity: 'high', reason: 'Trans fats' },
  { ingredient: 'hydrogenated oil', severity: 'high', reason: 'Trans fats' },
  { ingredient: 'interesterified', severity: 'high', reason: 'Chemically modified fats' },
  { ingredient: 'palm oil', severity: 'medium', reason: 'Refined industrial oil' },
  { ingredient: 'vegetable oil', severity: 'low', reason: 'Often highly refined' },
  { ingredient: 'soybean oil', severity: 'low', reason: 'Industrially processed' },
  { ingredient: 'sodium benzoate', severity: 'medium', reason: 'Synthetic preservative' },
  { ingredient: 'potassium sorbate', severity: 'low', reason: 'Preservative' },
  { ingredient: 'phosphate', severity: 'medium', reason: 'Industrial additive' },
  { ingredient: 'sodium phosphate', severity: 'medium', reason: 'Industrial additive' },
  { ingredient: 'soy lecithin', severity: 'low', reason: 'Common emulsifier' },
  { ingredient: 'lecithin', severity: 'low', reason: 'Emulsifier, usually fine' },
  { ingredient: 'citric acid', severity: 'low', reason: 'Usually fine, industrially produced' },
  { ingredient: 'dimethylpolysiloxane', severity: 'high', reason: 'Anti-foaming agent (silicone)' },
  { ingredient: 'bleached flour', severity: 'medium', reason: 'Chemically treated flour' },
  { ingredient: 'enriched flour', severity: 'low', reason: 'Refined with added vitamins' },
  { ingredient: 'azodicarbonamide', severity: 'high', reason: 'Dough conditioner, banned in EU' },
  { ingredient: 'sulfites', severity: 'medium', reason: 'Preservative' }
];

const WHOLE_FOODS = {
  'apple': { score: 1, nova: 1, category: 'Fruit', note: 'Whole fruit, eat freely' },
  'banana': { score: 1, nova: 1, category: 'Fruit', note: 'Whole fruit, great potassium source' },
  'orange': { score: 1, nova: 1, category: 'Fruit', note: 'Whole fruit, high in vitamin C' },
  'strawberry': { score: 1, nova: 1, category: 'Fruit', note: 'Whole fruit, rich in antioxidants' },
  'blueberry': { score: 1, nova: 1, category: 'Fruit', note: 'Whole fruit, antioxidant powerhouse' },
  'grape': { score: 1, nova: 1, category: 'Fruit', note: 'Whole fruit' },
  'mango': { score: 1, nova: 1, category: 'Fruit', note: 'Whole fruit, high in vitamins A and C' },
  'avocado': { score: 1, nova: 1, category: 'Fruit', note: 'Whole fruit, healthy fats' },
  'broccoli': { score: 1, nova: 1, category: 'Vegetable', note: 'Cruciferous vegetable, very nutritious' },
  'carrot': { score: 1, nova: 1, category: 'Vegetable', note: 'Root vegetable, high in beta-carotene' },
  'spinach': { score: 1, nova: 1, category: 'Vegetable', note: 'Leafy green, iron and vitamins' },
  'tomato': { score: 1, nova: 1, category: 'Vegetable', note: 'Rich in lycopene' },
  'egg': { score: 1, nova: 1, category: 'Protein', note: 'Complete protein, very nutritious' },
  'chicken': { score: 1, nova: 1, category: 'Protein', note: 'Whole meat (if unprocessed)' },
  'salmon': { score: 1, nova: 1, category: 'Protein', note: 'Fatty fish, omega-3 rich' },
  'rice': { score: 1, nova: 1, category: 'Grain', note: 'Whole grain' },
  'oats': { score: 1, nova: 1, category: 'Grain', note: 'Whole grain, beta-glucan' },
  'almonds': { score: 1, nova: 1, category: 'Nut', note: 'Healthy fats, vitamin E' },
  'olive oil': { score: 2, nova: 2, category: 'Oil', note: 'Healthy fat, use for cooking' },
  'butter': { score: 2, nova: 2, category: 'Dairy', note: 'Culinary fat, use in moderation' },
  'honey': { score: 2, nova: 2, category: 'Sweetener', note: 'Natural sweetener' },
};

const NOVA_CATEGORIES = {
  1: { name: 'Unprocessed or Minimally Processed', color: '#22c55e', bgColor: '#dcfce7', verdict: 'Excellent — eat freely' },
  2: { name: 'Processed Culinary Ingredients', color: '#84cc16', bgColor: '#ecfccb', verdict: 'Fine in moderation' },
  3: { name: 'Processed Foods', color: '#f59e0b', bgColor: '#fef3c7', verdict: 'Acceptable — limit consumption' },
  4: { name: 'Ultra-Processed Foods (UPF)', color: '#ef4444', bgColor: '#fee2e2', verdict: 'Minimize or avoid' }
};

export default function UPFAnalyzer() {
  const [input, setInput] = useState('');
  const [inputMode, setInputMode] = useState('text');
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState(null);
  const [extractedIngredients, setExtractedIngredients] = useState('');
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [askingAI, setAskingAI] = useState(false);
  const [aiResponse, setAiResponse] = useState(null);
  const [customQuestion, setCustomQuestion] = useState('');
  const fileInputRef = useRef(null);

  const analyzeIngredients = (ingredientList) => {
    const normalized = ingredientList.toLowerCase();
    const foundMarkers = [];
    let highestSeverity = 'none';
    const severityOrder = { none: 0, low: 1, medium: 2, high: 3 };
    const alreadyFound = new Set();
    
    for (const marker of UPF_MARKERS) {
      if (normalized.includes(marker.ingredient) && !alreadyFound.has(marker.ingredient)) {
        foundMarkers.push(marker);
        alreadyFound.add(marker.ingredient);
        if (severityOrder[marker.severity] > severityOrder[highestSeverity]) {
          highestSeverity = marker.severity;
        }
      }
    }
    
    let nova = 1;
    const ingredientCount = (normalized.match(/,/g) || []).length + 1;
    
    if (foundMarkers.length === 0) {
      if (ingredientCount <= 3) {
        const hasBasicProcessing = normalized.includes('salt') || normalized.includes('sugar') || normalized.includes('oil');
        nova = hasBasicProcessing ? 2 : 1;
      } else {
        nova = 3;
      }
    } else if (foundMarkers.some(m => m.severity === 'high') || foundMarkers.some(m => m.severity === 'medium') || foundMarkers.length > 3) {
      nova = 4;
    } else if (foundMarkers.length > 0) {
      nova = ingredientCount > 5 ? 4 : 3;
    }
    
    foundMarkers.sort((a, b) => severityOrder[b.severity] - severityOrder[a.severity]);
    
    let score = 1;
    if (nova === 1) score = 1;
    else if (nova === 2) score = 2;
    else if (nova === 3) score = 3 + Math.min(foundMarkers.length, 2);
    else {
      const highCount = foundMarkers.filter(m => m.severity === 'high').length;
      const mediumCount = foundMarkers.filter(m => m.severity === 'medium').length;
      score = Math.min(10, Math.max(5, Math.round(5 + highCount * 1.5 + mediumCount * 0.5)));
      if (highCount >= 5) score = Math.max(score, 9);
      if (highCount >= 8) score = 10;
    }
    
    return { nova, severity: highestSeverity, markers: foundMarkers, ingredientCount, rawText: ingredientList, score };
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setResult(null);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    setError(null);
    setExtractedIngredients('');
    setSelectedIngredient(null);
    setAiResponse(null);
    
    if (inputMode === 'text') {
      if (!input.trim()) return;
      setIsAnalyzing(true);
      setTimeout(() => {
        setResult(analyzeIngredients(input));
        setIsAnalyzing(false);
      }, 300);
    } else if (inputMode === 'label') {
      if (!imageFile) return;
      setIsAnalyzing(true);
      try {
        const base64Data = imagePreview.split(',')[1];
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 1000,
            messages: [{ role: 'user', content: [
              { type: 'image', source: { type: 'base64', media_type: imageFile.type, data: base64Data } },
              { type: 'text', text: 'Extract the ingredients list from this food label. Return ONLY the ingredients as a comma-separated list. If not readable, respond: ERROR: Could not read' }
            ]}]
          })
        });
        const data = await response.json();
        const text = data.content[0].text;
        if (text.startsWith('ERROR:')) {
          setError('Could not read ingredients. Try a clearer photo.');
        } else {
          setExtractedIngredients(text);
          setResult(analyzeIngredients(text));
        }
      } catch (err) {
        setError('Failed to analyze image.');
      }
      setIsAnalyzing(false);
    } else if (inputMode === 'food') {
      if (!imageFile) return;
      setIsAnalyzing(true);
      try {
        const base64Data = imagePreview.split(',')[1];
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            messages: [{ role: 'user', content: [
              { type: 'image', source: { type: 'base64', media_type: imageFile.type, data: base64Data } },
              { type: 'text', text: `Identify this food. If it's a branded/packaged product (like a Big Mac, Oreos, Coca-Cola, Dave's Killer Bread, etc.), provide the typical/known ingredients. If it's a whole food (apple, banana, raw chicken), note that.

Respond in this exact JSON format only:
{
  "food": "name of food/product",
  "brand": "brand name or null",
  "isWholeFood": true/false,
  "isPackaged": true/false,
  "category": "category",
  "ingredients": "comma-separated ingredient list (actual ingredients if known branded product, typical ingredients if generic packaged food, or just the food name if whole food)",
  "confidence": "high/medium/low",
  "notes": "any relevant notes about this product's processing level"
}

If you cannot identify: {"error": "Could not identify"}` }
            ]}]
          })
        });
        const data = await response.json();
        const text = data.content[0].text;
        try {
          const parsed = JSON.parse(text);
          if (parsed.error) {
            setError('Could not identify the food.');
          } else if (parsed.isWholeFood) {
            const foodLower = parsed.food.toLowerCase();
            let wholeFood = null;
            for (const [key, value] of Object.entries(WHOLE_FOODS)) {
              if (foodLower.includes(key)) { wholeFood = { name: key, ...value }; break; }
            }
            setResult({
              type: 'wholeFood',
              name: parsed.food,
              brand: parsed.brand,
              ...(wholeFood || { score: 1, nova: 1, category: parsed.category, note: 'Whole, unprocessed food' }),
              markers: [],
              ingredientCount: 1,
              confidence: parsed.confidence,
              notes: parsed.notes
            });
          } else {
            setExtractedIngredients(parsed.ingredients);
            const analysis = analyzeIngredients(parsed.ingredients);
            setResult({
              ...analysis,
              type: 'identifiedFood',
              name: parsed.food,
              brand: parsed.brand,
              confidence: parsed.confidence,
              notes: parsed.notes
            });
          }
        } catch (e) {
          setError('Could not parse response.');
        }
      } catch (err) {
        setError('Failed to analyze.');
      }
      setIsAnalyzing(false);
    }
  };

  const askAboutIngredient = async (ingredient, question) => {
    setAskingAI(true);
    setAiResponse(null);
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1000,
          messages: [{ role: 'user', content: question || `Tell me about "${ingredient}" as a food additive. Cover: what it is, how it's made, health concerns, and healthier alternatives. Be concise but informative. Format with clear sections.` }]
        })
      });
      const data = await response.json();
      setAiResponse(data.content[0].text);
    } catch (err) {
      setAiResponse('Failed to get information. Please try again.');
    }
    setAskingAI(false);
  };

  const askAboutFood = async (question) => {
    setAskingAI(true);
    setAiResponse(null);
    try {
      const context = result ? `The food being analyzed is: ${result.name || 'Unknown'}${result.brand ? ` by ${result.brand}` : ''}. Ingredients: ${extractedIngredients || result.rawText || 'Not available'}. NOVA score: ${result.nova}, Avoid score: ${result.score}/10.` : '';
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-20250514',
          max_tokens: 1500,
          messages: [{ role: 'user', content: `${context}\n\nUser question: ${question}\n\nProvide a helpful, concise answer focused on the health and processing aspects of this food.` }]
        })
      });
      const data = await response.json();
      setAiResponse(data.content[0].text);
    } catch (err) {
      setAiResponse('Failed to get response.');
    }
    setAskingAI(false);
  };

  const clearAll = () => {
    setInput('');
    setImagePreview(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    setExtractedIngredients('');
    setSelectedIngredient(null);
    setAiResponse(null);
    setCustomQuestion('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getScoreColor = (score) => {
    if (score <= 2) return '#16a34a';
    if (score <= 4) return '#65a30d';
    if (score <= 6) return '#d97706';
    if (score <= 8) return '#ea580c';
    return '#dc2626';
  };

  const getScoreInfo = (score) => {
    if (score <= 2) return { label: 'Excellent', emoji: '✓' };
    if (score <= 4) return { label: 'Good', emoji: '○' };
    if (score <= 6) return { label: 'Moderate', emoji: '△' };
    if (score <= 8) return { label: 'Poor', emoji: '⚠' };
    return { label: 'Avoid', emoji: '✕' };
  };

  return (
    <div style={{ minHeight: '100vh', background: '#fafaf9', fontFamily: '"Source Sans 3", system-ui, sans-serif', padding: '40px 20px' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Source+Sans+3:wght@400;500;600;700&family=Instrument+Serif&display=swap');
        * { box-sizing: border-box; }
        .card { background: white; border-radius: 16px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); border: 1px solid #e7e5e4; }
        .btn { padding: 12px 24px; border-radius: 10px; font-weight: 600; font-size: 14px; cursor: pointer; border: none; transition: all 0.15s; }
        .btn-primary { background: #1a1a1a; color: white; }
        .btn-primary:hover:not(:disabled) { background: #333; }
        .btn-primary:disabled { background: #d6d3d1; cursor: not-allowed; }
        .btn-secondary { background: #f5f5f4; color: #57534e; border: 1px solid #e7e5e4; }
        .btn-secondary:hover { background: #e7e5e4; }
        .btn-sm { padding: 8px 16px; font-size: 13px; }
        .mode-btn { flex: 1; padding: 10px 16px; border-radius: 10px; font-weight: 500; font-size: 13px; cursor: pointer; border: 2px solid transparent; background: #f5f5f4; color: #78716c; display: flex; align-items: center; justify-content: center; gap: 6px; transition: all 0.15s; }
        .mode-btn.active { background: #1a1a1a; color: white; }
        .mode-btn:not(.active):hover { background: #e7e5e4; }
        textarea, input[type="text"] { width: 100%; padding: 14px; border: 2px solid #e7e5e4; border-radius: 10px; font-size: 14px; font-family: inherit; background: white; resize: vertical; }
        textarea:focus, input[type="text"]:focus { outline: none; border-color: #a8a29e; }
        .upload-zone { border: 2px dashed #d6d3d1; border-radius: 12px; padding: 32px 20px; text-align: center; cursor: pointer; background: #fafaf9; transition: all 0.15s; }
        .upload-zone:hover { border-color: #a8a29e; background: #f5f5f4; }
        .upload-zone.has-image { padding: 16px; border-style: solid; border-color: #e7e5e4; }
        .marker-pill { display: inline-flex; align-items: center; padding: 8px 12px; border-radius: 8px; font-size: 13px; margin: 3px; font-weight: 500; cursor: pointer; transition: all 0.15s; }
        .marker-pill:hover { transform: translateY(-1px); box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .marker-pill.high { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; }
        .marker-pill.medium { background: #fffbeb; color: #b45309; border: 1px solid #fde68a; }
        .marker-pill.low { background: #f0fdf4; color: #15803d; border: 1px solid #bbf7d0; }
        .marker-pill.selected { box-shadow: 0 0 0 2px #1a1a1a; }
        .detail-card { background: #fafaf9; border-radius: 12px; padding: 20px; margin-top: 16px; border: 1px solid #e7e5e4; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .result-card { animation: fadeIn 0.25s ease; }
        .error-box { background: #fef2f2; border: 1px solid #fecaca; border-radius: 10px; padding: 12px 16px; color: #b91c1c; font-size: 14px; margin-top: 16px; }
        .ai-response { white-space: pre-wrap; line-height: 1.6; font-size: 14px; color: #44403c; }
        .confidence-badge { display: inline-flex; padding: 4px 10px; border-radius: 100px; font-size: 11px; font-weight: 600; text-transform: uppercase; }
      `}</style>

      <div style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: '"Instrument Serif", Georgia, serif', fontSize: '38px', fontWeight: '400', color: '#1a1a1a', marginBottom: '8px' }}>
            UPF Analyzer
          </h1>
          <p style={{ color: '#78716c', fontSize: '15px' }}>
            Analyze ingredients, scan labels, or photograph any food
          </p>
        </div>

        {/* Input Card */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
            <button className={`mode-btn ${inputMode === 'text' ? 'active' : ''}`} onClick={() => { setInputMode('text'); clearAll(); }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="16" y2="12"/><line x1="4" y1="18" x2="12" y2="18"/></svg>
              Type
            </button>
            <button className={`mode-btn ${inputMode === 'label' ? 'active' : ''}`} onClick={() => { setInputMode('label'); clearAll(); }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="7" y1="8" x2="17" y2="8"/><line x1="7" y1="12" x2="14" y2="12"/></svg>
              Label
            </button>
            <button className={`mode-btn ${inputMode === 'food' ? 'active' : ''}`} onClick={() => { setInputMode('food'); clearAll(); }}>
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 8v4l2 2"/></svg>
              Food Photo
            </button>
          </div>

          {inputMode === 'text' ? (
            <textarea rows={4} placeholder="Paste ingredients list here..." value={input} onChange={(e) => { setInput(e.target.value); setResult(null); }} style={{ minHeight: '120px' }} />
          ) : (
            <div>
              <input type="file" accept="image/*" onChange={handleImageUpload} ref={fileInputRef} style={{ display: 'none' }} />
              <div className={`upload-zone ${imagePreview ? 'has-image' : ''}`} onClick={() => fileInputRef.current?.click()}>
                {imagePreview ? (
                  <div>
                    <img src={imagePreview} alt="Upload" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px', objectFit: 'contain' }} />
                    <p style={{ margin: '10px 0 0', color: '#78716c', fontSize: '12px' }}>Click to change</p>
                  </div>
                ) : (
                  <div>
                    <div style={{ width: '44px', height: '44px', margin: '0 auto 10px', background: '#e7e5e4', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <svg width="22" height="22" fill="none" stroke="#78716c" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                    </div>
                    <p style={{ margin: 0, color: '#57534e', fontWeight: '500', fontSize: '14px' }}>
                      {inputMode === 'label' ? 'Upload ingredients label' : 'Upload food photo'}
                    </p>
                    <p style={{ margin: '4px 0 0', color: '#a8a29e', fontSize: '13px' }}>
                      {inputMode === 'label' ? 'Photo of the ingredients list' : 'Any food — whole foods, packaged products, branded items'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}

          <div style={{ display: 'flex', gap: '10px', marginTop: '16px' }}>
            <button className="btn btn-primary" onClick={handleAnalyze} disabled={(inputMode === 'text' ? !input.trim() : !imageFile) || isAnalyzing} style={{ flex: 1 }}>
              {isAnalyzing ? 'Analyzing...' : 'Analyze'}
            </button>
            {(input || imagePreview) && <button className="btn btn-secondary" onClick={clearAll}>Clear</button>}
          </div>
        </div>

        {/* Result */}
        {result && (
          <div className="card result-card" style={{ padding: '24px', marginBottom: '20px' }}>
            {/* Food identification header */}
            {(result.type === 'wholeFood' || result.type === 'identifiedFood') && (
              <div style={{ textAlign: 'center', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid #e7e5e4' }}>
                <div style={{ fontSize: '13px', color: '#78716c', marginBottom: '4px' }}>
                  {result.brand || result.category || 'Identified Food'}
                </div>
                <div style={{ fontSize: '22px', fontWeight: '600', color: '#1a1a1a', textTransform: 'capitalize' }}>{result.name}</div>
                {result.confidence && (
                  <span className="confidence-badge" style={{ marginTop: '8px', background: result.confidence === 'high' ? '#dcfce7' : result.confidence === 'medium' ? '#fef3c7' : '#fee2e2', color: result.confidence === 'high' ? '#166534' : result.confidence === 'medium' ? '#92400e' : '#991b1b' }}>
                    {result.confidence} confidence
                  </span>
                )}
                {result.notes && <div style={{ fontSize: '13px', color: '#78716c', marginTop: '8px' }}>{result.notes}</div>}
              </div>
            )}

            {/* Score */}
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#a8a29e', marginBottom: '12px' }}>Avoid Score</div>
              <div style={{ width: '100px', height: '100px', margin: '0 auto', borderRadius: '50%', background: `conic-gradient(${getScoreColor(result.score)} ${result.score * 10}%, #e7e5e4 0%)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '84px', height: '84px', borderRadius: '50%', background: 'white', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: getScoreColor(result.score), lineHeight: 1 }}>{result.score}</div>
                  <div style={{ fontSize: '11px', color: '#78716c' }}>/10</div>
                </div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '14px', fontWeight: '600', color: getScoreColor(result.score) }}>
                {getScoreInfo(result.score).emoji} {getScoreInfo(result.score).label}
              </div>
            </div>

            {/* NOVA */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px', borderRadius: '10px', background: NOVA_CATEGORIES[result.nova].bgColor }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: NOVA_CATEGORIES[result.nova].color, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: '700', flexShrink: 0 }}>{result.nova}</div>
                <div>
                  <div style={{ fontWeight: '600', fontSize: '14px', color: '#1a1a1a' }}>{NOVA_CATEGORIES[result.nova].name}</div>
                  <div style={{ color: '#57534e', fontSize: '12px' }}>{NOVA_CATEGORIES[result.nova].verdict}</div>
                </div>
              </div>
            </div>

            {/* Whole food note */}
            {result.type === 'wholeFood' && (
              <div style={{ textAlign: 'center', padding: '16px', background: '#f0fdf4', borderRadius: '10px', color: '#15803d', marginBottom: '20px' }}>
                <div style={{ fontWeight: '500' }}>{result.note}</div>
              </div>
            )}

            {/* Extracted ingredients */}
            {extractedIngredients && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#a8a29e', marginBottom: '8px' }}>
                  {result.type === 'identifiedFood' ? 'Known/Typical Ingredients' : 'Extracted Ingredients'}
                </div>
                <div style={{ fontSize: '13px', color: '#57534e', lineHeight: '1.5', padding: '12px', background: '#fafaf9', borderRadius: '8px' }}>{extractedIngredients}</div>
              </div>
            )}

            {/* Markers */}
            {result.markers && result.markers.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#a8a29e', marginBottom: '10px' }}>
                  UPF Markers — click any for details
                </div>
                <div style={{ margin: '-3px' }}>
                  {result.markers.map((marker, i) => (
                    <div key={i} className={`marker-pill ${marker.severity} ${selectedIngredient === marker.ingredient ? 'selected' : ''}`}
                      onClick={() => { setSelectedIngredient(selectedIngredient === marker.ingredient ? null : marker.ingredient); setAiResponse(null); }}>
                      {marker.ingredient}
                    </div>
                  ))}
                </div>

                {/* Ingredient detail panel */}
                {selectedIngredient && (
                  <div className="detail-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                      <h4 style={{ margin: 0, fontSize: '16px', fontWeight: '600', textTransform: 'capitalize' }}>{selectedIngredient}</h4>
                      <button onClick={() => setSelectedIngredient(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: '#78716c' }}>✕</button>
                    </div>
                    
                    {INGREDIENT_DETAILS[selectedIngredient] ? (
                      <div>
                        <p style={{ fontSize: '14px', color: '#44403c', lineHeight: '1.6', margin: '0 0 12px' }}>{INGREDIENT_DETAILS[selectedIngredient].details}</p>
                        <div style={{ marginBottom: '12px' }}>
                          <strong style={{ fontSize: '12px', color: '#78716c' }}>COMMON IN:</strong>
                          <p style={{ fontSize: '13px', margin: '4px 0 0', color: '#57534e' }}>{INGREDIENT_DETAILS[selectedIngredient].commonIn.join(', ')}</p>
                        </div>
                        <div>
                          <strong style={{ fontSize: '12px', color: '#78716c' }}>ALTERNATIVES:</strong>
                          <p style={{ fontSize: '13px', margin: '4px 0 0', color: '#15803d' }}>{INGREDIENT_DETAILS[selectedIngredient].alternatives.join(', ')}</p>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: '14px', color: '#78716c', marginBottom: '12px' }}>No detailed info in database.</p>
                        <button className="btn btn-secondary btn-sm" onClick={() => askAboutIngredient(selectedIngredient)} disabled={askingAI}>
                          {askingAI ? 'Loading...' : 'Ask AI about this ingredient'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Ask about this food */}
            <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: '20px' }}>
              <div style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#a8a29e', marginBottom: '10px' }}>Ask about this food</div>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '12px' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => askAboutFood('Why is this food considered processed or unprocessed?')} disabled={askingAI}>Why this score?</button>
                <button className="btn btn-secondary btn-sm" onClick={() => askAboutFood('What are healthier alternatives to this food?')} disabled={askingAI}>Alternatives?</button>
                <button className="btn btn-secondary btn-sm" onClick={() => askAboutFood('What are the main health concerns with this food?')} disabled={askingAI}>Health concerns?</button>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="text" placeholder="Ask a custom question..." value={customQuestion} onChange={(e) => setCustomQuestion(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && customQuestion.trim() && askAboutFood(customQuestion)} style={{ flex: 1 }} />
                <button className="btn btn-primary btn-sm" onClick={() => askAboutFood(customQuestion)} disabled={!customQuestion.trim() || askingAI}>Ask</button>
              </div>
              
              {aiResponse && (
                <div style={{ marginTop: '16px', padding: '16px', background: '#f5f5f4', borderRadius: '10px' }}>
                  <div className="ai-response">{aiResponse}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Score Guide */}
        <div className="card" style={{ padding: '24px', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '14px', color: '#1a1a1a' }}>Avoid Score Guide</h3>
          <div style={{ display: 'grid', gap: '6px' }}>
            {[
              { range: '1-2', label: 'Excellent', color: '#16a34a', desc: 'Whole, unprocessed' },
              { range: '3-4', label: 'Good', color: '#65a30d', desc: 'Minimally processed' },
              { range: '5-6', label: 'Moderate', color: '#d97706', desc: 'Some processing' },
              { range: '7-8', label: 'Poor', color: '#ea580c', desc: 'Limit intake' },
              { range: '9-10', label: 'Avoid', color: '#dc2626', desc: 'Heavily processed' },
            ].map((item) => (
              <div key={item.range} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 10px', borderRadius: '8px', background: '#fafaf9' }}>
                <div style={{ width: '36px', fontWeight: '700', fontSize: '12px', color: item.color }}>{item.range}</div>
                <span style={{ fontWeight: '600', color: '#1a1a1a', fontSize: '13px' }}>{item.label}</span>
                <span style={{ color: '#78716c', fontSize: '12px' }}>— {item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ textAlign: 'center', color: '#a8a29e', fontSize: '11px' }}>
          Based on NOVA classification • Inspired by "Ultra-Processed People"
        </div>
      </div>
    </div>
  );
}
