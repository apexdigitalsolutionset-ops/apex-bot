const { Telegraf, Markup } = require('telegraf');
const express = require('express');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('APEX Bot is Live!'));
app.listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);

const I = '➤'; // በተጠየቀው መሰረት ይሄ ብቻ ነው እንደ አይከን የሚያገለግለው

// --- Welcome Menu ---
bot.start((ctx) => {
    const welcomeText = `${I} <b>APEX Digital Solution</b>\n${I} <i>"Elevating Your Digital Presence to the Peak."</i>\n\n${I} Please select your language / እባክዎ ቋንቋ ይምረጡ`;
    
    ctx.replyWithHTML(welcomeText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback(`${I} English`, 'lang_en'), Markup.button.callback(`${I} አማርኛ`, 'lang_am')]
        ]).reply_markup
    });
});

// ==========================================
// ENGLISH SECTION
// ==========================================

const menu_en = `<b>${I} Main Menu</b>\nHow can we elevate your brand today?`;
const kb_en = Markup.inlineKeyboard([
    [Markup.button.callback(`${I} About Us`, 'abt_en'), Markup.button.callback(`${I} FAQ`, 'faq_en')],
    [Markup.button.callback(`${I} Service Packages`, 'pkg_en')],
    [Markup.button.callback(`${I} Individual Services`, 'srv_en')],
    [Markup.button.callback(`${I} Contact Us`, 'cnt_en')],
    [Markup.button.webApp(`${I} Open APEX App`, 'https://apex-agency-4f177.web.app')]
]);

bot.action('lang_en', (ctx) => ctx.editMessageText(menu_en, { parse_mode: 'HTML', reply_markup: kb_en.reply_markup }));
bot.action('back_en', (ctx) => ctx.editMessageText(menu_en, { parse_mode: 'HTML', reply_markup: kb_en.reply_markup }));

// About Us - English
bot.action('abt_en', (ctx) => {
    const text = `<b>${I} About Us</b>\n\nWe are APEX Digital Solution, a high-end digital agency dedicated to transforming businesses through premium UI/UX design, cutting-edge web development, and intelligent automation. We specialize in modern aesthetics like Glassmorphism and Apple-style smoothness, seamlessly integrated with AI tools and robust digital marketing strategies. From e-commerce and dropshipping to tailored freelance apps, we build digital experiences that drive growth.`;
    ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(`${I} Back`, 'back_en')]]).reply_markup });
});

// FAQ - English
bot.action('faq_en', (ctx) => {
    const text = `<b>${I} FAQ</b>\n\n<b>${I} Q1: What makes APEX different?</b>\nWe focus on high-end, smooth user experiences (Apple-style smoothness) and leverage the latest AI tools and automation to streamline your business.\n\n<b>${I} Q2: Do you support Dropshipping and E-commerce?</b>\nYes, we provide full strategies, platform setups, and automation tools specifically tailored for dropshipping, e-commerce, and freelance platforms.\n\n<b>${I} Q3: How long does a project take?</b>\nTimelines vary. The Ascent package takes a few weeks, while the Zenith package requires comprehensive development time.`;
    ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(`${I} Back`, 'back_en')]]).reply_markup });
});

// Packages - English
bot.action('pkg_en', (ctx) => {
    const text = `<b>${I} Service Packages</b>\n
<b>${I} Package 1: Ascent (The Foundation)</b>
Ideal for new businesses looking to establish a professional digital presence.
${I} Branding Foundation: Custom Logo Design, Brand Color Palette, and Typography.
${I} Page Authority: Setup and Optimization of Facebook, Instagram, and TikTok profiles.
${I} Strategic Content: 10 High-quality Professional Posts per month.
${I} Community Engagement: Basic Comment and DM management to keep your audience active.
${I} Growth Consultation: Monthly expert advice to align your digital strategy.

<b>${I} Package 2: Apex (The Growth Accelerator)</b>
Designed for businesses ready to scale and generate consistent leads.
${I} Conversion Copywriting: Compelling Hooks, Stories, and CTAs designed to sell.
${I} Vantage Ad Management: 5 Targeted Ad Campaigns focused on Traffic and Lead Generation.
${I} Google Authority (GMB): Full Google Maps setup and Review management for local search dominance.
${I} Daily Dominance: Daily Story updates and consistent feed activity to stay top-of-mind.
${I} Performance Tracking: Monthly reports on reach and lead quality.
${I} Growth Consultation: Strategy sessions included.

<b>${I} Package 3: Zenith (The Empire Builder)</b>
The ultimate all-in-one digital takeover for established brands.
${I} Full-Spectrum Content: 20+ Posts/Reels per month covering all platforms.
${I} Automated Sales Funnel: Custom Business Website + Interactive Telegram Bot.
${I} Data Intelligence: Meta Pixel setup and Retargeting ads to win back lost customers.
${I} SEO & Digital PR: Search Engine Optimization and online brand mentions.
${I} SOP Development: Standardized Operating Procedures for your internal team.
${I} Apex Founder Support: Direct 1-on-1 strategic consulting from the founder.`;
    ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(`${I} Back`, 'back_en')]]).reply_markup });
});

// Services - English
bot.action('srv_en', (ctx) => {
    const text = `<b>${I} Individual Services (Add-ons)</b>\n\n${I} Professional Logo Design\n${I} Custom Telegram Bot Development\n${I} Premium Website Design\n${I} Social Media Audit & Setup\n${I} Modern Business Card Design\n${I} Strategic Business Consultation`;
    ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(`${I} Back`, 'back_en')]]).reply_markup });
});

// Contact - English
bot.action('cnt_en', (ctx) => {
    const text = `<b>${I} Contact Us</b>\n\nEmail: apexsolutions.et@gmail.com\nChoose a platform below to connect with us:`;
    ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.url(`${I} Telegram`, 'https://t.me/ApexDigitalET'), Markup.button.url(`${I} Instagram`, 'https://instagram.com/apexdigital.et')],
            [Markup.button.url(`${I} Facebook`, 'https://www.facebook.com/share/1BMRntd8DQ/'), Markup.button.url(`${I} TikTok`, 'https://tiktok.com/@apexdigital.et')],
            [Markup.button.callback(`${I} Back`, 'back_en')]
        ]).reply_markup 
    });
});

// ==========================================
// AMHARIC SECTION
// ==========================================

const menu_am = `<b>${I} ዋና ማውጫ</b>\nዛሬ የትኛውን አገልግሎት ይፈልጋሉ?`;
const kb_am = Markup.inlineKeyboard([
    [Markup.button.callback(`${I} ስለ እኛ`, 'abt_am'), Markup.button.callback(`${I} ተደጋጋሚ ጥያቄዎች`, 'faq_am')],
    [Markup.button.callback(`${I} የጥቅል ዝርዝሮች`, 'pkg_am')],
    [Markup.button.callback(`${I} ተጨማሪ ነጠላ አገልግሎቶች`, 'srv_am')],
    [Markup.button.callback(`${I} ያግኙን`, 'cnt_am')],
    [Markup.button.webApp(`${I} ዌብ-አፕ ይክፈቱ`, 'https://apex-agency-4f177.web.app')]
]);

bot.action('lang_am', (ctx) => ctx.editMessageText(menu_am, { parse_mode: 'HTML', reply_markup: kb_am.reply_markup }));
bot.action('back_am', (ctx) => ctx.editMessageText(menu_am, { parse_mode: 'HTML', reply_markup: kb_am.reply_markup }));

// About Us - Amharic
bot.action('abt_am', (ctx) => {
    const text = `<b>${I} ስለ እኛ</b>\n\nAPEX Digital Solution የቢዝነስዎን ዲጂታል ገጽታ በከፍተኛ ጥራት (Premium) እና በዘመናዊ ቴክኖሎጂ የሚቀይር ኤጀንሲ ነው። በተለይም እንደ Glassmorphism ባሉ እጅግ ማራኪ የዲዛይን ጥበባቶች፣ በዘመናዊ ዌብሳይት እና አፕሊኬሽን ዴቨሎፕመንት፣ እንዲሁም በ AI እና በቢዝነስ አውቶሜሽን ላይ ትኩረት አድርገን እንሰራለን። ከኢ-ኮሜርስ እና Dropshipping ስትራቴጂዎች እስከ ሙሉ ዲጂታል ማርኬቲንግ ድረስ፤ ቢዝነስዎን ወደ ላቀ ደረጃ ለማድረስ እንተጋለን።`;
    ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(`${I} ተመለስ`, 'back_am')]]).reply_markup });
});

// FAQ - Amharic
bot.action('faq_am', (ctx) => {
    const text = `<b>${I} ተደጋጋሚ ጥያቄዎች (FAQ)</b>\n\n<b>${I} ጥ 1: APEXን የተለየ የሚያደርገው ምንድን ነው?</b>\nትኩረታችን ከፍተኛ ጥራት ባላቸው እና እጅግ ማራኪ (Premium) በሆኑ ዲዛይኖች ላይ ሲሆን፣ የ AI ቴክኖሎጂዎችን እና የቢዝነስ አውቶሜሽንን በመጠቀም ስራዎን እናቀልላለን።\n\n<b>${I} ጥ 2: ለ Dropshipping ድጋፍ ታደርጋላችሁ?</b>\nአዎ፣ ለ dropshipping፣ ለኢ-ኮሜርስ እና ለፍሪላንስ አፕሊኬሽኖች የሚሆኑ የተሟሉ ስትራቴጂዎችን፣ የዌብሳይት ግንባታዎችን እና አውቶሜሽኖችን እንሰራለን።\n\n<b>${I} ጥ 3: ፕሮጀክት ለመጨረስ ምን ያህል ጊዜ ይፈጃል?</b>\nጊዜው እንደየ ጥቅሉ ይለያያል። የ Ascent ጥቅል በጥቂት ሳምንታት ሲጠናቀቅ፣ ከፍተኛው ה Zenith ጥቅል ግን ሰፊ የዴቨሎፕመንት ጊዜ ይፈልጋል።`;
    ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(`${I} ተመለስ`, 'back_am')]]).reply_markup });
});

// Packages - Amharic
bot.action('pkg_am', (ctx) => {
    const text = `<b>${I} የጥቅል ዝርዝሮች</b>\n
<b>${I} 1. Ascent (የመጀመሪያው እርምጃ)</b>
አዲስ ለሚጀምሩ ወይም ገና ዲጂታል መገኘት ለሚገነቡ ድርጅቶች።
${I} የብራንዲንግ መሰረት፦ ፕሮፌሽናል ሎጎ፣ የከለር ምርጫ እና የፅሁፍ አይነቶች።
${I} የገፅ ግንባታ፦ የፌስቡክ፣ ኢንስታግራም እና ቲክቶክ ገጾችን ፕሮፌሽናል በሆነ መልኩ መክፈትና ማስተካከል።
${I} ስልታዊ ይዘቶች፦ በወር 10 ጥራት ያላቸው ፖስቶች።
${I} የተከታዮች መስተጋብር፦ ለኮሜንቶች እና ለዲኤም (DM) ፈጣን ምላሽ መስጠት።
${I} የነፃ ምክር አገልግሎት፦ የንግድዎን እንቅስቃሴ የሚገመግም ምክር።

<b>${I} 2. Apex (የሽያጭ ማሳደጊያ)</b>
ደንበኞችን በብዛት ለመሳብ እና ሽያጭን ለመጨመር ለሚፈልጉ።
${I} ተፅዕኖ ፈጣሪ ፅሁፎች፦ ሰውን የሚስቡ እና ወደ ሽያጭ የሚቀይሩ (Hook, Story & CTA) ፅሁፎች።
${I} የማስታወቂያ አስተዳደር፦ 5 ውጤታማ የሚከፈልባቸው ማስታወቂያዎች (ለTraffic እና Lead Generation)።
${I} የጎግል የበላይነት፦ ድርጅትዎን ጎግል ማፕ ላይ ማስገባት እና የደንበኞች አስተያየት (Review) ማስተዳደር።
${I} የእለት ተእለት ተደራሽነት፦ በየቀኑ የሚወጡ ስቶሪዎች እና ተከታታይ ስራዎች።
${I} የነፃ ምክር አገልግሎት ተካቷል።

<b>${I} 3. Zenith (የንግድ ግዛት መገንቢያ)</b>
ሙሉ በሙሉ የዲጂታል አለሙን ለመቆጣጠር ለሚፈልጉ ትላልቅ ድርጅቶች።
${I} የይዘት ጋጋታ፦ በወር ከ20 በላይ ጥራት ያላቸው ፖስቶች እና ቪዲዮዎች።
${I} ራስ-ሰር የሽያጭ መንገድ፦ ዘመናዊ ዌብሳይት እና የቴሌግራም ቦት (Bot)።
${I} ዳግም ማነጣጠር (Retargeting)፦ የፒክሰል ቴክኖሎጂን በመጠቀም ፍላጎት ያሳዩ ደንበኞችን መልሶ ማግኘት።
${I} SEO & Digital PR፦ በጎግል ፍለጋ ላይ ቀዳሚ መሆን እና የንግድዎን ስም ማስፋፋት።
${I} የአሰራር ስርአት (SOP)፦ ለድርጅትዎ የዲጂታል አሰራር ማንዋል ማዘጋጀት።
${I} የApex መስራች ድጋፍ፦ ከድርጅቱ መስራች ጋር ቀጥተኛ የሆነ የስትራቴጂ ድጋፍ።`;
    ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(`${I} ተመለስ`, 'back_am')]]).reply_markup });
});

// Services - Amharic
bot.action('srv_am', (ctx) => {
    const text = `<b>${I} ተጨማሪ ነጠላ አገልግሎቶች</b>\n\n${I} ፕሮፌሽናል የሎጎ ዲዛይን\n${I} የቴሌግራም ቦት ዝግጅት\n${I} የዌብሳይት ስራ\n${I} የሶሻል ሚዲያ ኦዲት (ባለሙያ ገምጋሚ)\n${I} የቢዝነስ ካርድ ዲዛይን\n${I} የስትራቴጂ ምክር`;
    ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback(`${I} ተመለስ`, 'back_am')]]).reply_markup });
});

// Contact - Amharic
bot.action('cnt_am', (ctx) => {
    const text = `<b>${I} ያግኙን</b>\n\nኢሜይል: apexsolutions.et@gmail.com\nለማናገር ከታች ያሉትን አማራጮች ይጠቀሙ፦`;
    ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.url(`${I} ቴሌግራም`, 'https://t.me/ApexDigitalET'), Markup.button.url(`${I} ኢንስታግራም`, 'https://instagram.com/apexdigital.et')],
            [Markup.button.url(`${I} ፌስቡክ`, 'https://www.facebook.com/share/1BMRntd8DQ/'), Markup.button.url(`${I} ቲክቶክ`, 'https://tiktok.com/@apexdigital.et')],
            [Markup.button.callback(`${I} ተመለስ`, 'back_am')]
        ]).reply_markup 
    });
});

bot.launch();
