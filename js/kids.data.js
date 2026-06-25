// ══════════════════════════════════════════════════════════════
// kids.data.js — 資料層（地標/尋寶/徽章 SVG、景點、問答、行政區、徽章定義）
// 必須在 kids.js 之前載入
// ══════════════════════════════════════════════════════════════
// ══ DATA ══════════════════════════════════════════════════════
const HUNT_ART={"taxi": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_taxi\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_taxi)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M20 58 L26 44 Q28 40 34 40 L66 40 Q72 40 74 44 L80 58 Z\" fill=\"#F4B942\"/><rect x=\"16\" y=\"56\" width=\"68\" height=\"14\" rx=\"4\" fill=\"#F4B942\"/><path d=\"M34 44 L46 44 L46 54 L30 54 Z M54 44 L66 44 L70 54 L54 54 Z\" fill=\"#7FB0E6\"/><g fill=\"#FCEFD2\"><rect x=\"16\" y=\"60\" width=\"68\" height=\"4\"/></g><g fill=\"#15315C\"><rect x=\"16\" y=\"60\" width=\"6\" height=\"4\"/><rect x=\"28\" y=\"60\" width=\"6\" height=\"4\"/><rect x=\"40\" y=\"60\" width=\"6\" height=\"4\"/><rect x=\"52\" y=\"60\" width=\"6\" height=\"4\"/><rect x=\"64\" y=\"60\" width=\"6\" height=\"4\"/><rect x=\"76\" y=\"60\" width=\"6\" height=\"4\"/></g><circle cx=\"32\" cy=\"70\" r=\"7\" fill=\"#15315C\"/><circle cx=\"68\" cy=\"70\" r=\"7\" fill=\"#15315C\"/><circle cx=\"32\" cy=\"70\" r=\"3\" fill=\"#FCEFD2\"/><circle cx=\"68\" cy=\"70\" r=\"3\" fill=\"#FCEFD2\"/></svg>", "hotdog": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_hotdog\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_hotdog)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"22\" y=\"44\" width=\"56\" height=\"16\" rx=\"8\" fill=\"#FCEFD2\"/><rect x=\"26\" y=\"46\" width=\"48\" height=\"11\" rx=\"5.5\" fill=\"#F4B942\"/><path d=\"M30 51 q6 -5 12 0 q6 -5 12 0 q6 -5 12 0\" fill=\"none\" stroke=\"#FCEFD2\" stroke-width=\"2\"/></svg>", "pigeon": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_pigeon\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_pigeon)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><ellipse cx=\"48\" cy=\"56\" rx=\"20\" ry=\"13\" fill=\"#FCEFD2\"/><circle cx=\"66\" cy=\"44\" r=\"9\" fill=\"#FCEFD2\"/><path d=\"M73 44 L82 46 L73 49 Z\" fill=\"#F4B942\"/><circle cx=\"68\" cy=\"43\" r=\"1.6\" fill=\"#15315C\"/><path d=\"M40 54 Q30 60 34 70 Q40 64 46 62 Z\" fill=\"#7FB0E6\"/><path d=\"M30 72 L36 68 M40 73 L46 69\" stroke=\"#F4B942\" stroke-width=\"2\"/></svg>", "subway": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_subway\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_subway)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><circle cx=\"50\" cy=\"50\" r=\"22\" fill=\"#F4B942\"/><circle cx=\"50\" cy=\"50\" r=\"22\" fill=\"none\" stroke=\"#FCEFD2\" stroke-width=\"2\"/><text x=\"50\" y=\"62\" font-size=\"28\" font-family=\"Arial\" font-weight=\"bold\" fill=\"#15315C\" text-anchor=\"middle\">4</text></svg>", "pretzel": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_pretzel\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_pretzel)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M34 36 Q22 44 30 58 Q38 70 50 64 Q62 70 70 58 Q78 44 66 36 Q56 30 50 42 Q44 30 34 36 Z\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"7\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/><g fill=\"#FCEFD2\"><circle cx=\"38\" cy=\"40\" r=\"1\"/><circle cx=\"62\" cy=\"40\" r=\"1\"/><circle cx=\"50\" cy=\"56\" r=\"1\"/><circle cx=\"30\" cy=\"54\" r=\"1\"/><circle cx=\"70\" cy=\"54\" r=\"1\"/></g></svg>", "flag": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_flag\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_flag)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"30\" y=\"22\" width=\"3\" height=\"56\" fill=\"#FCEFD2\"/><rect x=\"33\" y=\"24\" width=\"40\" height=\"26\" fill=\"#FCEFD2\"/><g fill=\"#24528F\"><rect x=\"33\" y=\"28\" width=\"40\" height=\"3.5\"/><rect x=\"33\" y=\"35\" width=\"40\" height=\"3.5\"/><rect x=\"33\" y=\"42\" width=\"40\" height=\"3.5\"/></g><rect x=\"33\" y=\"24\" width=\"18\" height=\"14\" fill=\"#15315C\"/><g fill=\"#F4B942\"><circle cx=\"38\" cy=\"28\" r=\"1\"/><circle cx=\"43\" cy=\"28\" r=\"1\"/><circle cx=\"48\" cy=\"28\" r=\"1\"/><circle cx=\"40\" cy=\"33\" r=\"1\"/><circle cx=\"45\" cy=\"33\" r=\"1\"/></g></svg>", "skyscraper": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_sky\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_sky)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"38\" y=\"22\" width=\"24\" height=\"62\" fill=\"#FCEFD2\"/><rect x=\"30\" y=\"40\" width=\"8\" height=\"44\" fill=\"#FCEFD2\" opacity=\"0.7\"/><rect x=\"62\" y=\"40\" width=\"8\" height=\"44\" fill=\"#FCEFD2\" opacity=\"0.7\"/><g fill=\"#15315C\"><rect x=\"43\" y=\"28\" width=\"4\" height=\"5\"/><rect x=\"53\" y=\"28\" width=\"4\" height=\"5\"/><rect x=\"43\" y=\"38\" width=\"4\" height=\"5\"/><rect x=\"53\" y=\"38\" width=\"4\" height=\"5\"/><rect x=\"43\" y=\"48\" width=\"4\" height=\"5\"/><rect x=\"53\" y=\"48\" width=\"4\" height=\"5\"/><rect x=\"43\" y=\"58\" width=\"4\" height=\"5\"/><rect x=\"53\" y=\"58\" width=\"4\" height=\"5\"/></g><rect x=\"49\" y=\"14\" width=\"2\" height=\"8\" fill=\"#F4B942\"/></svg>", "streetart": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_art\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_art)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"40\" y=\"40\" width=\"14\" height=\"26\" rx=\"3\" fill=\"#FCEFD2\"/><rect x=\"43\" y=\"34\" width=\"8\" height=\"8\" fill=\"#15315C\"/><rect x=\"44\" y=\"30\" width=\"6\" height=\"5\" fill=\"#F4B942\"/><g><circle cx=\"64\" cy=\"40\" r=\"5\" fill=\"#F4B942\"/><circle cx=\"70\" cy=\"50\" r=\"4\" fill=\"#7FB0E6\"/><circle cx=\"62\" cy=\"52\" r=\"3.5\" fill=\"#E5694D\"/><circle cx=\"72\" cy=\"38\" r=\"3\" fill=\"#FCEFD2\"/></g></svg>", "squirrel": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_squirrel\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_squirrel)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><ellipse cx=\"44\" cy=\"58\" rx=\"12\" ry=\"15\" fill=\"#F4B942\"/><circle cx=\"44\" cy=\"40\" r=\"9\" fill=\"#F4B942\"/><path d=\"M40 33 q-3 -5 1 -7 M48 33 q3 -5 -1 -7\" stroke=\"#F4B942\" stroke-width=\"4\" fill=\"none\" stroke-linecap=\"round\"/><circle cx=\"41\" cy=\"39\" r=\"1.4\" fill=\"#15315C\"/><circle cx=\"47\" cy=\"39\" r=\"1.4\" fill=\"#15315C\"/><path d=\"M58 70 Q78 64 72 40 Q70 28 58 32 Q70 36 66 52 Q64 64 56 64 Z\" fill=\"#FCEFD2\"/><path d=\"M40 70 l8 4 M48 70 l6 4\" stroke=\"#F4B942\" stroke-width=\"3\" stroke-linecap=\"round\"/></svg>", "bridge": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_huntbridge\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_huntbridge)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"10\" y=\"60\" width=\"80\" height=\"4\" fill=\"#FCEFD2\"/><g fill=\"#FCEFD2\"><path d=\"M26 60 V36 a6 6 0 0 1 12 0 V60 Z\"/><path d=\"M62 60 V36 a6 6 0 0 1 12 0 V60 Z\"/></g><g stroke=\"#F4B942\" stroke-width=\"1.6\" fill=\"none\"><path d=\"M32 34 Q50 56 68 34\"/><path d=\"M10 52 Q21 40 32 35\"/><path d=\"M68 35 Q79 40 90 52\"/></g></svg>", "streetlamp": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_light\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_light)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"40\" y=\"26\" width=\"20\" height=\"48\" rx=\"6\" fill=\"#FCEFD2\"/><circle cx=\"50\" cy=\"36\" r=\"5.5\" fill=\"#E5694D\"/><circle cx=\"50\" cy=\"50\" r=\"5.5\" fill=\"#F4B942\"/><circle cx=\"50\" cy=\"64\" r=\"5.5\" fill=\"#6FBF8B\"/></svg>", "icecream": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_ice\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_ice)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M38 50 L50 80 L62 50 Z\" fill=\"#F4B942\"/><g stroke=\"#15315C\" stroke-width=\"0.8\" opacity=\"0.4\"><path d=\"M42 52 L46 64 M50 50 L50 66 M58 52 L54 64\"/></g><circle cx=\"44\" cy=\"46\" r=\"9\" fill=\"#FCEFD2\"/><circle cx=\"56\" cy=\"46\" r=\"9\" fill=\"#7FB0E6\"/><circle cx=\"50\" cy=\"38\" r=\"9\" fill=\"#E5694D\"/></svg>", "cap": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_cap\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_cap)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M22 58 Q24 32 50 32 Q76 32 78 56 L74 58 Q70 42 50 42 Q30 42 28 58 Z\" fill=\"#FCEFD2\"/><path d=\"M50 42 Q70 42 74 58 L88 60 Q86 54 78 54 L74 54 Q70 44 50 44 Z\" fill=\"#F4B942\"/><circle cx=\"50\" cy=\"36\" r=\"3\" fill=\"#F4B942\"/></svg>", "dinobone": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_dinobone\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_dinobone)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><g fill=\"#FCEFD2\"><ellipse cx=\"50\" cy=\"60\" rx=\"16\" ry=\"13\"/><ellipse cx=\"36\" cy=\"38\" rx=\"6.5\" ry=\"9\"/><ellipse cx=\"50\" cy=\"33\" rx=\"6.5\" ry=\"9\"/><ellipse cx=\"64\" cy=\"38\" rx=\"6.5\" ry=\"9\"/></g><g fill=\"#15315C\"><ellipse cx=\"50\" cy=\"60\" rx=\"5\" ry=\"4\"/></g></svg>", "ferry": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_ferry\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_ferry)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M18 58 H82 L74 72 H26 Z\" fill=\"#FCEFD2\"/><rect x=\"34\" y=\"44\" width=\"34\" height=\"14\" fill=\"#FCEFD2\"/><rect x=\"48\" y=\"34\" width=\"6\" height=\"10\" fill=\"#F4B942\"/><g fill=\"#15315C\"><rect x=\"38\" y=\"48\" width=\"6\" height=\"6\"/><rect x=\"48\" y=\"48\" width=\"6\" height=\"6\"/><rect x=\"58\" y=\"48\" width=\"6\" height=\"6\"/></g><path d=\"M14 76 q6 4 12 0 q6 4 12 0 q6 4 12 0 q6 4 12 0 q6 4 12 0\" stroke=\"#7FB0E6\" stroke-width=\"2\" fill=\"none\"/></svg>", "statue": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_statue\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_statue)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"44\" y=\"60\" width=\"12\" height=\"20\" fill=\"#FCEFD2\"/><rect x=\"38\" y=\"80\" width=\"24\" height=\"5\" fill=\"#F4B942\"/><circle cx=\"50\" cy=\"46\" r=\"10\" fill=\"#F4B942\"/><path d=\"M50 56 q-12 2 -14 -8 q10 4 14 -2 q4 6 14 2 q-2 10 -14 8Z\" fill=\"#F4B942\"/></svg>", "carousel": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_carousel\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_carousel)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M28 44 L50 30 L72 44 Z\" fill=\"#F4B942\"/><rect x=\"30\" y=\"44\" width=\"40\" height=\"4\" fill=\"#F4B942\"/><g fill=\"#FCEFD2\"><rect x=\"32\" y=\"48\" width=\"5\" height=\"22\"/><rect x=\"63\" y=\"48\" width=\"5\" height=\"22\"/><rect x=\"47\" y=\"48\" width=\"6\" height=\"22\"/></g><rect x=\"26\" y=\"70\" width=\"48\" height=\"5\" fill=\"#F4B942\"/><circle cx=\"50\" cy=\"26\" r=\"3\" fill=\"#FCEFD2\"/></svg>", "broadway": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_broadway\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_broadway)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"28\" y=\"30\" width=\"44\" height=\"30\" rx=\"4\" fill=\"#F4B942\"/><rect x=\"32\" y=\"34\" width=\"36\" height=\"22\" rx=\"2\" fill=\"#15315C\"/><path d=\"M50 38 l2.5 5 5.5 .5 -4 4 1 5.5 -5-3 -5 3 1-5.5 -4-4 5.5-.5Z\" fill=\"#F4B942\"/><g fill=\"#FCEFD2\"><circle cx=\"32\" cy=\"30\" r=\"2\"/><circle cx=\"50\" cy=\"28\" r=\"2\"/><circle cx=\"68\" cy=\"30\" r=\"2\"/></g><rect x=\"46\" y=\"60\" width=\"8\" height=\"18\" fill=\"#FCEFD2\"/></svg>", "bagel": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_bagel\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_bagel)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><circle cx=\"50\" cy=\"50\" r=\"22\" fill=\"#B97A3D\"/><circle cx=\"50\" cy=\"50\" r=\"8\" fill=\"#15315C\"/><circle cx=\"50\" cy=\"50\" r=\"22\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"2\" opacity=\"0.5\"/><g fill=\"#FCEFD2\"><circle cx=\"42\" cy=\"38\" r=\"1.4\"/><circle cx=\"58\" cy=\"40\" r=\"1.4\"/><circle cx=\"64\" cy=\"52\" r=\"1.4\"/><circle cx=\"40\" cy=\"60\" r=\"1.4\"/></g></svg>", "flower": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_flower\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_flower)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"48\" y=\"50\" width=\"4\" height=\"30\" fill=\"#4E9A5A\"/><path d=\"M50 50 q-12 4 -14 -6 M50 56 q12 4 14 -6\" stroke=\"#4E9A5A\" stroke-width=\"3\" fill=\"none\"/><g fill=\"#F4B942\"><circle cx=\"50\" cy=\"34\" r=\"7\"/><ellipse cx=\"50\" cy=\"22\" rx=\"5\" ry=\"8\"/><ellipse cx=\"38\" cy=\"34\" rx=\"8\" ry=\"5\"/><ellipse cx=\"62\" cy=\"34\" rx=\"8\" ry=\"5\"/><ellipse cx=\"50\" cy=\"46\" rx=\"5\" ry=\"8\"/></g><circle cx=\"50\" cy=\"34\" r=\"4\" fill=\"#FCEFD2\"/></svg>"};
function huntArt(id){return HUNT_ART[id]||"";}
const BADGE_ART=["<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><radialGradient id=\"md_sprout\" cx=\"50%\" cy=\"38%\" r=\"65%\"><stop offset=\"0%\" stop-color=\"#FFD877\"/><stop offset=\"100%\" stop-color=\"#F4B942\"/></radialGradient></defs><path d=\"M38 70 L30 92 L42 86 L46 96 L54 78 Z\" fill=\"#E5694D\"/><path d=\"M62 70 L70 92 L58 86 L54 96 L46 78 Z\" fill=\"#7FB0E6\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"url(#md_sprout)\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"46\" r=\"27\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"1.2\" opacity=\"0.6\"/><path d=\"M50 60 V44\" stroke=\"#15315C\" stroke-width=\"3\"/><path d=\"M50 48 Q38 46 36 36 Q48 36 50 48 Z\" fill=\"#6FBF8B\"/><path d=\"M50 44 Q62 42 64 32 Q52 32 50 44 Z\" fill=\"#6FBF8B\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><radialGradient id=\"md_target\" cx=\"50%\" cy=\"38%\" r=\"65%\"><stop offset=\"0%\" stop-color=\"#FFD877\"/><stop offset=\"100%\" stop-color=\"#F4B942\"/></radialGradient></defs><path d=\"M38 70 L30 92 L42 86 L46 96 L54 78 Z\" fill=\"#E5694D\"/><path d=\"M62 70 L70 92 L58 86 L54 96 L46 78 Z\" fill=\"#7FB0E6\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"url(#md_target)\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"46\" r=\"27\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"1.2\" opacity=\"0.6\"/><circle cx=\"50\" cy=\"46\" r=\"16\" fill=\"none\" stroke=\"#15315C\" stroke-width=\"3.5\"/><circle cx=\"50\" cy=\"46\" r=\"9\" fill=\"none\" stroke=\"#15315C\" stroke-width=\"3.5\"/><circle cx=\"50\" cy=\"46\" r=\"3\" fill=\"#E5694D\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><radialGradient id=\"md_star\" cx=\"50%\" cy=\"38%\" r=\"65%\"><stop offset=\"0%\" stop-color=\"#FFD877\"/><stop offset=\"100%\" stop-color=\"#F4B942\"/></radialGradient></defs><path d=\"M38 70 L30 92 L42 86 L46 96 L54 78 Z\" fill=\"#E5694D\"/><path d=\"M62 70 L70 92 L58 86 L54 96 L46 78 Z\" fill=\"#7FB0E6\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"url(#md_star)\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"46\" r=\"27\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"1.2\" opacity=\"0.6\"/><path d=\"M50 28 L56 42 L71 43 L59 53 L63 68 L50 59 L37 68 L41 53 L29 43 L44 42 Z\" fill=\"#15315C\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><radialGradient id=\"md_rocket\" cx=\"50%\" cy=\"38%\" r=\"65%\"><stop offset=\"0%\" stop-color=\"#FFD877\"/><stop offset=\"100%\" stop-color=\"#F4B942\"/></radialGradient></defs><path d=\"M38 70 L30 92 L42 86 L46 96 L54 78 Z\" fill=\"#E5694D\"/><path d=\"M62 70 L70 92 L58 86 L54 96 L46 78 Z\" fill=\"#7FB0E6\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"url(#md_rocket)\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"46\" r=\"27\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"1.2\" opacity=\"0.6\"/><path d=\"M50 26 Q60 36 58 54 L42 54 Q40 36 50 26 Z\" fill=\"#15315C\"/><circle cx=\"50\" cy=\"42\" r=\"4\" fill=\"#7FB0E6\"/><path d=\"M42 52 L34 60 L44 56 Z M58 52 L66 60 L56 56 Z\" fill=\"#15315C\"/><path d=\"M46 56 Q50 68 54 56 Z\" fill=\"#E5694D\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><radialGradient id=\"md_trophy\" cx=\"50%\" cy=\"38%\" r=\"65%\"><stop offset=\"0%\" stop-color=\"#FFD877\"/><stop offset=\"100%\" stop-color=\"#F4B942\"/></radialGradient></defs><path d=\"M38 70 L30 92 L42 86 L46 96 L54 78 Z\" fill=\"#E5694D\"/><path d=\"M62 70 L70 92 L58 86 L54 96 L46 78 Z\" fill=\"#7FB0E6\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"url(#md_trophy)\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"46\" r=\"27\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"1.2\" opacity=\"0.6\"/><path d=\"M40 30 H60 V42 Q60 52 50 52 Q40 52 40 42 Z\" fill=\"#15315C\"/><path d=\"M40 34 Q30 34 32 42 Q34 46 40 44 M60 34 Q70 34 68 42 Q66 46 60 44\" fill=\"none\" stroke=\"#15315C\" stroke-width=\"2.5\"/><rect x=\"47\" y=\"52\" width=\"6\" height=\"8\" fill=\"#15315C\"/><rect x=\"40\" y=\"60\" width=\"20\" height=\"5\" rx=\"2\" fill=\"#15315C\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><radialGradient id=\"md_grad\" cx=\"50%\" cy=\"38%\" r=\"65%\"><stop offset=\"0%\" stop-color=\"#FFD877\"/><stop offset=\"100%\" stop-color=\"#F4B942\"/></radialGradient></defs><path d=\"M38 70 L30 92 L42 86 L46 96 L54 78 Z\" fill=\"#E5694D\"/><path d=\"M62 70 L70 92 L58 86 L54 96 L46 78 Z\" fill=\"#7FB0E6\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"url(#md_grad)\"/><circle cx=\"50\" cy=\"46\" r=\"34\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"2.5\"/><circle cx=\"50\" cy=\"46\" r=\"27\" fill=\"none\" stroke=\"#D89A1E\" stroke-width=\"1.2\" opacity=\"0.6\"/><path d=\"M50 32 L72 42 L50 52 L28 42 Z\" fill=\"#15315C\"/><path d=\"M40 47 V58 Q50 64 60 58 V47\" fill=\"none\" stroke=\"#15315C\" stroke-width=\"3\"/><path d=\"M72 42 V56\" stroke=\"#15315C\" stroke-width=\"2\"/><circle cx=\"72\" cy=\"58\" r=\"2.5\" fill=\"#15315C\"/></svg>"];
function badgeArt(i){return BADGE_ART[i]||"";}
const KNOW_ART=["<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_city\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_city)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><g fill=\"#FCEFD2\"><rect x=\"14\" y=\"50\" width=\"13\" height=\"34\"/><rect x=\"29\" y=\"38\" width=\"11\" height=\"46\"/><rect x=\"43\" y=\"28\" width=\"13\" height=\"56\"/><rect x=\"59\" y=\"44\" width=\"10\" height=\"40\"/><rect x=\"71\" y=\"54\" width=\"14\" height=\"30\"/></g><rect x=\"48\" y=\"18\" width=\"3\" height=\"10\" fill=\"#F4B942\"/><g fill=\"#15315C\"><rect x=\"46\" y=\"34\" width=\"3\" height=\"4\"/><rect x=\"51\" y=\"34\" width=\"3\" height=\"4\"/><rect x=\"46\" y=\"42\" width=\"3\" height=\"4\"/><rect x=\"51\" y=\"42\" width=\"3\" height=\"4\"/><rect x=\"32\" y=\"44\" width=\"2.5\" height=\"3\"/><rect x=\"36\" y=\"44\" width=\"2.5\" height=\"3\"/><rect x=\"62\" y=\"50\" width=\"2.5\" height=\"3\"/></g><rect x=\"10\" y=\"84\" width=\"80\" height=\"4\" fill=\"#F4B942\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_hist\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_hist)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M22 66 L78 66 L70 78 L30 78 Z\" fill=\"#FCEFD2\"/><rect x=\"48\" y=\"22\" width=\"3\" height=\"44\" fill=\"#FCEFD2\"/><path d=\"M51 24 Q68 34 51 46 Z\" fill=\"#FCEFD2\"/><path d=\"M48 28 Q34 38 48 50 Z\" fill=\"#FCEFD2\"/><path d=\"M51 20 L61 23 L51 26 Z\" fill=\"#F4B942\"/><path d=\"M16 78 q5 4 11 0 q5 4 11 0 q5 4 11 0 q5 4 11 0 q5 4 11 0\" stroke=\"#7FB0E6\" stroke-width=\"2\" fill=\"none\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_food\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_food)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M26 30 L74 30 L50 80 Z\" fill=\"#F4B942\"/><path d=\"M24 28 Q50 22 76 28 L74 36 Q50 31 26 36 Z\" fill=\"#FCEFD2\"/><circle cx=\"42\" cy=\"44\" r=\"4\" fill=\"#D14A3A\"/><circle cx=\"58\" cy=\"46\" r=\"4\" fill=\"#D14A3A\"/><circle cx=\"50\" cy=\"60\" r=\"3.5\" fill=\"#D14A3A\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_trans\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_trans)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"26\" y=\"24\" width=\"48\" height=\"54\" rx=\"9\" fill=\"#FCEFD2\"/><rect x=\"32\" y=\"30\" width=\"36\" height=\"17\" rx=\"3\" fill=\"#7FB0E6\"/><rect x=\"32\" y=\"52\" width=\"15\" height=\"13\" rx=\"2\" fill=\"#15315C\"/><rect x=\"53\" y=\"52\" width=\"15\" height=\"13\" rx=\"2\" fill=\"#15315C\"/><circle cx=\"37\" cy=\"72\" r=\"3\" fill=\"#F4B942\"/><circle cx=\"63\" cy=\"72\" r=\"3\" fill=\"#F4B942\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_cult\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_cult)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M44 28 Q46 58 34 66 Q24 58 26 36 Q34 30 44 28 Z\" fill=\"#F4B942\"/><g fill=\"#15315C\"><circle cx=\"32\" cy=\"42\" r=\"1.8\"/><circle cx=\"40\" cy=\"42\" r=\"1.8\"/></g><path d=\"M31 52 Q36 57 41 52\" stroke=\"#15315C\" stroke-width=\"1.6\" fill=\"none\"/><path d=\"M56 32 Q54 62 66 70 Q76 62 74 40 Q66 34 56 32 Z\" fill=\"#FCEFD2\"/><g fill=\"#15315C\"><circle cx=\"60\" cy=\"46\" r=\"1.8\"/><circle cx=\"68\" cy=\"46\" r=\"1.8\"/></g><path d=\"M59 58 Q64 53 69 58\" stroke=\"#15315C\" stroke-width=\"1.6\" fill=\"none\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_tower\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_tower)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M44 26 L56 26 L58 42 L62 42 L62 84 L38 84 L38 42 L42 42 Z\" fill=\"#FCEFD2\"/><rect x=\"49\" y=\"14\" width=\"2\" height=\"12\" fill=\"#F4B942\"/><circle cx=\"50\" cy=\"13\" r=\"2.2\" fill=\"#F4B942\"/><g fill=\"#15315C\"><rect x=\"44\" y=\"32\" width=\"3\" height=\"4\"/><rect x=\"53\" y=\"32\" width=\"3\" height=\"4\"/><rect x=\"43\" y=\"48\" width=\"3\" height=\"5\"/><rect x=\"49\" y=\"48\" width=\"3\" height=\"5\"/><rect x=\"55\" y=\"48\" width=\"3\" height=\"5\"/><rect x=\"43\" y=\"60\" width=\"3\" height=\"5\"/><rect x=\"49\" y=\"60\" width=\"3\" height=\"5\"/><rect x=\"55\" y=\"60\" width=\"3\" height=\"5\"/><rect x=\"43\" y=\"72\" width=\"3\" height=\"5\"/><rect x=\"49\" y=\"72\" width=\"3\" height=\"5\"/><rect x=\"55\" y=\"72\" width=\"3\" height=\"5\"/></g></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_nat\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_nat)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><g fill=\"#F4B942\"><circle cx=\"38\" cy=\"48\" r=\"13\"/><circle cx=\"62\" cy=\"48\" r=\"13\"/><circle cx=\"50\" cy=\"38\" r=\"16\"/></g><rect x=\"47\" y=\"54\" width=\"6\" height=\"28\" fill=\"#FCEFD2\"/><ellipse cx=\"50\" cy=\"84\" rx=\"22\" ry=\"4\" fill=\"#24528F\"/></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_world\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_world)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><circle cx=\"50\" cy=\"50\" r=\"26\" fill=\"#7FB0E6\"/><g fill=\"#F4B942\"><path d=\"M34 40 Q44 36 48 44 Q42 52 36 50 Q30 46 34 40 Z\"/><path d=\"M56 54 Q66 50 68 58 Q62 66 56 62 Z\"/><path d=\"M52 34 q6 -2 8 3 q-4 4 -8 1 Z\"/></g><g stroke=\"#FCEFD2\" stroke-width=\"1.4\" fill=\"none\" opacity=\"0.85\"><ellipse cx=\"50\" cy=\"50\" rx=\"26\" ry=\"10\"/><line x1=\"24\" y1=\"50\" x2=\"76\" y2=\"50\"/><ellipse cx=\"50\" cy=\"50\" rx=\"11\" ry=\"26\"/></g></svg>", "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_sport\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_sport)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"52\" y=\"28\" width=\"7\" height=\"36\" rx=\"3.5\" transform=\"rotate(38 55 46)\" fill=\"#F4B942\"/><rect x=\"51\" y=\"58\" width=\"9\" height=\"6\" rx=\"3\" transform=\"rotate(38 55 61)\" fill=\"#FCEFD2\"/><circle cx=\"40\" cy=\"46\" r=\"14\" fill=\"#FCEFD2\"/><path d=\"M34 40 Q40 46 34 52 M46 40 Q40 46 46 52\" stroke=\"#D14A3A\" stroke-width=\"1.5\" fill=\"none\"/></svg>"];
function knowArt(i){return KNOW_ART[i]||"";}

const SPOT_ART={"yankee": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_yankee\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_yankee)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M16 70 Q50 52 84 70 L84 80 Q50 64 16 80 Z\" fill=\"#FCEFD2\"/><path d=\"M16 70 Q50 52 84 70\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"2\"/><g fill=\"#F4B942\"><path d=\"M20 66 l3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-4 3 4 3-4 v3 H20 Z\"/></g><ellipse cx=\"50\" cy=\"80\" rx=\"30\" ry=\"6\" fill=\"#24528F\"/><circle cx=\"50\" cy=\"40\" r=\"9\" fill=\"#FCEFD2\"/><path d=\"M44 35 Q50 40 44 45 M56 35 Q50 40 56 45\" stroke=\"#F4B942\" stroke-width=\"1.3\" fill=\"none\"/></svg>", "amnh": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_amnh\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_amnh)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M70 30 Q80 30 80 38 L73 40 Q72 44 68 44 L64 42 Q58 44 54 52 L52 64 Q60 64 62 76 L58 80 L54 80 L53 66 Q48 64 44 64 L44 78 L40 78 L42 60 Q34 58 26 64 Q18 70 14 76 Q20 66 30 58 Q38 52 46 48 Q54 34 64 32 Z\" fill=\"#FCEFD2\"/><circle cx=\"73\" cy=\"36\" r=\"1.6\" fill=\"#15315C\"/><path d=\"M74 39 L78 39\" stroke=\"#15315C\" stroke-width=\"1\"/><path d=\"M58 50 l3 6 -4 1 Z\" fill=\"#FCEFD2\"/><g stroke=\"#15315C\" stroke-width=\"0.9\" opacity=\"0.45\"><path d=\"M50 52 L50 60 M54 54 L54 61\"/></g></svg>", "met": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_met\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_met)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M22 40 L50 24 L78 40 Z\" fill=\"#FCEFD2\"/><rect x=\"24\" y=\"40\" width=\"52\" height=\"6\" fill=\"#F4B942\"/><g fill=\"#FCEFD2\"><rect x=\"28\" y=\"46\" width=\"6\" height=\"26\"/><rect x=\"40\" y=\"46\" width=\"6\" height=\"26\"/><rect x=\"52\" y=\"46\" width=\"6\" height=\"26\"/><rect x=\"64\" y=\"46\" width=\"6\" height=\"26\"/></g><rect x=\"20\" y=\"72\" width=\"60\" height=\"4\" fill=\"#FCEFD2\"/><rect x=\"16\" y=\"76\" width=\"68\" height=\"4\" fill=\"#F4B942\"/></svg>", "liberty": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_liberty\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_liberty)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"42\" y=\"74\" width=\"16\" height=\"12\" fill=\"#FCEFD2\"/><rect x=\"38\" y=\"84\" width=\"24\" height=\"4\" fill=\"#F4B942\"/><path d=\"M44 74 L46 50 Q50 44 54 50 L56 74 Z\" fill=\"#FCEFD2\"/><rect x=\"54\" y=\"36\" width=\"3.5\" height=\"20\" transform=\"rotate(8 55 46)\" fill=\"#FCEFD2\"/><rect x=\"42\" y=\"52\" width=\"3.5\" height=\"14\" transform=\"rotate(-20 43 58)\" fill=\"#FCEFD2\"/><rect x=\"36\" y=\"58\" width=\"7\" height=\"9\" transform=\"rotate(-20 39 62)\" fill=\"#FCEFD2\"/><circle cx=\"50\" cy=\"40\" r=\"5\" fill=\"#FCEFD2\"/><g fill=\"#F4B942\"><path d=\"M50 30 l1 5 4-3 -3 4 5 1 -5 1 3 4 -4 -3 -1 5 -1 -5 -4 3 3 -4 -5 -1 5 -1 -3 -4 4 3 Z\"/><circle cx=\"58\" cy=\"33\" r=\"3.2\"/><path d=\"M55.5 33 Q58 27 60.5 33 Z\"/></g></svg>", "911": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_wtc911\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_wtc911)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><defs><linearGradient id=\"bm_wtc911\" x1=\"0\" y1=\"1\" x2=\"0\" y2=\"0\"><stop offset=\"0%\" stop-color=\"#7FB0E6\" stop-opacity=\"0.95\"/><stop offset=\"100%\" stop-color=\"#7FB0E6\" stop-opacity=\"0\"/></linearGradient></defs><rect x=\"38\" y=\"16\" width=\"8\" height=\"64\" fill=\"url(#bm_wtc911)\"/><rect x=\"54\" y=\"16\" width=\"8\" height=\"64\" fill=\"url(#bm_wtc911)\"/><rect x=\"20\" y=\"78\" width=\"60\" height=\"6\" rx=\"2\" fill=\"#FCEFD2\"/><rect x=\"36\" y=\"74\" width=\"12\" height=\"6\" fill=\"#24528F\"/><rect x=\"52\" y=\"74\" width=\"12\" height=\"6\" fill=\"#24528F\"/></svg>", "rock": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_rock\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_rock)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><g fill=\"#FCEFD2\"><rect x=\"40\" y=\"22\" width=\"20\" height=\"62\"/><rect x=\"34\" y=\"34\" width=\"6\" height=\"50\"/><rect x=\"60\" y=\"34\" width=\"6\" height=\"50\"/><rect x=\"30\" y=\"46\" width=\"4\" height=\"38\"/><rect x=\"66\" y=\"46\" width=\"4\" height=\"38\"/></g><g fill=\"#15315C\"><rect x=\"44\" y=\"30\" width=\"3\" height=\"5\"/><rect x=\"53\" y=\"30\" width=\"3\" height=\"5\"/><rect x=\"44\" y=\"40\" width=\"3\" height=\"5\"/><rect x=\"53\" y=\"40\" width=\"3\" height=\"5\"/><rect x=\"44\" y=\"50\" width=\"3\" height=\"5\"/><rect x=\"53\" y=\"50\" width=\"3\" height=\"5\"/><rect x=\"44\" y=\"60\" width=\"3\" height=\"5\"/><rect x=\"53\" y=\"60\" width=\"3\" height=\"5\"/></g><rect x=\"49\" y=\"12\" width=\"2\" height=\"12\" fill=\"#F4B942\"/><path d=\"M51 12 L59 15 L51 18 Z\" fill=\"#F4B942\"/></svg>", "dream": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_dream\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_dream)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M30 22 Q66 24 66 44 Q66 62 40 62 Q26 62 26 74\" fill=\"none\" stroke=\"#7FB0E6\" stroke-width=\"7\" stroke-linecap=\"round\"/><path d=\"M30 22 Q66 24 66 44 Q66 62 40 62 Q26 62 26 74\" fill=\"none\" stroke=\"#FCEFD2\" stroke-width=\"2\" stroke-dasharray=\"2 6\"/><ellipse cx=\"26\" cy=\"78\" rx=\"14\" ry=\"4\" fill=\"#7FB0E6\"/><path d=\"M18 76 q4 -5 8 0 q4 -5 8 0\" stroke=\"#FCEFD2\" stroke-width=\"1.4\" fill=\"none\"/></svg>", "broadway": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_broadway\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_broadway)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><g fill=\"#F4B942\"><circle cx=\"50\" cy=\"50\" r=\"26\"/></g><g fill=\"#15315C\"><path d=\"M50 26 l4 6 -4 -1 -4 1 Z\" opacity=\"0\"/></g><circle cx=\"50\" cy=\"50\" r=\"17\" fill=\"#FCEFD2\"/><g fill=\"#15315C\"><circle cx=\"43\" cy=\"47\" r=\"2\"/><circle cx=\"57\" cy=\"47\" r=\"2\"/><path d=\"M50 52 l-3 4 3 2 3 -2 Z\"/><path d=\"M50 58 v4\"/></g><g stroke=\"#F4B942\" stroke-width=\"3\" fill=\"none\"><path d=\"M28 40 l-8 -6 M72 40 l8 -6 M26 58 l-9 3 M74 58 l9 3 M30 30 l-4 -8 M70 30 l4 -8\"/></g></svg>", "village": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_village\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_village)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><path d=\"M26 80 V40 a24 24 0 0 1 48 0 V80\" fill=\"#FCEFD2\"/><path d=\"M40 80 V48 a10 10 0 0 1 20 0 V80 Z\" fill=\"#15315C\"/><rect x=\"22\" y=\"80\" width=\"56\" height=\"4\" fill=\"#F4B942\"/><g fill=\"#F4B942\"><rect x=\"28\" y=\"34\" width=\"6\" height=\"6\"/><rect x=\"66\" y=\"34\" width=\"6\" height=\"6\"/></g></svg>", "brooklyn": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_brooklyn\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_brooklyn)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"6\" y=\"66\" width=\"88\" height=\"5\" fill=\"#FCEFD2\"/><g fill=\"#FCEFD2\"><path d=\"M24 66 V32 a8 8 0 0 1 16 0 V66 Z\"/><path d=\"M60 66 V32 a8 8 0 0 1 16 0 V66 Z\"/></g><g fill=\"#15315C\"><path d=\"M28 44 a4 4 0 0 1 8 0 v8 h-8 Z\"/><path d=\"M64 44 a4 4 0 0 1 8 0 v8 h-8 Z\"/></g><g stroke=\"#F4B942\" stroke-width=\"1.6\" fill=\"none\"><path d=\"M32 30 Q50 56 68 30\"/><path d=\"M6 56 Q19 38 32 32\"/><path d=\"M68 32 Q81 38 94 56\"/></g><g stroke=\"#F4B942\" stroke-width=\"0.8\"><line x1=\"40\" y1=\"42\" x2=\"40\" y2=\"66\"/><line x1=\"48\" y1=\"46\" x2=\"48\" y2=\"66\"/><line x1=\"56\" y1=\"44\" x2=\"56\" y2=\"66\"/></g></svg>", "highline": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_highline\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_highline)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"12\" y=\"56\" width=\"76\" height=\"10\" fill=\"#FCEFD2\"/><g fill=\"#FCEFD2\"><rect x=\"18\" y=\"66\" width=\"6\" height=\"16\"/><rect x=\"47\" y=\"66\" width=\"6\" height=\"16\"/><rect x=\"76\" y=\"66\" width=\"6\" height=\"16\"/></g><g fill=\"#F4B942\"><circle cx=\"28\" cy=\"50\" r=\"6\"/><circle cx=\"44\" cy=\"48\" r=\"7\"/><circle cx=\"60\" cy=\"50\" r=\"6\"/><circle cx=\"74\" cy=\"49\" r=\"5\"/></g><g stroke=\"#7FB0E6\" stroke-width=\"2\"><line x1=\"20\" y1=\"56\" x2=\"20\" y2=\"48\"/><line x1=\"36\" y1=\"56\" x2=\"36\" y2=\"46\"/><line x1=\"68\" y1=\"56\" x2=\"68\" y2=\"47\"/></g></svg>", "edge": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_edge\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_edge)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"30\" y=\"20\" width=\"20\" height=\"64\" fill=\"#FCEFD2\"/><g fill=\"#15315C\"><rect x=\"34\" y=\"26\" width=\"4\" height=\"5\"/><rect x=\"42\" y=\"26\" width=\"4\" height=\"5\"/><rect x=\"34\" y=\"36\" width=\"4\" height=\"5\"/><rect x=\"42\" y=\"36\" width=\"4\" height=\"5\"/><rect x=\"34\" y=\"46\" width=\"4\" height=\"5\"/><rect x=\"42\" y=\"46\" width=\"4\" height=\"5\"/></g><path d=\"M50 48 L80 56 L50 64 Z\" fill=\"#7FB0E6\"/><path d=\"M50 48 L80 56 L50 64 Z\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.4\"/><g fill=\"#15315C\"><rect x=\"58\" y=\"52\" width=\"2\" height=\"6\"/><rect x=\"64\" y=\"53\" width=\"2\" height=\"5\"/></g></svg>", "times": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_times\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_times)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"38\" y=\"28\" width=\"24\" height=\"56\" fill=\"#FCEFD2\"/><g><rect x=\"40\" y=\"34\" width=\"20\" height=\"10\" fill=\"#F4B942\"/><rect x=\"40\" y=\"46\" width=\"20\" height=\"12\" fill=\"#7FB0E6\"/><rect x=\"40\" y=\"60\" width=\"20\" height=\"10\" fill=\"#F4B942\"/></g><g fill=\"#15315C\" opacity=\"0.5\"><rect x=\"42\" y=\"37\" width=\"16\" height=\"2\"/><rect x=\"42\" y=\"49\" width=\"16\" height=\"2\"/><rect x=\"42\" y=\"53\" width=\"10\" height=\"2\"/><rect x=\"42\" y=\"63\" width=\"16\" height=\"2\"/></g><circle cx=\"50\" cy=\"24\" r=\"4\" fill=\"#F4B942\"/><rect x=\"49\" y=\"24\" width=\"2\" height=\"6\" fill=\"#FCEFD2\"/><g fill=\"#F4B942\"><rect x=\"22\" y=\"40\" width=\"12\" height=\"16\" rx=\"2\"/><rect x=\"66\" y=\"46\" width=\"12\" height=\"18\" rx=\"2\"/></g></svg>", "centralpark": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_centralpark\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_centralpark)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><g fill=\"#24528F\"><rect x=\"18\" y=\"26\" width=\"7\" height=\"22\"/><rect x=\"27\" y=\"20\" width=\"7\" height=\"28\"/><rect x=\"68\" y=\"22\" width=\"7\" height=\"26\"/><rect x=\"77\" y=\"28\" width=\"6\" height=\"20\"/></g><ellipse cx=\"50\" cy=\"72\" rx=\"26\" ry=\"8\" fill=\"#7FB0E6\"/><path d=\"M38 70 Q50 58 62 70\" fill=\"none\" stroke=\"#FCEFD2\" stroke-width=\"2.5\"/><g fill=\"#F4B942\"><circle cx=\"32\" cy=\"54\" r=\"9\"/><circle cx=\"68\" cy=\"54\" r=\"9\"/><circle cx=\"50\" cy=\"50\" r=\"7\"/></g><g fill=\"#15315C\"><rect x=\"30\" y=\"60\" width=\"3\" height=\"8\"/><rect x=\"66\" y=\"60\" width=\"3\" height=\"8\"/></g></svg>", "ellis": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_ellis\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_ellis)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"22\" y=\"46\" width=\"56\" height=\"34\" fill=\"#FCEFD2\"/><g fill=\"#F4B942\"><path d=\"M26 46 a6 6 0 0 1 12 0 Z\"/><path d=\"M62 46 a6 6 0 0 1 12 0 Z\"/></g><g fill=\"#F4B942\"><circle cx=\"32\" cy=\"40\" r=\"3\"/><circle cx=\"68\" cy=\"40\" r=\"3\"/></g><path d=\"M42 80 V58 a8 8 0 0 1 16 0 V80 Z\" fill=\"#15315C\"/><g fill=\"#15315C\"><rect x=\"26\" y=\"54\" width=\"6\" height=\"8\" rx=\"3\"/><rect x=\"68\" y=\"54\" width=\"6\" height=\"8\" rx=\"3\"/></g><rect x=\"18\" y=\"80\" width=\"64\" height=\"4\" fill=\"#F4B942\"/></svg>", "grand": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_grand\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_grand)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"20\" y=\"48\" width=\"60\" height=\"34\" fill=\"#FCEFD2\"/><g fill=\"#15315C\"><path d=\"M26 82 V62 a7 7 0 0 1 14 0 V82 Z\"/><path d=\"M43 82 V62 a7 7 0 0 1 14 0 V82 Z\"/><path d=\"M60 82 V62 a7 7 0 0 1 14 0 V82 Z\"/></g><path d=\"M40 48 L50 36 L60 48 Z\" fill=\"#FCEFD2\"/><circle cx=\"50\" cy=\"44\" r=\"5\" fill=\"#F4B942\"/><circle cx=\"50\" cy=\"44\" r=\"3.6\" fill=\"#FCEFD2\"/><line x1=\"50\" y1=\"44\" x2=\"50\" y2=\"41\" stroke=\"#15315C\" stroke-width=\"1\"/><line x1=\"50\" y1=\"44\" x2=\"53\" y2=\"45\" stroke=\"#15315C\" stroke-width=\"1\"/><rect x=\"16\" y=\"82\" width=\"68\" height=\"3\" fill=\"#F4B942\"/></svg>", "library": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_library\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_library)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><g fill=\"#FCEFD2\"><rect x=\"48\" y=\"30\" width=\"34\" height=\"6\"/><rect x=\"52\" y=\"36\" width=\"5\" height=\"30\"/><rect x=\"62\" y=\"36\" width=\"5\" height=\"30\"/><rect x=\"72\" y=\"36\" width=\"5\" height=\"30\"/><rect x=\"46\" y=\"66\" width=\"40\" height=\"4\"/></g><g fill=\"#F4B942\"><ellipse cx=\"30\" cy=\"56\" rx=\"14\" ry=\"9\"/><circle cx=\"22\" cy=\"48\" r=\"7\"/></g><g fill=\"#15315C\"><circle cx=\"20\" cy=\"47\" r=\"1.3\"/><path d=\"M18 50 l-3 1 M26 50 l3 1\"/></g><g stroke=\"#F4B942\" stroke-width=\"2\" fill=\"none\"><path d=\"M22 41 q-3 -4 -6 -2 M22 41 q3 -4 6 -2 M16 52 q-4 0 -5 3 M28 52 q4 0 5 3\"/></g><rect x=\"16\" y=\"65\" width=\"30\" height=\"4\" fill=\"#FCEFD2\"/></svg>", "chelsea": "<svg style=\"width:100%;height:100%;display:block\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"><defs><linearGradient id=\"bg_chelsea\" x1=\"0\" y1=\"0\" x2=\"0\" y2=\"1\"><stop offset=\"0%\" stop-color=\"#24528F\"/><stop offset=\"100%\" stop-color=\"#15315C\"/></linearGradient></defs><rect width=\"100\" height=\"100\" rx=\"22\" fill=\"url(#bg_chelsea)\"/><rect x=\"3\" y=\"3\" width=\"94\" height=\"94\" rx=\"19\" fill=\"none\" stroke=\"#F4B942\" stroke-width=\"1.5\" opacity=\"0.5\"/><rect x=\"22\" y=\"34\" width=\"56\" height=\"48\" fill=\"#FCEFD2\"/><g fill=\"#15315C\"><path d=\"M28 48 a5 5 0 0 1 10 0 v6 h-10 Z\"/><path d=\"M45 48 a5 5 0 0 1 10 0 v6 h-10 Z\"/><path d=\"M62 48 a5 5 0 0 1 10 0 v6 h-10 Z\"/></g><rect x=\"40\" y=\"64\" width=\"20\" height=\"18\" fill=\"#15315C\"/><rect x=\"20\" y=\"60\" width=\"60\" height=\"6\" fill=\"#F4B942\"/><g fill=\"#F4B942\"><path d=\"M28 60 l0 5 M36 60 l0 5 M44 60 l0 5 M52 60 l0 5 M60 60 l0 5 M68 60 l0 5\" stroke=\"#15315C\" stroke-width=\"1\"/></g><circle cx=\"50\" cy=\"44\" r=\"5\" fill=\"#F4B942\"/><rect x=\"49\" y=\"38\" width=\"1.5\" height=\"4\" fill=\"#15315C\"/></svg>"};
function spotArt(id){return SPOT_ART[id]||"";}
const SPOTS=[
 {id:'yankee',day:1,date:'7/5',icon:'⚾',name:'洋基球場',color:'#1A4480',
  short:'紐約最偉大的棒球場！',
  story:`🏟️\n洋基球場是美國最有名的棒球場！這裡是「紐約洋基隊」的主場，全美贏得最多冠軍的棒球隊！\n\n球場可以容納 47,000 個座位，就像把你們學校的全部學生都裝進去，再乘以超多倍！\n\n走進球場前，可以去「殿堂區」看歷代球星的雕像，感受百年棒球的魅力！`,
  facts:[{i:'🏆',t:'洋基隊贏得過 27 次世界大賽冠軍，是所有球隊中最多的！'},{i:'🌭',t:'一場比賽裡，球場會賣出超過 10,000 根熱狗！'},{i:'⭐',t:'傳奇球星貝比魯斯和幾十位名人堂球員都曾在這裡留下傳說！'},{i:'',t:'球場裡有「紀念公園」，立著退休球星的號碼牌！'},{i:'',t:'看球時大家邊吃熱狗邊大聲幫球隊加油！'}],
  quiz:[{q:'洋基隊贏得過幾次世界大賽冠軍？',opts:['17次','27次','37次','7次'],ans:1},{q:'洋基隊的主場在紐約的哪一區？',opts:['布魯克林','布朗克斯','皇后區','曼哈頓'],ans:1}]},
 {id:'amnh',day:2,date:'7/6',icon:'🦕',name:'自然史博物館',color:'#6A3B8F',
  short:'真正的恐龍骨骼就在眼前！',
  story:`🦖\n美國自然史博物館是全世界最棒的科學博物館之一！這裡收藏了超過 3,300 萬件展品，包括真正的恐龍化石！\n\n走進恐龍大廳，一隻超級巨大的暴龍骨架站在眼前——牠在地球上生活於 6,700 萬年前！\n\n還有一隻跟真正藍鯨一樣大的模型，掛在天花板，長達 29 公尺，差不多是 5 輛公車頭尾相接！`,
  facts:[{i:'🦖',t:'館內的暴龍化石骨架已經在地球上生活了 6,700 萬年！'},{i:'🐋',t:'藍鯨模型長 29 公尺，和真正的藍鯨一樣大，是地球上最大的動物！'},{i:'🌌',t:'天文館裡可以看到宇宙大爆炸的模擬，感受宇宙誕生的震撼！'},{i:'',t:'館裡有一座超大的恐龍骨架，要抬頭才看得到頭！'},{i:'',t:'還有會發光的星空劇場，像真的太空一樣！'}],
  quiz:[{q:'館內的藍鯨模型有多長？',opts:['10公尺','20公尺','29公尺','50公尺'],ans:2},{q:'自然史博物館裡可以看到什麼古老大動物的骨頭？',opts:['恐龍','大象','獅子','馬'],ans:0}]},
 {id:'met',day:2,date:'7/6',icon:'🎨',name:'大都會博物館',color:'#9B2335',
  short:'館內有一座 2000 年前的真實埃及神廟！',
  story:`🏛️\n大都會博物館是全美最大的藝術博物館！這裡有來自世界各地、超過 5,000 年歷史的藝術品。\n\n最神奇的展品是「丹鐸神廟」——一座真正的埃及神廟！它有超過 2,000 年歷史，被拆開搬到博物館，再重新組裝！\n\n你可以走進神廟裡面，感受古埃及人的神秘世界！`,
  facts:[{i:'🏛️',t:'大都會博物館有超過 200 萬件藝術品，要全部看完需要好幾個月！'},{i:'🇪🇬',t:'館內埃及神廟「丹鐸神廟」有超過 2,000 年歷史，從埃及搬運過來的！'},{i:'🌍',t:'展品來自全世界，從古埃及、古希臘到亞洲、非洲，什麼都有！'},{i:'',t:'館藏超過 200 萬件，從古埃及到現代畫都有！'},{i:'',t:'屋頂花園可以一邊看藝術一邊看中央公園！'}],
  quiz:[{q:'大都會博物館最有名的埃及展品叫什麼？',opts:['尼羅河神廟','丹鐸神廟','法老王墓','埃及廣場'],ans:1},{q:'大都會博物館旁邊就是紐約哪個大公園？',opts:['中央公園','高線公園','布萊恩公園','華盛頓公園'],ans:0}]},
 {id:'liberty',day:3,date:'7/7',icon:'🗽',name:'自由女神像',color:'#2E6B30',
  short:'法國送給美國的巨大生日禮物！',
  story:`🚢\n自由女神像是法國在 1886 年送給美國的禮物，慶祝兩國的友誼和美國獨立！\n\n女神高舉的火炬代表「自由之光」。她的腳下踩著斷掉的鎖鏈，象徵擺脫束縛走向自由！\n\n最有趣的是：女神原本是橘紅色的，就像一個大銅板！後來因為和空氣中的水分接觸，才慢慢氧化變成了現在漂亮的藍綠色！`,
  facts:[{i:'🟢',t:'女神原本是橘色的銅，後來因氧化才慢慢變成現在的綠色！'},{i:'👑',t:'女神王冠上有 7 個尖角，代表光芒照耀全球 7 大洲和 7 大洋！'},{i:'⚖️',t:'女神左手抱的書上刻著「1776年7月4日」——美國獨立宣言的日期！'},{i:'',t:'女神手上的火炬代表「自由照亮世界」！'},{i:'',t:'頭上皇冠有 7 道光芒，代表七大洲和七大洋！'}],
  quiz:[{q:'自由女神像是哪個國家送給美國的禮物？',opts:['英國','德國','法國','義大利'],ans:2},{q:'自由女神高舉的右手拿著什麼？',opts:['火炬','書本','劍','旗子'],ans:0}]},
 {id:'911',day:3,date:'7/7',icon:'🕯️',name:'911紀念館',color:'#37474F',
  short:'記住那些我們永遠思念的人',
  story:`💧\n2001 年 9 月 11 日，紐約發生了讓全世界都很難過的事。兩棟高大的大樓倒塌了，許多無辜的人失去了生命。\n\n紀念館建在那兩棟大樓的位置。有兩個很大的水池，水不斷從四周往下流，象徵人們對逝去親人的思念，就像眼淚一直流下來。\n\n水池邊刻著每一位逝者的名字。這裡讓我們記住他們，也提醒我們要珍惜身邊的人。`,
  facts:[{i:'💧',t:'兩個紀念水池建在大樓原來的地基上，每個跟半個足球場一樣大！'},{i:'📝',t:'水池邊刻著近 3,000 個名字，讓我們永遠記住這些人。'},{i:'🌳',t:'紀念廣場種了 400 棵樹，讓這個地方充滿生命力和希望。'},{i:'',t:'兩座大水池就蓋在原本雙子星大樓的位置上。'},{i:'',t:'旁邊有一棵「倖存者之樹」，災難後重新發芽。'}],
  quiz:[{q:'911紀念館的水不斷往下流，象徵什麼？',opts:['大雨','人們的思念','水力發電','城市的力量'],ans:1},{q:'911 紀念館是為了紀念哪兩棟消失的大樓？',opts:['雙子星大樓','帝國大廈','克萊斯勒大樓','洛克菲勒'],ans:0}]},
 {id:'rock',day:4,date:'7/8',icon:'🏙️',name:'洛克菲勒中心',color:'#B8820A',
  short:'聖誕節最大聖誕樹的家！',
  story:`🎄\n洛克菲勒中心是一個超大的建築群，由 19 棟大樓組成，建於 1930 年代！\n\n每年聖誕節，廣場中央都會豎立全美最著名的聖誕樹——高達 23 公尺（大約 7 層樓那麼高），掛著 5 萬顆閃閃發光的燈泡，全世界的人都看直播！\n\n我們要去的「頂部磐石」觀景台，可以從高處俯瞰整個紐約，包括著名的帝國大廈！`,
  facts:[{i:'🎄',t:'聖誕樹高達 23 公尺，掛著 50,000 顆燈泡，全美最有名的聖誕樹！'},{i:'📺',t:'著名電視節目的 NBC 電視台總部就在這裡！'},{i:'⛸️',t:'廣場下面有溜冰場，冬天溜冰，夏天變成露天餐廳！'},{i:'',t:'冬天廣場會變成戶外溜冰場，超熱鬧！'},{i:'',t:'頂樓的「巨石之巔」可以看到整個曼哈頓。'}],
  quiz:[{q:'洛克菲勒中心的聖誕樹大約有多高？',opts:['8公尺','15公尺','23公尺','50公尺'],ans:2},{q:'洛克菲勒中心冬天廣場會變成什麼？',opts:['溜冰場','游泳池','足球場','沙灘'],ans:0}]},
 {id:'dream',day:5,date:'7/9',icon:'🎢',name:'美國夢水樂園',color:'#C0186A',
  short:'室內水上樂園，全年夏天！',
  story:`🌊\n美國夢購物中心是美國第二大的室內娛樂中心！裡面有各種超好玩的東西。\n\n我們要去的「夢工廠水上樂園」是室內水樂園，就算外面是冬天，裡面也溫暖得跟夏天一樣！有超多水上滑梯、波浪池和兒童戲水區。\n\n旁邊還有「尼克羅迪恩樂園」，有各種卡通世界的雲霄飛車和刺激設施！記得帶泳衣！`,
  facts:[{i:'🏔️',t:'旁邊有室內滑雪場！就算是大熱天的夏天，裡面也有真正的雪！'},{i:'🎡',t:'商場裡有室內摩天輪，從上面可以看到整個購物中心！'},{i:'🛝',t:'水樂園有超過 35 種設施，從超刺激滑梯到悠閒懶人河都有！'},{i:'',t:'室內水樂園一年四季都是溫暖的夏天！'},{i:'',t:'還有室內滑雪場，同一天能玩水又玩雪！'}],
  quiz:[{q:'美國夢水樂園就算外面很冷，裡面是什麼感覺？',opts:['冰冰涼涼','像夏天一樣溫暖','像春天','有點涼有點暖'],ans:1},{q:'美國夢裡除了水樂園，還有什麼特別的室內設施？',opts:['滑雪場','動物園','賽車場','農場'],ans:0}]},
 {id:'broadway',day:6,date:'7/10',icon:'🎭',name:'獅子王百老匯',color:'#7B3A0F',
  short:'辛巴的故事，全世界最精彩的舞台！',
  story:`🦁\n百老匯是紐約最著名的劇院區！這裡有全世界最精彩的音樂劇，演員要唱歌、跳舞還要演故事！\n\n《獅子王》從 1997 年開始，已經演了超過 25 年還沒停！演員們穿著精心設計的動物服裝，配上非洲風格的音樂，超級精彩！\n\n我們的座位在夾層 E 排 101—104，視野超棒，可以清楚看到整個舞台！`,
  facts:[{i:'🦁',t:'《獅子王》從 1997 年開始演出，至今超過 2,500 萬人看過！'},{i:'🪆',t:'演員的動物服裝和道具，需要整個團隊花好幾個月手工製作！'},{i:'🎵',t:'音樂由非洲作曲家創作，聽起來真的像在非洲大草原！'},{i:'',t:'演員戴上動物面具和戲服，就變成獅子和大象！'},{i:'',t:'開場時動物從觀眾席走道走出來，超震撼！'}],
  quiz:[{q:'《獅子王》百老匯從哪一年開始演出？',opts:['1990年','1997年','2001年','2010年'],ans:1},{q:'《獅子王》音樂劇的主角是什麼動物？',opts:['獅子','老虎','大象','長頸鹿'],ans:0}]},
 {id:'village',day:7,date:'7/11',icon:'🌆',name:'格林威治村',color:'#1C5E8A',
  short:'紐約最有藝術味的彎曲街道！',
  story:`☕\n格林威治村是紐約最有特色的街區！這裡的街道彎彎曲曲，跟紐約其他地方四四方方的格狀街道很不一樣。\n\n「華盛頓廣場公園」是村子的心臟，有個漂亮的白色拱門。公園裡常常有街頭藝人表演——音樂家、魔術師或雜耍！\n\n這一帶咖啡廳和特色小店超多，是個適合慢慢逛、慢慢發現驚喜的地方！`,
  facts:[{i:'🎸',t:'許多著名音樂家從這裡起步，包括傳奇歌手鮑伯狄倫！'},{i:'🌳',t:'華盛頓廣場公園下面有一個古老的地下墓地，有超過 20,000 人！'},{i:'🏠',t:'這裡街道彎曲是因為以前農場的小徑後來變成了現在的街道！'},{i:'',t:'這裡街道彎彎曲曲，和紐約其他方格街不一樣！'},{i:'',t:'很多音樂家和畫家都曾住在這個區。'}],
  quiz:[{q:'格林威治村的中心公園叫什麼名字？',opts:['中央公園','時代廣場','華盛頓廣場公園','布萊恩特公園'],ans:2},{q:'格林威治村的街道有什麼特別？',opts:['彎彎曲曲','全是高樓','沒有人','在水上'],ans:0}]},
 {id:'brooklyn',day:7,date:'7/11',icon:'🌉',name:'布魯克林大橋',color:'#5C3D2E',
  short:'1883年完工的工程奇蹟！',
  story:`🔩\n布魯克林大橋在 1883 年完工，當時是全世界最長的懸吊橋！它連接曼哈頓和布魯克林，讓兩個地方的人可以互相往來。\n\n建造這座大橋花了整整 14 年，超過 600 名工人參與。主要的鋼纜超粗，是用 14,000 條細鋼絲纏在一起做成的！\n\n站在布魯克林公園看大橋配上天際線，是紐約最美的景色之一！`,
  facts:[{i:'🔩',t:'大橋鋼纜由 14,000 條細鋼絲纏繞而成，超級超級堅固！'},{i:'📅',t:'大橋花了整整 14 年才建好，從 1869 年到 1883 年！'},{i:'🚶',t:'現在每天超過 100,000 人（行人加上車輛）通過這座橋！'},{i:'',t:'它是世界上最早用鋼索吊起來的大橋之一！'},{i:'',t:'橋上有專門給人走路和騎腳踏車的步道。'}],
  quiz:[{q:'布魯克林大橋花了幾年才建好？',opts:['5年','14年','20年','30年'],ans:1},{q:'布魯克林大橋連接曼哈頓和哪一區？',opts:['布魯克林','皇后區','布朗克斯','紐澤西'],ans:0}]},
 {id:'highline',day:8,date:'7/12',icon:'🌿',name:'高線公園',color:'#1B6637',
  short:'廢棄鐵路搖身一變成空中花園！',
  story:`🌸\n高線公園是一個超特別的地方——建在一條廢棄的舊鐵路軌道上，懸浮在空中！\n\n這條鐵路建於 1930 年代，用來運送貨物。後來沒人用了，本來要拆掉，但紐約市民說：「不要拆！把它變成公園！」\n\n2009 年正式開放！你可以在上面悠閒散步，欣賞哈德遜河風景和各種藝術裝置！`,
  facts:[{i:'🚂',t:'高線公園建在 1930 年代的廢棄貨運鐵路上，離地好幾層樓高！'},{i:'🌸',t:'公園裡種了超過 500 種植物，四季景色各不相同！'},{i:'🎨',t:'沿途有許多戶外藝術裝置，每年都會更換新作品，充滿驚喜！'},{i:'',t:'它原本是火車鐵軌，後來改成空中花園！'},{i:'',t:'走在上面能從高處看街道和哈德遜河。'}],
  quiz:[{q:'高線公園以前是什麼？',opts:['廢棄機場','廢棄貨運鐵路','古老高速公路','舊工廠'],ans:1},{q:'高線公園是由什麼改建成的？',opts:['舊鐵軌','舊機場','舊碼頭','舊學校'],ans:0}]},
 {id:'edge',day:4,date:'7/8',icon:'🪞',name:'Summit 觀景台',color:'#2C4B7C',
  short:'鏡子房間＋玻璃地板，整個紐約在腳下！',
  story:`🪞\nSummit 觀景台在中央車站旁邊的高樓上，是紐約最好玩的觀景台之一！\n\n這裡有一整間全是鏡子的房間——地板、牆壁、天花板都會反射，走進去就像飄在空中，到處都是你自己！還有一間放滿亮晶晶銀色氣球的房間，超夢幻！\n\n最刺激的是「Levitation」：伸出大樓外的透明玻璃地板，站上去往下看，整個紐約都在你腳下！`,
  facts:[{i:'🪞',t:'有一整間鏡子房間，地板和牆壁都會反射，像飄在空中！'},{i:'🎈',t:'還有一間放滿亮晶晶銀色氣球的房間，可以走進去玩！'},{i:'🪟',t:'「Levitation」是伸出大樓外的透明玻璃地板，站上去超刺激！'},{i:'🚉',t:'就在中央車站（Grand Central）旁邊，交通超方便！'},{i:'',t:'它有會反射的鏡子房間和伸出大樓外的玻璃地板。'}],
  quiz:[{q:'Summit 觀景台最有名的房間是什麼？',opts:['鏡子房間','遊戲房間','圖書室','電影院'],ans:0},{q:'Summit 的「Levitation」是什麼？',opts:['伸出大樓外的玻璃地板','一台電梯','一間餐廳','一座雕像'],ans:0}]},
 {id:'times',day:1,date:'每天',icon:'🎆',name:'時代廣場',color:'#C0392B',
  short:'全世界最閃亮的十字路口！',
  story:`🌟\n時代廣場是紐約最熱鬧的地方，我們住的飯店就在附近！這裡到處都是超大的電子廣告看板，五顏六色閃個不停，就算半夜也亮得像白天一樣。\n\n每年除夕，全世界有超過 100 萬人擠在這裡，看一顆亮晶晶的水晶球緩緩落下，一起倒數迎接新年！\n\n這裡也是百老匯劇院區的中心，看完音樂劇走出來，整個廣場燈火通明，超級夢幻！`,
  facts:[{i:'🪧',t:'時代廣場的電子看板非常巨大又明亮，據說從太空都能看到它的光！'},{i:'🎉',t:'每年除夕的新年降球儀式從 1907 年開始，已經超過 100 年了！'},{i:'🚦',t:'它其實是兩條大馬路交叉的「廣場」，每天有幾十萬人經過。'},{i:'',t:'到處都是超大電子廣告螢幕，晚上亮得像白天！'},{i:'',t:'每年跨年有上百萬人聚在這裡倒數。'}],
  quiz:[{q:'時代廣場每年除夕會做什麼活動？',opts:['放煙火','水晶球降落倒數','賽跑','點聖誕樹'],ans:1},{q:'時代廣場最有名的景象是什麼？',opts:['巨大電子螢幕','大瀑布','古城牆','大草原'],ans:0}]},
 {id:'centralpark',day:2,date:'7/6',icon:'🌳',name:'中央公園',color:'#27AE60',
  short:'城市正中央的超大綠洲！',
  story:`🍃\n在高樓大廈的正中央，藏著一大片綠油油的公園——中央公園！它大到從南走到北要花 1 個小時。\n\n你可能以為它是天然的森林，其實它是「人工」打造的！工人們搬走了好幾百萬車的泥土和石頭，再種上樹木花草，花了 20 多年才完成。\n\n公園裡有湖泊、城堡、旋轉木馬，還住著浣熊、烏龜和好多小鳥。是紐約人野餐、跑步、放鬆的最愛！`,
  facts:[{i:'🦝',t:'公園裡住著浣熊、烏龜和超過 200 種鳥，是城市裡的野生動物天堂！'},{i:'🌉',t:'公園裡有 36 座造型都不一樣的橋和拱門，散步時超多驚喜！'},{i:'🎬',t:'超多電影都在中央公園拍攝，是全世界最常出現在電影裡的公園！'},{i:'',t:'公園裡有湖、動物園、城堡，還能划船！'},{i:'',t:'它是人工打造的，幾乎每棵樹都是種出來的。'}],
  quiz:[{q:'中央公園是怎麼來的？',opts:['天然森林','人工打造的','火山形成','外星人蓋的'],ans:1},{q:'在中央公園可以做什麼？',opts:['划船','衝浪','滑雪','潛水'],ans:0}]},
 {id:'ellis',day:3,date:'7/7',icon:'🚢',name:'埃利斯島',color:'#16A085',
  short:'幾百萬移民來美國的第一站！',
  story:`⚓\n埃利斯島就在自由女神像旁邊。在 100 多年前，這裡是移民來到美國的「大門」——超過 1,200 萬人從世界各地搭船來到這裡，展開新生活！\n\n他們下船後要在這裡接受檢查、登記名字。對很多人來說，看到自由女神像和踏上埃利斯島，就是「美國夢」開始的地方。\n\n現在這裡變成了移民博物館，記錄著這些勇敢的人漂洋過海、追求更好生活的故事。`,
  facts:[{i:'🧳',t:'超過 1,200 萬名移民從埃利斯島進入美國，現在很多美國人的祖先都從這裡來！'},{i:'📋',t:'移民下船後要排隊接受健康檢查和登記，緊張又興奮。'},{i:'🗽',t:'從埃利斯島可以近距離看到自由女神像，是移民看到的第一個希望象徵。'},{i:'',t:'以前是移民進入美國的第一站，要先在這裡檢查。'},{i:'',t:'幾千萬美國人的祖先都從這裡踏上美國！'}],
  quiz:[{q:'埃利斯島以前是做什麼的地方？',opts:['監獄','移民入境的大門','遊樂園','軍事基地'],ans:1},{q:'埃利斯島以前是接待誰的地方？',opts:['移民','士兵','囚犯','國王'],ans:0}]},
 {id:'grand',day:4,date:'7/8',icon:'🚉',name:'中央車站',color:'#B7950B',
  short:'天花板上有一片星空！',
  story:`✨\n大中央車站是全世界最大、最漂亮的火車站之一，已經超過 100 歲了！\n\n走進大廳，記得抬頭看天花板——上面畫滿了綠色的星空和黃道十二宮的星座圖案，總共有 2,500 顆星星，超級夢幻！\n\n這裡每天有幾十萬人來來往往趕火車，大廳中央有一個有名的四面金色大鐘，是大家約見面的地點。`,
  facts:[{i:'🌌',t:'車站大廳天花板畫著 2,500 顆星星組成的星座圖，抬頭就像看到星空！'},{i:'🕰️',t:'大廳中央的四面金鐘非常有名，是紐約人最愛的約會碰面點。'},{i:'🤫',t:'車站裡有個「悄悄話迴廊」，站在對角小聲說話，對面的人竟然聽得到！'},{i:'',t:'天花板畫著金色星座圖，像把星空搬進室內！'},{i:'',t:'它是世界上月台最多的火車站之一。'}],
  quiz:[{q:'大中央車站的天花板上畫了什麼？',opts:['白雲','星空和星座','火車','地圖'],ans:1},{q:'中央車站的天花板上畫了什麼？',opts:['星座圖','海洋','花朵','地圖'],ans:0}]},
 {id:'library',day:6,date:'7/10',icon:'📖',name:'紐約公共圖書館',color:'#7D6608',
  short:'門口有兩隻大理石獅子守護！',
  story:`🦁\n紐約公共圖書館是一棟超漂亮的大理石建築，門口有兩隻大大的石獅子守衛，牠們還有名字，叫做「耐心」和「堅韌」！\n\n走進去，裡面有一間超大的閱覽室，天花板畫著藍天白雲，安靜又莊嚴，讓人忍不住小聲說話。\n\n這裡收藏了好幾百萬本書，任何人都可以免費進去看書、學習。旁邊就是綠意盎然的布萊恩特公園，看完書可以去散步。`,
  facts:[{i:'🦁',t:'門口兩隻石獅子叫「耐心」和「堅韌」，是圖書館的吉祥物！'},{i:'📚',t:'圖書館收藏超過 5,000 萬件書籍和資料，任何人都能免費使用。'},{i:'☁️',t:'大閱覽室的天花板畫著藍天白雲，抬頭看書好像在天空下讀書。'},{i:'',t:'門口有兩隻大理石獅子，叫「耐心」和「堅毅」！'},{i:'',t:'大閱覽室的天花板畫著藍天白雲。'}],
  quiz:[{q:'紐約公共圖書館門口站著什麼動物雕像？',opts:['大象','獅子','老鷹','馬'],ans:1},{q:'紐約公共圖書館門口的兩隻雕像是什麼動物？',opts:['獅子','老鷹','馬','熊'],ans:0}]},
 {id:'chelsea',day:8,date:'7/12',icon:'🍽️',name:'雀兒喜市場',color:'#A04000',
  short:'餅乾工廠變身美食天堂！',
  story:`🍪\n雀兒喜市場以前是一間有名的餅乾工廠（就是發明 Oreo 餅乾的那家公司）！後來工廠不用了，整修變成一個超棒的室內美食市場。\n\n走進去，你可以看到保留下來的舊磚牆和老機器，到處都是好吃的——龍蝦堡、墨西哥捲餅、冰淇淋、甜點……應有盡有！\n\n這裡就在高線公園旁邊，逛完空中花園來這裡吃午餐，是旅程最棒的收尾！`,
  facts:[{i:'🍪',t:'這裡以前是發明 Oreo 餅乾的工廠，現在還看得到舊工廠的痕跡！'},{i:'🦞',t:'市場裡有超有名的龍蝦堡店，海鮮新鮮又美味。'},{i:'🧱',t:'保留了 100 多年前的紅磚牆和工業風管線，邊吃邊感受歷史。'},{i:'',t:'這裡以前是做奧利奧餅乾的工廠！'},{i:'',t:'現在變成美食市場，有各國小吃和點心。'}],
  quiz:[{q:'雀兒喜市場以前是什麼工廠？',opts:['汽車工廠','餅乾工廠','玩具工廠','衣服工廠'],ans:1},{q:'雀兒喜市場以前是生產什麼的工廠？',opts:['餅乾','汽車','衣服','玩具'],ans:0}]}
];

const TRIVIA=[
 {tag:'地理',q:'紐約市由幾個行政區組成？',opts:['3 個','5 個','7 個','10 個'],ans:1,a:'紐約市由 5 個行政區組成：曼哈頓、布魯克林、皇后區、布朗克斯和史泰登島，就像 5 塊拼圖拼成完整的紐約！'},
 {tag:'交通',q:'紐約地鐵 24 小時都有在跑嗎？',opts:['只到晚上 12 點','對，24 小時不停','只有白天','只有平日'],ans:1,a:'對！紐約地鐵是全世界少數 24 小時不停運行的地鐵系統，全年 365 天都不休息，連深夜都有車！'},
 {tag:'語言',q:'紐約街道上大約有多少種語言被使用？',opts:['約 50 種','約 200 種','超過 800 種','超過 3000 種'],ans:2,a:'超過 800 種！紐約是全世界語言最多元的城市，走在街上可能聽到來自世界各地的語言。'},
 {tag:'歷史',q:'紐約市曾經當過美國的首都嗎？',opts:['從來沒有','當過（1785–1790）','只當過一個月','它現在就是首都'],ans:1,a:'當過！1785 到 1790 年紐約是美國首都，第一任總統華盛頓就是在紐約宣誓就職的！'},
 {tag:'建築',q:'帝國大廈大約只花了多少天建造？',opts:['410 天','5 年','10 年','100 天'],ans:0,a:'只花了約 410 天！這在當時是驚人的紀錄，1930 年動工、1931 年就完工，速度超快。'},
 {tag:'地標',q:'時代廣場以前叫什麼名字？',opts:['百老匯廣場','朗亞克廣場','自由廣場','中央廣場'],ans:1,a:'以前叫「朗亞克廣場」。1904 年《紐約時報》搬來這裡並舉辦新年降球，才改名為「時代廣場」！'},
 {tag:'公園',q:'中央公園是天然的還是人工建造的？',opts:['天然森林','人工建造的','本來是湖','本來是農場改的'],ans:1,a:'是人工建造的！工人搬走超過 500 萬車的土和石頭，再重新種樹種草，花了 20 多年才完成。'},
 {tag:'食物',q:'美國第一家 Pizza 店開在哪個城市？',opts:['芝加哥','洛杉磯','紐約','波士頓'],ans:2,a:'就在紐約！1905 年義大利移民在曼哈頓開了美國第一家 Pizza 店「Lombardi\'s」，現在還在營業！'},
 {tag:'人口',q:'紐約市大約有多少人居住？',opts:['約 80 萬人','約 800 萬人','約 8000 萬人','約 80 億人'],ans:1,a:'大約 800 萬人！如果連周邊城市一起算，整個紐約都會區超過 2000 萬人，是美國最大的都市區。'},
 {tag:'地標',q:'自由女神像的火炬表面是什麼顏色？',opts:['綠色','金色','銀色','紅色'],ans:1,a:'火炬表面覆蓋著一層黃金！1986 年整修時換上鍍金的新火炬，在陽光下閃閃發光。'},
 {tag:'交通',q:'紐約地鐵大約有幾個車站？',opts:['約 100 個','約 250 個','約 472 個','約 1000 個'],ans:2,a:'約 472 個站，是全世界站數最多的地鐵系統之一！要坐遍所有站得花好幾天。'},
 {tag:'趣聞',q:'紐約下水道裡真的住著鱷魚嗎？',opts:['真的有很多','是都市傳說','只有冬天有','住著恐龍'],ans:1,a:'這是都市傳說！下水道沒有鱷魚，但紐約確實有很多野生動物，像老鷹、浣熊，偶爾還有鯨魚出現在附近海域！'},
 {tag:'建築',q:'布魯克林大橋剛建好時，人們怎麼證明它很安全？',opts:['讓火車先過','讓 21 頭大象走過','放煙火','請市長住在橋上'],ans:1,a:'馬戲團老闆帶了 21 頭大象走過大橋！大象超重，橋一點問題都沒有，大家就放心了。'},
 {tag:'歷史',q:'紐約市以前的舊名叫什麼？',opts:['新阿姆斯特丹','新倫敦','新巴黎','大蘋果城'],ans:0,a:'叫「新阿姆斯特丹」！是荷蘭人 1626 年建立的，後來英國人接管才改名為「紐約」。'},
 {tag:'文化',q:'時代廣場的新年降球儀式從哪一年開始？',opts:['1850 年','1907 年','1950 年','2000 年'],ans:1,a:'從 1907 年開始！每年 12 月 31 日有超過 100 萬人聚在時代廣場，看著亮球落下倒數新年。'},
 {tag:'語言',q:'英文「摩天大樓 Skyscraper」這個字本來是指什麼？',opts:['很高的山','帆船最高的桅杆','天上的雲','巨人的梯子'],ans:1,a:'原本是指帆船上最高的那根桅杆！後來用來形容高聳入雲、好像要刮到天空的大樓。'},
 {tag:'交通',q:'紐約計程車為什麼是黃色的？',opts:['司機喜歡黃色','黃色最容易被看見','法律規定','黃色比較便宜'],ans:1,a:'因為黃色在遠處最容易被看見！1907 年研究發現黃色最顯眼，方便乘客招車，就成了標準色。'},
 {tag:'公園',q:'中央公園裡大約有多少座橋和拱門？',opts:['3 座','12 座','36 座','100 座'],ans:2,a:'有 36 座，而且每一座的設計都不一樣！設計師故意讓它們長得都不同，散步時充滿驚喜。'},
 {tag:'動物',q:'中央公園裡有真的野生動物嗎？',opts:['完全沒有','有浣熊、烏龜、鳥','只有松鼠','只有魚'],ans:1,a:'有！中央公園住著浣熊、烏龜、超過 200 種鳥，還有貓頭鷹。曾有隻貓頭鷹「Flaco」超有名！'},
 {tag:'食物',q:'紐約貝果麵包中間為什麼有洞？',opts:['比較好看','烤得更均勻好串著賣','省麵粉','傳統規定'],ans:1,a:'有個說法：中間挖洞能讓麵包煮、烤得更均勻，而且小販可以把貝果串在棍子上叫賣，方便又好拿！'},
 {tag:'歷史',q:'紐約「華爾街 Wall Street」名字是怎麼來的？',opts:['有個叫 Wall 的人','以前真的有一道牆','賣牆壁的街','很高的牆壁山'],ans:1,a:'以前荷蘭人在這裡蓋了一道牆（Wall）來防守，沿著牆的街道就叫華爾街。現在是世界金融中心！'},
 {tag:'地標',q:'帝國大廈晚上頂端的燈為什麼會變顏色？',opts:['電燈壞了','配合節日慶祝','警告飛機','隨機亂變'],ans:1,a:'頂端的燈會配合節日變色！聖誕節紅綠、萬聖節橘色，用燈光跟全城說：今天是特別的日子喔！'},
 {tag:'交通',q:'紐約地鐵每天大約載多少人？',opts:['約 35 萬人','約 350 萬人','約 3500 萬人','約 100 人'],ans:1,a:'大約 350 萬人！紐約地鐵是全美國最忙碌的地鐵系統，每天載運超多通勤的人。'},
 {tag:'自然',q:'紐約的冬天會下雪嗎？',opts:['從來不下雪','會，而且常下雪','只下過一次','只有山上會下'],ans:1,a:'會！紐約冬天很冷常下雪，中央公園變白超美。不過我們 7 月去是夏天，不會遇到雪喔！'},
 {tag:'建築',q:'布魯克林大橋的主要鋼纜是怎麼做成的？',opts:['一根大鐵棒','14000 條細鋼絲纏成','木頭做的','塑膠做的'],ans:1,a:'用 14000 條細鋼絲纏繞而成，超級堅固！大橋花了 14 年才建好，1883 年完工時是世界最長吊橋。'},
 {tag:'語言',q:'紐約被叫做「大蘋果」，這個外號哪來的？',opts:['這裡盛產蘋果','賽馬記者用來形容它最棒','蘋果公司取的','形狀像蘋果'],ans:1,a:'1920 年代賽馬記者用「大蘋果」形容紐約，因為它是最大最棒的舞台（像最大的獎品），外號就流傳至今！'},
 {tag:'地理',q:'「曼哈頓」這個島名大概是什麼意思？',opts:['黃金之島','多丘陵的島','大蘋果','風之島'],ans:1,a:'來自原住民語言，意思可能是「多丘陵的島」。在歐洲人來之前，這裡住著美洲原住民勒納佩人。'},
 {tag:'地標',q:'自由女神像大約有多高（到火炬尖端）？',opts:['約 10 公尺','約 30 公尺','約 93 公尺','約 300 公尺'],ans:2,a:'從基座底部到火炬尖端約 93 公尺！光是女神本身（不含基座）就有 46 公尺，比 15 層樓還高。'},
 {tag:'建築',q:'帝國大廈總共有幾層樓？',opts:['52 層','102 層','202 層','30 層'],ans:1,a:'帝國大廈有 102 層樓！蓋好的時候是全世界最高的建築，保持紀錄將近 40 年。'},
 {tag:'運動',q:'「紐約尼克隊」是什麼運動的球隊？',opts:['棒球','籃球','足球','冰球'],ans:1,a:'是籃球隊！主場「麥迪遜廣場花園」被稱為世界最有名的競技場，看球氣氛超熱烈。'},
 {tag:'地標',q:'自由女神像站在哪一座島上？',opts:['曼哈頓島','自由島','史泰登島','長島'],ans:1,a:'站在「自由島」上！要搭渡輪才能到。搭免費的史泰登島渡輪也能遠遠看到她喔。'},
 {tag:'交通',q:'紐約主要有幾座大機場？',opts:['1 座','3 座','10 座','沒有機場'],ans:1,a:'主要有 3 座：JFK、拉瓜迪亞、紐瓦克。我們搭飛機到的是 JFK 機場，在皇后區。'},
 {tag:'食物',q:'紐約式披薩最道地的吃法是什麼？',opts:['用叉子吃','對折起來拿著吃','加滿配料','沾醬油'],ans:1,a:'紐約客會把又大又薄的披薩「對折」起來拿著吃，這樣餡料不會掉，邊走邊吃超方便！'},
 {tag:'自然',q:'哈德遜河在曼哈頓的哪一邊？',opts:['東邊','西邊','北邊','地下'],ans:1,a:'在曼哈頓的西邊！東邊則是「東河」。曼哈頓是被河水包圍的島，所以有很多橋和隧道。'},
 {tag:'文化',q:'「百老匯」這個區域最有名的是什麼？',opts:['購物','音樂劇','賽車','釣魚'],ans:1,a:'百老匯以音樂劇聞名全世界！像《獅子王》、《魔法壞女巫》，演員又唱又跳，舞台超華麗。'},
 {tag:'運動',q:'嘻哈音樂（Hip-Hop）在紐約哪一區誕生？',opts:['曼哈頓','布朗克斯','史泰登島','皇后區'],ans:1,a:'嘻哈音樂 1970 年代在布朗克斯誕生！那裡的年輕人用唱片機和饒舌創造出全新的音樂，後來紅遍全世界。'},
 {tag:'地標',q:'紐約現在最高的大樓是哪一棟？',opts:['帝國大廈','世界貿易中心一號樓','洛克菲勒中心','克萊斯勒大廈'],ans:1,a:'是「世界貿易中心一號樓」！高 541 公尺，建在 911 事件原址附近，象徵紐約重新站起來。'},
 {tag:'公園',q:'中央公園大約有多大？',opts:['像一個操場','約 340 公頃（很大）','只有一個籃球場','比整個曼哈頓還大'],ans:1,a:'約 340 公頃，超級大！從南到北走完要 1 小時，裡面有湖、森林、動物園，是城市裡的大綠洲。'},
 {tag:'自然',q:'紐約的史泰登島渡輪要付錢嗎？',opts:['很貴','完全免費','只收小孩錢','要排隊買票'],ans:1,a:'完全免費！而且渡輪會經過自由女神像旁邊，等於免費的觀光行程，是紐約客的小秘密。'},
 {tag:'趣聞',q:'紐約為什麼被叫做「不夜城」？',opts:['這裡沒有晚上','整夜都燈火通明很熱鬧','大家都不睡覺工作','路燈特別亮'],ans:1,a:'因為紐約到了半夜還是燈火通明、餐廳商店很多都營業，地鐵也 24 小時跑，整座城市好像永遠不睡覺！'},
 {tag:'動物',q:'美國自然史博物館裡最有名的展品是什麼？',opts:['活的獅子','恐龍化石和藍鯨模型','機器人','太空船'],ans:1,a:'最有名的是巨大的恐龍化石骨架，還有掛在天花板、和真鯨魚一樣大的藍鯨模型，超震撼！'},
 {tag:'地理',q:'我們要去的洋基球場在哪一區？',opts:['曼哈頓','布朗克斯','布魯克林','皇后區'],ans:1,a:'在布朗克斯！洋基隊是全美奪冠最多的棒球隊，贏過 27 次世界大賽冠軍。'},
 {tag:'文化',q:'每年除夕，全世界的人會看紐約哪裡的倒數？',opts:['中央公園','時代廣場','自由島','布魯克林大橋'],ans:1,a:'時代廣場！每年 12 月 31 日有超過 100 萬人聚在那裡，看一顆亮球緩緩落下，倒數迎接新年。'},
 {tag:'食物',q:'紐約街頭最常見的平價小吃是什麼？',opts:['牛排','熱狗和椒鹽捲餅','壽司','火鍋'],ans:1,a:'路邊攤的熱狗和椒鹽捲餅（Pretzel）！便宜又方便，是紐約街頭最經典的味道。'}
];

const BOROUGHS=[
 {id:'manhattan',name:'曼哈頓',en:'Manhattan',color:'#4E8FC4',emoji:'🏙️',
  fact:'紐約的心臟！最熱鬧的地方，到處都是摩天大樓。時代廣場、中央公園、帝國大廈都在這裡，我們住的飯店也在曼哈頓！它其實是一座細細長長的島喔。',
  spots:['時代廣場','中央公園','自由女神','帝國大廈']},
 {id:'brooklyn',name:'布魯克林',en:'Brooklyn',color:'#E58A40',emoji:'🌉',
  fact:'紐約住最多人的區！這裡有有名的布魯克林大橋，還有超好吃的披薩。從這裡看曼哈頓的天際線超級漂亮，是拍照的最佳地點！',
  spots:['布魯克林大橋','DUMBO','披薩']},
 {id:'queens',name:'皇后區',en:'Queens',color:'#6BAE50',emoji:'✈️',
  fact:'紐約面積最大的區！有兩個機場——我們搭飛機到的 JFK 機場就在這裡。皇后區也是全世界最多不同國家的人一起住的地方，可以吃到各國美食！',
  spots:['JFK 機場','可口可樂博物館','花旗球場']},
 {id:'bronx',name:'布朗克斯',en:'The Bronx',color:'#D45D5A',emoji:'⚾',
  fact:'洋基球場就在這裡！這裡也是「嘻哈音樂」（Hip-Hop）誕生的地方。還有全美國最大的動物園——布朗克斯動物園，有超過 6,000 隻動物！',
  spots:['洋基球場','布朗克斯動物園','嘻哈發源地']},
 {id:'staten',name:'史泰登島',en:'Staten Island',color:'#9B6FB5',emoji:'⛴️',
  fact:'紐約最安靜、最多綠地的區！要搭「免費」的渡輪才能到。最棒的是：在渡輪上可以免費近距離看到自由女神像，超划算！',
  spots:['史泰登島渡輪','免費看自由女神']},
 {id:'nj',name:'新澤西',en:'New Jersey',color:'#B8B8B8',emoji:'🎢',
  fact:'新澤西其實不是紐約市的一部分，是隔壁的「州」！但很多好玩的地方在這裡，像是我們要去的「美國夢購物中心」，裡面有水樂園和室內滑雪場！',
  spots:['美國夢購物中心','水樂園','室內滑雪']}
];

const BADGES=[
 {icon:'🌱',name:'探險起步',cond:'蓋第 1 個章',req:s=>s>=1},
 {icon:'🎯',name:'越來越棒',cond:'蓋 5 個章',req:s=>s>=5},
 {icon:'⭐',name:'中場英雄',cond:'蓋 10 個章',req:s=>s>=10},
 {icon:'🚀',name:'差一點了',cond:'蓋 15 個章',req:s=>s>=15},
 {icon:'🏆',name:'紐約探險家',cond:'集滿所有章',req:s=>s>=SPOTS.length},
 {icon:'🎓',name:'知識達人',cond:'答對所有挑戰',req:(s,q)=>q>=SPOTS.length},
];

// ══ 英文單字題庫（V1.11.0，旅途英文學習；景點挑戰會抽用）═══════
const ENGQ=[
 {q:'「Pizza」的中文意思是？',opts:['披薩','漢堡','熱狗','冰淇淋'],ans:0},
 {q:'「Taxi」是什麼交通工具？',opts:['火車','計程車','地鐵','船'],ans:1},
 {q:'「Subway」的中文是？',opts:['天橋','隧道','地鐵','車站'],ans:2},
 {q:'「謝謝」的英文是？',opts:['Sorry','Hello','Please','Thank you'],ans:3},
 {q:'「Hello」是什麼意思？',opts:['你好','再見','謝謝','對不起'],ans:0},
 {q:'「廁所」的英文是？',opts:['Kitchen','Bathroom','Bedroom','Garden'],ans:1},
 {q:'「Water」的中文是？',opts:['茶','果汁','水','牛奶'],ans:2},
 {q:'「票」的英文是？',opts:['Map','Bag','Money','Ticket'],ans:3},
 {q:'「Map」是什麼？',opts:['地圖','報紙','照片','書'],ans:0},
 {q:'「Hamburger」的中文是？',opts:['薯條','漢堡','三明治','披薩'],ans:1},
 {q:'「冰淇淋」的英文是？',opts:['Cake','Candy','Ice cream','Cookie'],ans:2},
 {q:'「Hotel」的中文意思是？',opts:['醫院','學校','車站','飯店'],ans:3},
 {q:'「Help」是什麼意思？',opts:['幫忙／救命','你好','謝謝','再見'],ans:0},
 {q:'「Delicious」的中文是？',opts:['好冷','好吃','好遠','好熱'],ans:1},
 {q:'想問價錢「多少錢？」英文怎麼說？',opts:['What time?','Where?','How much?','Who?'],ans:2},
 {q:'「Bus」的中文是？',opts:['船','飛機','火車','公車'],ans:3},
 {q:'「再見」的英文是？',opts:['Goodbye','Hello','Sorry','Thanks'],ans:0},
 {q:'「對不起」的英文是？',opts:['Welcome','Sorry','Hello','Please'],ans:1},
 {q:'「Exit」是什麼意思？',opts:['電梯','樓梯','出口','入口'],ans:2},
 {q:'「警察」的英文是？',opts:['Doctor','Teacher','Driver','Police'],ans:3},
 {q:'「Left」是哪個方向？',opts:['左邊','右邊','上面','下面'],ans:0},
 {q:'「Right」可以指哪個方向？',opts:['上面','右邊','下面','左邊'],ans:1},
 {q:'「火車」的英文是？',opts:['Bus','Ship','Train','Bike'],ans:2},
 {q:'「機場」的英文是？',opts:['Station','Harbor','Park','Airport'],ans:3},
 {q:'「Big」的中文是？',opts:['大','小','快','慢'],ans:0},
 {q:'「Open」通常表示什麼？',opts:['關門','營業中／開','客滿','故障'],ans:1},
 {q:'有人擋路想借過，可以說？',opts:['Goodbye','Thank you','Excuse me','Good night'],ans:2},
 {q:'「公園」的英文是？',opts:['School','Store','Hospital','Park'],ans:3}
];

// ══ 景點挑戰額外題庫（V1.11.0，每景點 +3 題，依景點事實撰寫）══════
const SPOTQ_EXTRA={
 yankee:[
  {q:'一場洋基比賽大約會賣出多少根熱狗？',opts:['超過10,000根','約100根','約50根','約500根'],ans:0},
  {q:'哪位傳奇球星曾在洋基球場留下傳說？',opts:['貝比魯斯','麥可喬丹','老虎伍茲','C羅'],ans:0},
  {q:'洋基球場裡的「紀念公園」立著什麼？',opts:['退休球星的號碼牌','恐龍化石','名畫','噴泉'],ans:0}
 ],
 amnh:[
  {q:'自然史博物館的藍鯨模型代表地球上最大的什麼？',opts:['最大的動物','最大的魚','最大的鳥','最大的花'],ans:0},
  {q:'在天文館裡可以看到什麼宇宙事件的模擬？',opts:['宇宙大爆炸','月蝕','彩虹','日落'],ans:0},
  {q:'館內的暴龍化石大約活在多久以前？',opts:['6,700萬年前','約100年前','約1,000年前','約5萬年前'],ans:0}
 ],
 met:[
  {q:'大都會博物館大約收藏多少件藝術品？',opts:['超過200萬件','約100件','約1萬件','約500件'],ans:0},
  {q:'丹鐸神廟大約有多少年的歷史？',opts:['超過2,000年','約50年','約200年','約20年'],ans:0},
  {q:'在大都會的屋頂花園可以看到什麼？',opts:['中央公園','大海','雪山','沙漠'],ans:0}
 ],
 liberty:[
  {q:'自由女神像為什麼從橘色變成綠色？',opts:['銅氧化了','被漆成綠色','長了青苔','反射天空'],ans:0},
  {q:'自由女神王冠上的 7 個尖角代表什麼？',opts:['7大洲和7大洋','一星期7天','7顆星','7個城市'],ans:0},
  {q:'女神左手抱的書上刻著哪個重要日期？',opts:['1776年7月4日','2000年1月1日','1492年','1900年'],ans:0}
 ],
 '911':[
  {q:'911 紀念水池邊大約刻著多少個名字？',opts:['近3,000個','約100個','約50個','約500個'],ans:0},
  {q:'紀念廣場種了大約多少棵樹？',opts:['400棵','40棵','4,000棵','10棵'],ans:0},
  {q:'紀念館旁那棵「倖存者之樹」有什麼特別？',opts:['災難後重新發芽','會開金色花','高100公尺','會發光'],ans:0}
 ],
 rock:[
  {q:'洛克菲勒中心的聖誕樹大約掛了多少顆燈泡？',opts:['50,000顆','500顆','100顆','5顆'],ans:0},
  {q:'哪家著名電視台總部在洛克菲勒中心？',opts:['NBC','BBC','CNN','NHK'],ans:0},
  {q:'洛克菲勒中心頂樓的觀景台叫什麼？',opts:['巨石之巔','雲端之巔','自由之巔','星空台'],ans:0}
 ],
 dream:[
  {q:'美國夢水樂園大約有多少種水上設施？',opts:['超過35種','約5種','約100種','約10種'],ans:0},
  {q:'美國夢商場裡有什麼可以從高處看整個商場？',opts:['室內摩天輪','熱氣球','直升機','雲霄飛車'],ans:0},
  {q:'在美國夢，同一天可以同時玩什麼？',opts:['玩水又玩雪','滑冰又衝浪','騎馬又開車','釣魚又登山'],ans:0}
 ],
 broadway:[
  {q:'《獅子王》到現在大約有多少人看過？',opts:['超過2,500萬人','約2,500人','約25萬人','約100人'],ans:0},
  {q:'《獅子王》的音樂是哪裡風格的作曲家創作的？',opts:['非洲','北極','南美','歐洲'],ans:0},
  {q:'《獅子王》開場時動物從哪裡走出來？',opts:['觀眾席走道','天花板','地板下','螢幕裡'],ans:0}
 ],
 village:[
  {q:'哪位傳奇歌手從格林威治村起步？',opts:['鮑伯狄倫','貝多芬','莫札特','蕭邦'],ans:0},
  {q:'格林威治村的街道為什麼彎彎曲曲？',opts:['以前是農場小徑','地震造成','故意設計','河流沖出來'],ans:0},
  {q:'華盛頓廣場公園的地下以前有什麼？',opts:['古老的地下墓地','地鐵車庫','游泳池','寶藏'],ans:0}
 ],
 brooklyn:[
  {q:'布魯克林大橋的鋼纜由多少條細鋼絲纏成？',opts:['14,000條','100條','14條','100萬條'],ans:0},
  {q:'布魯克林大橋大約哪一年完工？',opts:['1883年','1983年','1776年','2000年'],ans:0},
  {q:'布魯克林大橋現在每天大約有多少人通過？',opts:['超過100,000人','約1,000人','約100人','約10人'],ans:0}
 ],
 highline:[
  {q:'高線公園大約種了多少種植物？',opts:['超過500種','約50種','約10種','約5,000種'],ans:0},
  {q:'高線公園原本的鐵路大約是哪個年代的？',opts:['1930年代','2000年代','1700年代','1990年代'],ans:0},
  {q:'走在高線公園上可以看到哪條河？',opts:['哈德遜河','尼羅河','亞馬遜河','長江'],ans:0}
 ],
 edge:[
  {q:'Summit 觀景台就在哪個車站旁邊？',opts:['中央車站','時代廣場站','聯合車站','賓州車站'],ans:0},
  {q:'Summit 裡有一整間用什麼做的房間？',opts:['鏡子','木頭','玻璃瓶','石頭'],ans:0},
  {q:'Summit 房間裡放滿了什麼顏色的氣球？',opts:['銀色','紅色','綠色','黑色'],ans:0}
 ],
 times:[
  {q:'時代廣場的新年降球儀式大約從哪一年開始？',opts:['1907年','2007年','1776年','1999年'],ans:0},
  {q:'時代廣場其實是什麼樣的地方？',opts:['兩條大馬路交叉的廣場','一座公園','一棟大樓','一個車站'],ans:0},
  {q:'時代廣場到了晚上為什麼亮得像白天？',opts:['到處是大螢幕廣告','有很多路燈','月亮很亮','有極光'],ans:0}
 ],
 centralpark:[
  {q:'中央公園裡大約有多少座造型不同的橋和拱門？',opts:['36座','6座','100座','3座'],ans:0},
  {q:'中央公園住著超過多少種鳥？',opts:['200種','20種','2種','2,000種'],ans:0},
  {q:'關於中央公園的樹，下面哪個說法是對的？',opts:['幾乎都是人工種的','全是野生長出來的','都是塑膠做的','只有一棵樹'],ans:0}
 ],
 ellis:[
  {q:'大約有多少移民從埃利斯島進入美國？',opts:['超過1,200萬名','約1,200名','約12萬名','約120名'],ans:0},
  {q:'移民下船後在埃利斯島要先做什麼？',opts:['健康檢查和登記','考試','比賽','買房子'],ans:0},
  {q:'從埃利斯島可以近距離看到什麼？',opts:['自由女神像','帝國大廈','布魯克林大橋','中央公園'],ans:0}
 ],
 grand:[
  {q:'中央車站天花板的星座圖大約畫了多少顆星星？',opts:['2,500顆','250顆','100顆','25,000顆'],ans:0},
  {q:'中央車站裡哪個地方站對角小聲說話對面也聽得到？',opts:['悄悄話迴廊','大時鐘','月台','售票口'],ans:0},
  {q:'中央車站大廳中央最有名的碰面點是什麼？',opts:['四面金鐘','噴水池','大門','樓梯'],ans:0}
 ],
 library:[
  {q:'紐約公共圖書館門口兩隻石獅子叫什麼名字？',opts:['耐心和堅韌','勇敢和聰明','大力和飛快','金金和銀銀'],ans:0},
  {q:'紐約公共圖書館大約收藏多少件書籍和資料？',opts:['超過5,000萬件','約5,000件','約50萬件','約500件'],ans:0},
  {q:'圖書館大閱覽室的天花板畫著什麼？',opts:['藍天白雲','星座','海洋','森林'],ans:0}
 ],
 chelsea:[
  {q:'雀兒喜市場以前是生產什麼餅乾的工廠？',opts:['Oreo 奧利奧','蘇打餅','夾心酥','洋芋片'],ans:0},
  {q:'雀兒喜市場保留了 100 多年前的什麼風格？',opts:['紅磚牆和工業風管線','玻璃帷幕','木造房屋','城堡石牆'],ans:0},
  {q:'雀兒喜市場裡有很有名的什麼海鮮店？',opts:['龍蝦堡','壽司','烤魚','蝦餅'],ans:0}
 ]
};

// ══ 景點挑戰額外題庫 2（V1.11.1，每景點再 +4 題，緊扣該景點故事）══════
const SPOTQ_EXTRA2={
 yankee:[
  {q:'洋基球場大約可以容納多少個座位？',opts:['約47,000個','約4,700個','約470個','約470,000個'],ans:0},
  {q:'走進洋基球場前的「殿堂區」可以看到什麼？',opts:['歷代球星的雕像','恐龍化石','名畫','水族箱'],ans:0},
  {q:'洋基球場是哪一支球隊的主場？',opts:['紐約洋基隊','紐約大都會隊','波士頓紅襪隊','洛杉磯道奇隊'],ans:0},
  {q:'看洋基比賽時大家最常邊吃什麼邊加油？',opts:['熱狗','壽司','火鍋','蛋糕'],ans:0}
 ],
 amnh:[
  {q:'自然史博物館大約收藏多少件展品？',opts:['超過3,300萬件','約330件','約3,300件','約33萬件'],ans:0},
  {q:'自然史博物館的藍鯨模型差不多等於幾輛公車頭尾相接？',opts:['約5輛','約50輛','約2輛','約20輛'],ans:0},
  {q:'自然史博物館的藍鯨模型放在哪裡？',opts:['掛在天花板上','泡在水池裡','放在門口','埋在地下'],ans:0},
  {q:'走進恐龍大廳，最巨大的骨架是哪種恐龍？',opts:['暴龍','三角龍','劍龍','腕龍'],ans:0}
 ],
 met:[
  {q:'大都會是全美最大的哪一種博物館？',opts:['藝術博物館','科學博物館','自然史博物館','交通博物館'],ans:0},
  {q:'丹鐸神廟原本來自哪個國家？',opts:['埃及','希臘','義大利','中國'],ans:0},
  {q:'丹鐸神廟是怎麼來到大都會博物館的？',opts:['拆開搬來再重新組裝','用畫的','3D列印','複製品'],ans:0},
  {q:'大都會的藝術品最古老大約有多少年歷史？',opts:['超過5,000年','約500年','約50年','約100年'],ans:0}
 ],
 liberty:[
  {q:'法國大約哪一年把自由女神像送給美國？',opts:['1886年','1986年','1776年','2001年'],ans:0},
  {q:'自由女神腳下踩著什麼，象徵擺脫束縛？',opts:['斷掉的鎖鏈','一本書','一頂帽子','一艘船'],ans:0},
  {q:'法國送自由女神像是為了慶祝什麼？',opts:['兩國友誼和美國獨立','聖誕節','世界盃','新年'],ans:0},
  {q:'自由女神高舉的火炬代表什麼？',opts:['自由之光','勝利金牌','和平鴿','財富'],ans:0}
 ],
 '911':[
  {q:'911 事件大約發生在哪一年？',opts:['2001年','2011年','1991年','2020年'],ans:0},
  {q:'每個 911 紀念水池大約有多大？',opts:['跟半個足球場一樣大','跟一張桌子一樣','跟一個臉盆一樣','跟一台車一樣'],ans:0},
  {q:'911 紀念水池蓋在什麼位置上？',opts:['原本雙子星大樓的地基','中央公園裡','河面上','山頂上'],ans:0},
  {q:'911 紀念館特別提醒我們要做什麼？',opts:['珍惜身邊的人','多買東西','比賽贏球','趕快蓋大樓'],ans:0}
 ],
 rock:[
  {q:'洛克菲勒中心大約由幾棟大樓組成？',opts:['約19棟','約1棟','約100棟','約5棟'],ans:0},
  {q:'洛克菲勒中心的聖誕樹高度大約相當於幾層樓？',opts:['約7層樓','約2層樓','約70層樓','約1層樓'],ans:0},
  {q:'從洛克菲勒中心的觀景台可以看到哪座著名大樓？',opts:['帝國大廈','艾菲爾鐵塔','台北101','金字塔'],ans:0},
  {q:'洛克菲勒中心最有名的聖誕樹是哪個季節豎立的？',opts:['聖誕節（冬天）','暑假','春天','萬聖節'],ans:0}
 ],
 dream:[
  {q:'美國夢是美國第幾大的室內娛樂中心？',opts:['第二大','第一大','第十大','最小'],ans:0},
  {q:'要去美國夢玩水，記得帶什麼？',opts:['泳衣','雨傘','滑雪板','睡袋'],ans:0},
  {q:'美國夢的水樂園裡可以玩什麼？',opts:['水上滑梯和波浪池','恐龍化石','星空劇場','圖書館'],ans:0},
  {q:'美國夢旁邊的卡通主題樂園有什麼刺激設施？',opts:['雲霄飛車','釣魚池','圖書館','農場'],ans:0}
 ],
 broadway:[
  {q:'百老匯的演員在台上要做哪些事？',opts:['又唱又跳又演戲','只睡覺','只畫畫','只打球'],ans:0},
  {q:'《獅子王》到現在大約已經演了多久？',opts:['超過25年','約2年','約100年','約5個月'],ans:0},
  {q:'百老匯是紐約最著名的什麼區？',opts:['劇院區','工廠區','農業區','港口區'],ans:0},
  {q:'《獅子王》的演員怎麼變成獅子和大象？',opts:['戴上動物面具和戲服','用魔法','牽真的動物','用電腦動畫'],ans:0}
 ],
 village:[
  {q:'華盛頓廣場公園裡有個漂亮的什麼建築？',opts:['白色拱門','金色大鐘','玻璃金字塔','紅色城門'],ans:0},
  {q:'在華盛頓廣場公園常常可以看到什麼？',opts:['街頭藝人表演','賽車','煙火秀','滑雪'],ans:0},
  {q:'華盛頓廣場公園的地下墓地大約埋了多少人？',opts:['超過20,000人','約200人','約20人','約2人'],ans:0},
  {q:'格林威治村以前住過很多什麼樣的人？',opts:['音樂家和畫家','太空人','農夫','漁夫'],ans:0}
 ],
 brooklyn:[
  {q:'布魯克林大橋完工時是全世界最長的什麼橋？',opts:['懸吊橋','木橋','石橋','浮橋'],ans:0},
  {q:'建造布魯克林大橋大約有多少名工人參與？',opts:['超過600名','約6名','約60名','約6個'],ans:0},
  {q:'布魯克林大橋上有什麼方便行人和單車？',opts:['專門的步道','游泳池','溜冰場','纜車'],ans:0},
  {q:'從布魯克林這側看大橋，會配上什麼美景？',opts:['紐約天際線','大沙漠','雪山','森林'],ans:0}
 ],
 highline:[
  {q:'高線公園原本差點被怎麼處理？',opts:['被拆掉','賣到外國','燒掉','搬到別的城市'],ans:0},
  {q:'高線公園大約哪一年正式開放？',opts:['2009年','1999年','2019年','1930年'],ans:0},
  {q:'高線公園懸浮在哪裡？',opts:['空中（離地好幾層樓高）','地底下','水面上','山洞裡'],ans:0},
  {q:'高線公園以前的鐵路是用來做什麼的？',opts:['運送貨物','載客人','賽車','觀光'],ans:0}
 ],
 edge:[
  {q:'站在 Summit 的「Levitation」玻璃地板上會看到什麼？',opts:['腳下的紐約街道','大海','森林','沙漠'],ans:0},
  {q:'走進 Summit 的鏡子房間會有什麼感覺？',opts:['像飄在空中','像在水裡','像在山洞','像在地下室'],ans:0},
  {q:'Summit 觀景台位在哪一區？',opts:['中城（中央車站旁）','布魯克林','皇后區','史泰登島'],ans:0},
  {q:'Summit 裡哪個房間放滿銀色氣球？',opts:['氣球房','恐龍房','書房','廚房'],ans:0}
 ],
 times:[
  {q:'時代廣場每年除夕大約有多少人擠來倒數？',opts:['超過100萬人','約100人','約1,000人','約10萬人'],ans:0},
  {q:'除夕夜時代廣場大家會看什麼緩緩落下倒數？',opts:['亮晶晶的水晶球','大氣球','一顆星星','一隻燈籠'],ans:0},
  {q:'時代廣場也是哪個表演區的中心？',opts:['百老匯劇院區','博物館區','工廠區','港口區'],ans:0},
  {q:'是什麼讓時代廣場五顏六色閃個不停？',opts:['超大電子廣告看板','噴水池','花園','瀑布'],ans:0}
 ],
 centralpark:[
  {q:'從中央公園南端走到北端大約要走多久？',opts:['約1小時','約5分鐘','約1天','約10分鐘'],ans:0},
  {q:'中央公園是全世界最常出現在哪裡的公園？',opts:['電影裡','書本裡','郵票上','月亮上'],ans:0},
  {q:'打造中央公園大約花了多少年？',opts:['20多年','2年','200年','2個月'],ans:0},
  {q:'中央公園裡有什麼可以坐的旋轉遊樂設施？',opts:['旋轉木馬','雲霄飛車','摩天輪','碰碰車'],ans:0}
 ],
 ellis:[
  {q:'埃利斯島就在哪個著名地標旁邊？',opts:['自由女神像','帝國大廈','中央公園','時代廣場'],ans:0},
  {q:'埃利斯島現在變成了什麼？',opts:['移民博物館','水樂園','棒球場','購物中心'],ans:0},
  {q:'對很多移民來說，踏上埃利斯島代表什麼的開始？',opts:['美國夢','暑假','一場比賽','上學'],ans:0},
  {q:'移民大多是搭什麼來到埃利斯島？',opts:['船','飛機','汽車','馬車'],ans:0}
 ],
 grand:[
  {q:'大中央車站大約已經多少歲了？',opts:['超過100歲','約10歲','約1,000歲','約50歲'],ans:0},
  {q:'中央車站天花板的星座圖以什麼顏色為主？',opts:['綠色','紅色','黑色','粉紅色'],ans:0},
  {q:'中央車站是世界上什麼最多的火車站之一？',opts:['月台','電梯','餐廳','廁所'],ans:0},
  {q:'中央車站天花板畫的是什麼主題？',opts:['星空和黃道十二宮星座','海底世界','森林動物','城市夜景'],ans:0}
 ],
 library:[
  {q:'紐約公共圖書館是用什麼蓋成的漂亮建築？',opts:['大理石','木頭','竹子','塑膠'],ans:0},
  {q:'任何人都可以怎麼使用紐約公共圖書館？',opts:['免費進去看書學習','要付很多錢','只有大人能進','只能看不能借'],ans:0},
  {q:'紐約公共圖書館旁邊就是哪座公園？',opts:['布萊恩特公園','中央公園','華盛頓廣場公園','高線公園'],ans:0},
  {q:'在圖書館的大閱覽室裡，大家會怎麼說話？',opts:['小聲說話保持安靜','大聲喊叫','一起唱歌','完全不能說話'],ans:0}
 ],
 chelsea:[
  {q:'雀兒喜市場就在哪個公園旁邊？',opts:['高線公園','中央公園','布萊恩特公園','華盛頓廣場公園'],ans:0},
  {q:'走進雀兒喜市場還看得到以前工廠的什麼？',opts:['舊磚牆和老機器','恐龍化石','滿天星空','大噴泉'],ans:0},
  {q:'雀兒喜市場現在主要是賣什麼的地方？',opts:['各種好吃的美食','衣服鞋子','玩具','書本'],ans:0},
  {q:'發明 Oreo 餅乾的工廠後來變成了什麼？',opts:['室內美食市場','學校','醫院','車站'],ans:0}
 ]
};
