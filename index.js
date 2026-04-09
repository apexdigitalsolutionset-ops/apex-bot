const { Telegraf, Markup } = require('telegraf');
const express = require('express');
require('dotenv').config();

const app = express();
app.get('/', (req, res) => res.send('APEX Bot is Live!'));
app.listen(process.env.PORT || 3000);

const bot = new Telegraf(process.env.BOT_TOKEN);

const I = '➤'; // በተጠየቀው መሰረት ለዝርዝር ነጥቦች (Bullet points) ብቻ እንጠቀመዋለን

// --- Welcome Menu ---
bot.start(async (ctx) => {
    const welcomeText = `<b>APEX Digital Solution</b>\n<i>"Elevating Your Digital Presence to the Peak."</i>\n\nPlease select your language / እባክዎ ቋንቋ ይምረጡ`;
    
    await ctx.replyWithHTML(welcomeText, {
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('English', 'lang_en'), Markup.button.callback('አማርኛ', 'lang_am')]
        ]).reply_markup
    });
});

// ==========================================
// ENGLISH SECTION
// ==========================================

const menu_en = `<b>Main Menu</b>\nHow can we elevate your brand today?`;
const kb_en = Markup.inlineKeyboard([
    [Markup.button.callback('About Us', 'abt_en'), Markup.button.callback('FAQ', 'faq_en')],
    [Markup.button.callback('Service Packages', 'pkg_en')],
    [Markup.button.callback('Individual Services', 'srv_en')],
    [Markup.button.callback('Contact Us', 'cnt_en')],
    [Markup.button.webApp('Open APEX App', 'https://apex-agency-4f177.web.app')]
]);

// Main menu navigation
bot.action('lang_en', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(menu_en, { parse_mode: 'HTML', reply_markup: kb_en.reply_markup });
});
bot.action('back_en', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(menu_en, { parse_mode: 'HTML', reply_markup: kb_en.reply_markup });
});

// About Us - English
bot.action('abt_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>About Us</b>\n\nWe are APEX Digital Solution, a high-end digital agency dedicated to transforming businesses through premium UI/UX design, cutting-edge web development, and intelligent automation. We specialize in modern aesthetics like Glassmorphism and Apple-style smoothness, seamlessly integrated with AI tools and robust digital marketing strategies. From e-commerce and dropshipping to tailored freelance apps, we build digital experiences that drive growth.`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('Back', 'back_en')]]).reply_markup });
});

// FAQ - English
bot.action('faq_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>FAQ</b>\n\n<b>Q1: What makes APEX different?</b>\nWe focus on high-end, smooth user experiences (Apple-style smoothness) and leverage the latest AI tools and automation to streamline your business.\n\n<b>Q2: Do you support Dropshipping and E-commerce?</b>\nYes, we provide full strategies, platform setups, and automation tools specifically tailored for dropshipping, e-commerce, and freelance platforms.\n\n<b>Q3: How long does a project take?</b>\nTimelines vary. The Ascent package takes a few weeks, while the Zenith package requires comprehensive development time.`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('Back', 'back_en')]]).reply_markup });
});

// Packages Menu - English
bot.action('pkg_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>Service Packages</b>\nPlease select a package below to see details and pricing:`;
    const pkgs_kb = Markup.inlineKeyboard([
        [Markup.button.callback('Ascent', 'pkg_ascent_en'), Markup.button.callback('Apex', 'pkg_apex_en')],
        [Markup.button.callback('Zenith', 'pkg_zenith_en')],
        [Markup.button.callback('Back to Main Menu', 'back_en')]
    ]);
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: pkgs_kb.reply_markup });
});

// Package: Ascent
bot.action('pkg_ascent_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ The Foundation ]</b>\nIdeal for new businesses looking to establish a professional digital presence.\n\n${I} Branding Foundation: Custom Logo Design, Brand Color Palette, and Typography.\n${I} Page Authority: Setup and Optimization of Facebook, Instagram, and TikTok profiles.\n${I} Strategic Content: 10 High-quality Professional Posts per month.\n${I} Community Engagement: Basic Comment and DM management to keep your audience active.\n${I} Growth Consultation: Monthly expert advice to align your digital strategy.\n\n<b>Price:</b> 9,000 ETB`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 Pay', 'pay_action')],
            [Markup.button.callback('Back to Packages', 'pkg_en')]
        ]).reply_markup 
    });
});

// Package: Apex
bot.action('pkg_apex_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ The Growth Accelerator ]</b>\nDesigned for businesses ready to scale and generate consistent leads.\n\n${I} Conversion Copywriting: Compelling Hooks, Stories, and CTAs designed to sell.\n${I} Vantage Ad Management: 5 Targeted Ad Campaigns focused on Traffic and Lead Generation.\n${I} Google Authority (GMB): Full Google Maps setup and Review management for local search dominance.\n${I} Daily Dominance: Daily Story updates and consistent feed activity to stay top-of-mind.\n${I} Performance Tracking: Monthly reports on reach and lead quality.\n${I} Growth Consultation: Strategy sessions included.\n\n<b>Price:</b> 18,500 ETB`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 Pay', 'pay_action')],
            [Markup.button.callback('Back to Packages', 'pkg_en')]
        ]).reply_markup 
    });
});

// Package: Zenith
bot.action('pkg_zenith_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ The Empire Builder ]</b>\nThe ultimate all-in-one digital takeover for established brands.\n\n${I} Full-Spectrum Content: 20+ Posts/Reels per month covering all platforms.\n${I} Automated Sales Funnel: Custom Business Website + Interactive Telegram Bot.\n${I} Data Intelligence: Meta Pixel setup and Retargeting ads to win back lost customers.\n${I} SEO & Digital PR: Search Engine Optimization and online brand mentions.\n${I} SOP Development: Standardized Operating Procedures for your internal team.\n${I} Apex Founder Support: Direct 1-on-1 strategic consulting from the founder.\n\n<b>Price:</b> 50,000+ ETB`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 Pay', 'pay_action')],
            [Markup.button.callback('Back to Packages', 'pkg_en')]
        ]).reply_markup 
    });
});

// Services - English
bot.action('srv_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>Individual Services (Add-ons)</b>\n\n${I} Professional Logo Design - <b>2,500 ETB</b>\n${I} Custom Telegram Bot Development - <b>5,000+ ETB</b>\n${I} Premium Website Design - <b>15,000+ ETB</b>\n${I} Social Media Audit & Setup - <b>3,000 ETB</b>\n${I} Modern Business Card Design - <b>1,000 ETB</b>\n${I} Strategic Business Consultation - <b>2,000 ETB/hr</b>`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('Back', 'back_en')]]).reply_markup });
});

// Contact - English
bot.action('cnt_en', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>Contact Us</b>\n\nEmail: apexsolutions.et@gmail.com\nChoose a platform below to connect with us:`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.url('Telegram', 'https://t.me/ApexDigitalET'), Markup.button.url('Instagram', 'https://instagram.com/apexdigital.et')],
            [Markup.button.url('Facebook', 'https://www.facebook.com/share/1BMRntd8DQ/'), Markup.button.url('TikTok', 'https://tiktok.com/@apexdigital.et')],
            [Markup.button.callback('Back', 'back_en')]
        ]).reply_markup 
    });
});

// ==========================================
// AMHARIC SECTION
// ==========================================

const menu_am = `<b>ዋና ማውጫ</b>\nዛሬ የትኛውን አገልግሎት ይፈልጋሉ?`;
const kb_am = Markup.inlineKeyboard([
    [Markup.button.callback('ስለ እኛ', 'abt_am'), Markup.button.callback('ተደጋጋሚ ጥያቄዎች', 'faq_am')],
    [Markup.button.callback('የጥቅል ዝርዝሮች', 'pkg_am')],
    [Markup.button.callback('ተጨማሪ ነጠላ አገልግሎቶች', 'srv_am')],
    [Markup.button.callback('ያግኙን', 'cnt_am')],
    [Markup.button.webApp('ዌብ-አፕ ይክፈቱ', 'https://apex-agency-4f177.web.app')]
]);

bot.action('lang_am', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(menu_am, { parse_mode: 'HTML', reply_markup: kb_am.reply_markup });
});
bot.action('back_am', async (ctx) => {
    await ctx.answerCbQuery();
    await ctx.editMessageText(menu_am, { parse_mode: 'HTML', reply_markup: kb_am.reply_markup });
});

// About Us - Amharic
bot.action('abt_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>ስለ እኛ</b>\n\nAPEX Digital Solution የቢዝነስዎን ዲጂታል ገጽታ በከፍተኛ ጥራት (Premium) እና በዘመናዊ ቴክኖሎጂ የሚቀይር ኤጀንሲ ነው። በተለይም እንደ Glassmorphism ባሉ እጅግ ማራኪ የዲዛይን ጥበባቶች፣ በዘመናዊ ዌብሳይት እና አፕሊኬሽን ዴቨሎፕመንት፣ እንዲሁም በ AI እና በቢዝነስ አውቶሜሽን ላይ ትኩረት አድርገን እንሰራለን። ከኢ-ኮሜርስ እና Dropshipping ስትራቴጂዎች እስከ ሙሉ ዲጂታል ማርኬቲንግ ድረስ፤ ቢዝነስዎን ወደ ላቀ ደረጃ ለማድረስ እንተጋለን።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('ተመለስ', 'back_am')]]).reply_markup });
});

// FAQ - Amharic
bot.action('faq_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>ተደጋጋሚ ጥያቄዎች (FAQ)</b>\n\n<b>ጥ 1: APEXን የተለየ የሚያደርገው ምንድን ነው?</b>\nትኩረታችን ከፍተኛ ጥራት ባላቸው እና እጅግ ማራኪ (Premium) በሆኑ ዲዛይኖች ላይ ሲሆን፣ የ AI ቴክኖሎጂዎችን እና የቢዝነስ አውቶሜሽንን በመጠቀም ስራዎን እናቀልላለን።\n\n<b>ጥ 2: ለ Dropshipping ድጋፍ ታደርጋላችሁ?</b>\nአዎ፣ ለ dropshipping፣ ለኢ-ኮሜርስ እና ለፍሪላንስ አፕሊኬሽኖች የሚሆኑ የተሟሉ ስትራቴጂዎችን፣ የዌብሳይት ግንባታዎችን እና አውቶሜሽኖችን እንሰራለን።\n\n<b>ጥ 3: ፕሮጀክት ለመጨረስ ምን ያህል ጊዜ ይፈጃል?</b>\nጊዜው እንደየ ጥቅሉ ይለያያል። የ Ascent ጥቅል በጥቂት ሳምንታት ሲጠናቀቅ፣ ከፍተኛው ה Zenith ጥቅል ግን ሰፊ የዴቨሎፕመንት ጊዜ ይፈልጋል።`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('ተመለስ', 'back_am')]]).reply_markup });
});

// Packages Menu - Amharic
bot.action('pkg_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>የጥቅል ዝርዝሮች</b>\nየእያንዳንዱን ጥቅል ዝርዝር መረጃ እና ዋጋ ለማየት ከታች ይምረጡ፦`;
    const pkgs_kb = Markup.inlineKeyboard([
        [Markup.button.callback('Ascent', 'pkg_ascent_am'), Markup.button.callback('Apex', 'pkg_apex_am')],
        [Markup.button.callback('Zenith', 'pkg_zenith_am')],
        [Markup.button.callback('ወደ ዋና ማውጫ ተመለስ', 'back_am')]
    ]);
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: pkgs_kb.reply_markup });
});

// Package: Ascent (Amharic)
bot.action('pkg_ascent_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ የመጀመሪያው እርምጃ ]</b>\nአዲስ ለሚጀምሩ ወይም ገና ዲጂታል መገኘት ለሚገነቡ ድርጅቶች።\n\n${I} የብራንዲንግ መሰረት፦ ፕሮፌሽናል ሎጎ፣ የከለር ምርጫ እና የፅሁፍ አይነቶች።\n${I} የገፅ ግንባታ፦ የፌስቡክ፣ ኢንስታግራም እና ቲክቶክ ገጾችን ፕሮፌሽናል በሆነ መልኩ መክፈትና ማስተካከል።\n${I} ስልታዊ ይዘቶች፦ በወር 10 ጥራት ያላቸው ፖስቶች።\n${I} የተከታዮች መስተጋብር፦ ለኮሜንቶች እና ለዲኤም (DM) ፈጣን ምላሽ መስጠት።\n${I} የነፃ ምክር አገልግሎት፦ የንግድዎን እንቅስቃሴ የሚገመግም ምክር።\n\n<b>ዋጋ:</b> 9,000 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 ክፈይ', 'pay_action_am')],
            [Markup.button.callback('ወደ ጥቅል ዝርዝሮች ተመለስ', 'pkg_am')]
        ]).reply_markup 
    });
});

// Package: Apex (Amharic)
bot.action('pkg_apex_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ የሽያጭ ማሳደጊያ ]</b>\nደንበኞችን በብዛት ለመሳብ እና ሽያጭን ለመጨመር ለሚፈልጉ።\n\n${I} ተፅዕኖ ፈጣሪ ፅሁፎች፦ ሰውን የሚስቡ እና ወደ ሽያጭ የሚቀይሩ (Hook, Story & CTA) ፅሁፎች።\n${I} የማስታወቂያ አስተዳደር፦ 5 ውጤታማ የሚከፈልባቸው ማስታወቂያዎች (ለTraffic እና Lead Generation)።\n${I} የጎግል የበላይነት፦ ድርጅትዎን ጎግል ማፕ ላይ ማስገባት እና የደንበኞች አስተያየት (Review) ማስተዳደር።\n${I} የእለት ተእለት ተደራሽነት፦ በየቀኑ የሚወጡ ስቶሪዎች እና ተከታታይ ስራዎች።\n${I} የነፃ ምክር አገልግሎት ተካቷል።\n\n<b>ዋጋ:</b> 18,500 ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 ክፈይ', 'pay_action_am')],
            [Markup.button.callback('ወደ ጥቅል ዝርዝሮች ተመለስ', 'pkg_am')]
        ]).reply_markup 
    });
});

// Package: Zenith (Amharic)
bot.action('pkg_zenith_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>[ የንግድ ግዛት መገንቢያ ]</b>\nሙሉ በሙሉ የዲጂታል አለሙን ለመቆጣጠር ለሚፈልጉ ትላልቅ ድርጅቶች።\n\n${I} የይዘት ጋጋታ፦ በወር ከ20 በላይ ጥራት ያላቸው ፖስቶች እና ቪዲዮዎች።\n${I} ራስ-ሰር የሽያጭ መንገድ፦ ዘመናዊ ዌብሳይት እና የቴሌግራም ቦት (Bot)።\n${I} ዳግም ማነጣጠር (Retargeting)፦ የፒክሰል ቴክኖሎጂን በመጠቀም ፍላጎት ያሳዩ ደንበኞችን መልሶ ማግኘት።\n${I} SEO & Digital PR፦ በጎግል ፍለጋ ላይ ቀዳሚ መሆን እና የንግድዎን ስም ማስፋፋት።\n${I} የአሰራር ስርአት (SOP)፦ ለድርጅትዎ የዲጂታል አሰራር ማንዋል ማዘጋጀት።\n${I} የApex መስራች ድጋፍ፦ ከድርጅቱ መስራች ጋር ቀጥተኛ የሆነ የስትራቴጂ ድጋፍ።\n\n<b>ዋጋ:</b> 50,000+ ብር`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.callback('💳 ክፈይ', 'pay_action_am')],
            [Markup.button.callback('ወደ ጥቅል ዝርዝሮች ተመለስ', 'pkg_am')]
        ]).reply_markup 
    });
});

// Services - Amharic
bot.action('srv_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>ተጨማሪ ነጠላ አገልግሎቶች</b>\n\n${I} ፕሮፌሽናል የሎጎ ዲዛይን - <b>2,500 ብር</b>\n${I} የቴሌግራም ቦት ዝግጅት - <b>5,000+ ብር</b>\n${I} የዌብሳይት ስራ - <b>15,000+ ብር</b>\n${I} የሶሻል ሚዲያ ኦዲት (ባለሙያ ገምጋሚ) - <b>3,000 ብር</b>\n${I} የቢዝነስ ካርድ ዲዛይን - <b>1,000 ብር</b>\n${I} የስትራቴጂ ምክር - <b>2,000 ብር/በሰዓት</b>`;
    await ctx.editMessageText(text, { parse_mode: 'HTML', reply_markup: Markup.inlineKeyboard([[Markup.button.callback('ተመለስ', 'back_am')]]).reply_markup });
});

// Contact - Amharic
bot.action('cnt_am', async (ctx) => {
    await ctx.answerCbQuery();
    const text = `<b>ያግኙን</b>\n\nኢሜይል: apexsolutions.et@gmail.com\nለማናገር ከታች ያሉትን አማራጮች ይጠቀሙ፦`;
    await ctx.editMessageText(text, { 
        parse_mode: 'HTML', 
        reply_markup: Markup.inlineKeyboard([
            [Markup.button.url('ቴሌግራም', 'https://t.me/ApexDigitalET'), Markup.button.url('ኢንስታግራም', 'https://instagram.com/apexdigital.et')],
            [Markup.button.url('ፌስቡክ', 'https://www.facebook.com/share/1BMRntd8DQ/'), Markup.button.url('ቲክቶክ', 'https://tiktok.com/@apexdigital.et')],
            [Markup.button.callback('ተመለስ', 'back_am')]
        ]).reply_markup 
    });
});

// Pay Actions (Placeholder for payment gateway integration)
bot.action('pay_action', async (ctx) => {
    await ctx.answerCbQuery('Payment gateway integration coming soon!', { show_alert: true });
});

bot.action('pay_action_am', async (ctx) => {
    await ctx.answerCbQuery('የክፍያ አማራጮች በቅርቡ ይካተታሉ!', { show_alert: true });
});

bot.launch();
