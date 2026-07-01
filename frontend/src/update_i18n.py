import json
import re

file_path = "d:/Projects/Styx/frontend/src/i18n.js"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# We need to parse the object, but it's a JS file.
# The easiest way is to inject the new keys right before the closing brace of each translation object.

new_keys = {
  "en": {
      "dash.info.total": "Total number of active APIs currently managed in the infrastructure",
      "dash.info.zombies": "APIs that receive traffic but are not formally documented or maintained",
      "dash.info.risk": "Average combined security and lifecycle risk score across all APIs",
      "dash.info.alerts": "Unresolved security and operational alerts requiring attention",
      "dash.info.trend": "Historical view of API traffic categorized by lifecycle status over time.",
      "dash.info.status": "Current snapshot of your APIs categorized by their documented lifecycle status.",
      "dash.chart.title.live": "Live API Lifecycle Trend",
      "dash.chart.title.24h": "24-Hour API Lifecycle Trend",
      "dash.chart.title.7d": "7-Day API Lifecycle Trend",
      
      "ana.title": "Executive Analytics Dashboard",
      "ana.subtitle": "Organization-wide API risk posture and deterministic threat scoring",
      "ana.kpi.managed": "Total Managed APIs",
      "ana.kpi.managed.info": "The total number of active API endpoints managed and monitored across your infrastructure.",
      "ana.kpi.zombies": "Zombie APIs",
      "ana.kpi.zombies.info": "Endpoints that are still receiving traffic but lack proper ownership, documentation, or maintenance.",
      "ana.kpi.zombies.desc": "Abandoned / undocumented",
      "ana.kpi.shadow": "Shadow APIs",
      "ana.kpi.shadow.info": "APIs deployed outside of official development channels and standard security governance.",
      "ana.kpi.shadow.desc": "Undocumented but active",
      "ana.kpi.critical": "Critical Risk Assets",
      "ana.kpi.critical.info": "APIs with a combined risk score exceeding 70%, requiring immediate remediation.",
      "ana.kpi.critical.desc": ">70% combined risk score",
      "ana.chart.desc": "Historical tracking of API abandonment vs active endpoints",
      "ana.chart.trend": "Trend:",
      "ana.chart.info": "Visualizes the historical trend of API lifecycle states, allowing you to correlate security posture with infrastructure changes.",
      "ana.top.title": "Top {{count}} Highest Risk APIs",
      "ana.top.info": "A prioritized list of endpoints with the highest combined lifecycle and security risk scores.",
      "ana.top.risk_label": "Lifecycle Risk",
      "ana.top.sec_label": "Security Findings",
      "ana.zombies": "Zombies",
      
      "ebpf.title": "eBPF Collector",
      "ebpf.events": "Events",
      
      "chat.header": "Styx AI Assistant",
      "chat.sub": "Powered by llama3",
      "chat.placeholder": "Ask about your APIs...",
      "chat.offline": "⚠️ *I am currently offline or unable to reach my neural network. Please check your local Ollama connection.*",
      "chat.greeting": "Hello! I am Styx-AI. How can I assist you with your API ecosystem today?",
      
      "alerts.info": "Live feed of system security events, vulnerabilities, and operational alerts requiring team attention.",
      "inv.info": "A comprehensive registry of all discovered API endpoints across your enterprise environments.",
      "sec.info": "In-depth vulnerability assessment and automated risk scoring matrix for all registered APIs.",
      "sim.info": "Interactive sandbox to predict and visualize the impact of decommissioning APIs on dependent systems.",
      "graph.info": "Interactive node graph displaying service-to-service communication paths and endpoint dependencies."
  },
  "hi": {
      "dash.info.total": "बुनियादी ढांचे में वर्तमान में प्रबंधित सक्रिय एपीआई की कुल संख्या",
      "dash.info.zombies": "एपीआई जो ट्रैफ़िक प्राप्त करते हैं लेकिन औपचारिक रूप से प्रलेखित या अनुरक्षित नहीं हैं",
      "dash.info.risk": "सभी एपीआई में औसत संयुक्त सुरक्षा और जीवनचक्र जोखिम स्कोर",
      "dash.info.alerts": "असुलझी सुरक्षा और परिचालन चेतावनियाँ जिन पर ध्यान देने की आवश्यकता है",
      "dash.info.trend": "समय के साथ जीवनचक्र स्थिति के आधार पर एपीआई ट्रैफ़िक का ऐतिहासिक दृश्य।",
      "dash.info.status": "प्रलेखित जीवनचक्र स्थिति के आधार पर आपके एपीआई का वर्तमान स्नैपशॉट।",
      "dash.chart.title.live": "लाइव एपीआई जीवनचक्र रुझान",
      "dash.chart.title.24h": "24-घंटे एपीआई जीवनचक्र रुझान",
      "dash.chart.title.7d": "7-दिवसीय एपीआई जीवनचक्र रुझान",
      
      "ana.title": "कार्यकारी एनालिटिक्स डैशबोर्ड",
      "ana.subtitle": "संगठन-व्यापी एपीआई जोखिम मुद्रा और निर्धारक खतरे का स्कोरिंग",
      "ana.kpi.managed": "कुल प्रबंधित एपीआई",
      "ana.kpi.managed.info": "आपके बुनियादी ढांचे में प्रबंधित और मॉनिटर किए गए सक्रिय एपीआई की कुल संख्या।",
      "ana.kpi.zombies": "ज़ोम्बी एपीआई",
      "ana.kpi.zombies.info": "एंडपॉइंट्स जो अभी भी ट्रैफ़िक प्राप्त कर रहे हैं लेकिन उनमें उचित स्वामित्व या रखरखाव का अभाव है।",
      "ana.kpi.zombies.desc": "परित्यक्त / अप्रलेखित",
      "ana.kpi.shadow": "शैडो एपीआई",
      "ana.kpi.shadow.info": "आधिकारिक विकास चैनलों और मानक सुरक्षा प्रशासन के बाहर तैनात एपीआई।",
      "ana.kpi.shadow.desc": "अप्रलेखित लेकिन सक्रिय",
      "ana.kpi.critical": "गंभीर जोखिम संपत्तियां",
      "ana.kpi.critical.info": "70% से अधिक संयुक्त जोखिम स्कोर वाले एपीआई, जिन्हें तत्काल सुधारात्मक कार्रवाई की आवश्यकता है।",
      "ana.kpi.critical.desc": ">70% संयुक्त जोखिम स्कोर",
      "ana.chart.desc": "सक्रिय एंडपॉइंट्स बनाम एपीआई परित्याग की ऐतिहासिक ट्रैकिंग",
      "ana.chart.trend": "रुझान:",
      "ana.chart.info": "एपीआई जीवनचक्र राज्यों के ऐतिहासिक रुझान की कल्पना करता है।",
      "ana.top.title": "शीर्ष {{count}} उच्चतम जोखिम वाले एपीआई",
      "ana.top.info": "उच्चतम संयुक्त जीवनचक्र और सुरक्षा जोखिम स्कोर वाले एंडपॉइंट्स की प्राथमिकता सूची।",
      "ana.top.risk_label": "जीवनचक्र जोखिम",
      "ana.top.sec_label": "सुरक्षा निष्कर्ष",
      "ana.zombies": "ज़ोम्बी",
      
      "ebpf.title": "eBPF कलेक्टर",
      "ebpf.events": "घटनाएं",
      
      "chat.header": "स्टिक्स एआई सहायक",
      "chat.sub": "llama3 द्वारा संचालित",
      "chat.placeholder": "अपने एपीआई के बारे में पूछें...",
      "chat.offline": "⚠️ *मैं अभी ऑफ़लाइन हूँ या अपने न्यूरल नेटवर्क तक पहुँचने में असमर्थ हूँ।*",
      "chat.greeting": "नमस्ते! मैं Styx-AI हूँ। मैं आज आपके एपीआई इकोसिस्टम में आपकी कैसे मदद कर सकता हूँ?",
      
      "alerts.info": "सिस्टम सुरक्षा घटनाओं, कमजोरियों और परिचालन चेतावनियों की लाइव फ़ीड।",
      "inv.info": "आपके एंटरप्राइज़ वातावरण में खोजे गए सभी एपीआई एंडपॉइंट्स की एक व्यापक रजिस्ट्री।",
      "sec.info": "सभी पंजीकृत एपीआई के लिए गहन भेद्यता मूल्यांकन और स्वचालित जोखिम स्कोरिंग मैट्रिक्स।",
      "sim.info": "निर्भर प्रणालियों पर एपीआई डिकमिशनिंग के प्रभाव का अनुमान लगाने और कल्पना करने के लिए इंटरैक्टिव सैंडबॉक्स।",
      "graph.info": "सेवा-से-सेवा संचार पथों और एंडपॉइंट निर्भरताओं को प्रदर्शित करने वाला इंटरैक्टिव नोड ग्राफ़।"
  },
  "ta": {
      "dash.info.total": "உள்கட்டமைப்பில் தற்போது நிர்வகிக்கப்படும் செயலில் உள்ள APIகளின் மொத்த எண்ணிக்கை",
      "dash.info.zombies": "போக்குவரத்தைப் பெறும் ஆனால் முறையாக ஆவணப்படுத்தப்படாத அல்லது பராமரிக்கப்படாத APIகள்",
      "dash.info.risk": "அனைத்து APIகளிலும் சராசரி ஒருங்கிணைந்த பாதுகாப்பு மற்றும் வாழ்க்கை சுழற்சி ஆபத்து மதிப்பெண்",
      "dash.info.alerts": "கவனம் செலுத்த வேண்டிய தீர்க்கப்படாத பாதுகாப்பு மற்றும் செயல்பாட்டு எச்சரிக்கைகள்",
      "dash.info.trend": "காலப்போக்கில் வாழ்க்கை சுழற்சி நிலையின் அடிப்படையில் வகைப்படுத்தப்பட்ட API போக்குவரத்தின் வரலாற்றுப் பார்வை.",
      "dash.info.status": "ஆவணப்படுத்தப்பட்ட வாழ்க்கை சுழற்சி நிலையின் அடிப்படையில் உங்கள் APIகளின் தற்போதைய ஸ்னாப்ஷாட்.",
      "dash.chart.title.live": "நேரடி API வாழ்க்கை சுழற்சி போக்கு",
      "dash.chart.title.24h": "24-மணிநேர API வாழ்க்கை சுழற்சி போக்கு",
      "dash.chart.title.7d": "7-நாள் API வாழ்க்கை சுழற்சி போக்கு",
      
      "ana.title": "செயல்திட்ட பகுப்பாய்வு டேஷ்போர்டு",
      "ana.subtitle": "நிறுவன அளவிலான API ஆபத்து நிலை மற்றும் அச்சுறுத்தல் மதிப்பெண்",
      "ana.kpi.managed": "மொத்த நிர்வகிக்கப்பட்ட APIகள்",
      "ana.kpi.managed.info": "உங்கள் உள்கட்டமைப்பில் நிர்வகிக்கப்படும் செயலில் உள்ள APIகளின் மொத்த எண்ணிக்கை.",
      "ana.kpi.zombies": "ஜோம்பி APIகள்",
      "ana.kpi.zombies.info": "பயன்பாட்டில் உள்ள ஆனால் முறையான உரிமை அல்லது பராமரிப்பு இல்லாத எண்ட்பாயிண்ட்கள்.",
      "ana.kpi.zombies.desc": "கைவிடப்பட்ட / ஆவணப்படுத்தப்படாத",
      "ana.kpi.shadow": "நிழல் APIகள்",
      "ana.kpi.shadow.info": "அதிகாரப்பூர்வ மேம்பாட்டு சேனல்கள் மற்றும் நிலையான பாதுகாப்பு நிர்வாகத்திற்கு வெளியே பயன்படுத்தப்பட்ட APIகள்.",
      "ana.kpi.shadow.desc": "ஆவணப்படுத்தப்படாத ஆனால் செயலில் உள்ள",
      "ana.kpi.critical": "முக்கிய ஆபத்து சொத்துக்கள்",
      "ana.kpi.critical.info": "70% க்கு மேல் ஆபத்து மதிப்பெண் கொண்ட APIகள், உடனடி தீர்வு தேவை.",
      "ana.kpi.critical.desc": ">70% ஒருங்கிணைந்த ஆபத்து மதிப்பெண்",
      "ana.chart.desc": "செயலில் உள்ள எண்ட்பாயிண்ட்கள் மற்றும் API கைவிடப்பட்டதன் வரலாற்று கண்காணிப்பு",
      "ana.chart.trend": "போக்கு:",
      "ana.chart.info": "API வாழ்க்கை சுழற்சி நிலைகளின் வரலாற்றுப் போக்கை காட்சிப்படுத்துகிறது.",
      "ana.top.title": "முதல் {{count}} அதிக ஆபத்துள்ள APIகள்",
      "ana.top.info": "அதிக ஆபத்து மதிப்பெண்கள் கொண்ட எண்ட்பாயிண்ட்களின் முன்னுரிமைப் பட்டியல்.",
      "ana.top.risk_label": "வாழ்க்கை சுழற்சி ஆபத்து",
      "ana.top.sec_label": "பாதுகாப்பு கண்டுபிடிப்புகள்",
      "ana.zombies": "ஜோம்பிகள்",
      
      "ebpf.title": "eBPF சேகரிப்பாளர்",
      "ebpf.events": "நிகழ்வுகள்",
      
      "chat.header": "Styx AI உதவியாளர்",
      "chat.sub": "llama3 மூலம் இயக்கப்படுகிறது",
      "chat.placeholder": "உங்கள் APIகளைப் பற்றி கேளுங்கள்...",
      "chat.offline": "⚠️ *நான் தற்போது ஆஃப்லைனில் இருக்கிறேன்.*",
      "chat.greeting": "வணக்கம்! நான் Styx-AI. உங்கள் API சுற்றுச்சூழல் அமைப்புக்கு நான் எவ்வாறு உதவ முடியும்?",
      
      "alerts.info": "கணினி பாதுகாப்பு நிகழ்வுகள், பாதிப்புகள் மற்றும் செயல்பாட்டு எச்சரிக்கைகளின் நேரடி ஊட்டங்கள்.",
      "inv.info": "உங்கள் நிறுவன சூழல்களில் கண்டுபிடிக்கப்பட்ட அனைத்து API எண்ட்பாயிண்ட்களின் விரிவான பதிவேடு.",
      "sec.info": "அனைத்து பதிவுசெய்யப்பட்ட APIகளுக்கான ஆழமான பாதிப்பு மதிப்பீடு மற்றும் தானியங்கி ஆபத்து ஸ்கோரிங் மேட்ரிக்ஸ்.",
      "sim.info": "சார்பு அமைப்புகளில் API நீக்குதலின் தாக்கத்தை கணிக்க ஊடாடும் சாண்ட்பாக்ஸ்.",
      "graph.info": "சேவைக்கு சேவை தகவல்தொடர்பு மற்றும் எண்ட்பாயிண்ட் சார்புகளைக் காட்டும் ஊடாடும் வரைபடம்."
  },
  "te": {
      "dash.info.total": "మౌలిక సదుపాయాలలో ప్రస్తుతం నిర్వహించబడుతున్న క్రియాశీల APIల మొత్తం సంఖ్య",
      "dash.info.zombies": "ట్రాఫిక్‌ను స్వీకరించే కానీ అధికారికంగా పత్రాలు లేని APIలు",
      "dash.info.risk": "అన్ని APIలలో సగటు భద్రత మరియు జీవిత చక్రం ప్రమాద స్కోరు",
      "dash.info.alerts": "శ్రద్ధ అవసరమయ్యే పరిష్కరించని భద్రతా మరియు కార్యాచరణ హెచ్చరికలు",
      "dash.info.trend": "జీవిత చక్ర స్థితి ఆధారంగా API ట్రాఫిక్ యొక్క చారిత్రక వీక్షణ.",
      "dash.info.status": "పత్రబద్ధం చేయబడిన జీవిత చక్ర స్థితి ఆధారంగా మీ APIల ప్రస్తుత స్నాప్‌షాట్.",
      "dash.chart.title.live": "లైవ్ API జీవిత చక్రం ట్రెండ్",
      "dash.chart.title.24h": "24-గంటల API జీవిత చక్రం ట్రెండ్",
      "dash.chart.title.7d": "7-రోజుల API జీవిత చక్రం ట్రెండ్",
      
      "ana.title": "ఎగ్జిక్యూటివ్ అనలిటిక్స్ డాష్‌బోర్డ్",
      "ana.subtitle": "సంస్థ-వ్యాప్త API ప్రమాద భంగిమ మరియు ముప్పు స్కోరింగ్",
      "ana.kpi.managed": "మొత్తం నిర్వహించబడే APIలు",
      "ana.kpi.managed.info": "మీ మౌలిక సదుపాయాలలో నిర్వహించబడే క్రియాశీల APIల మొత్తం సంఖ్య.",
      "ana.kpi.zombies": "జాంబీ APIలు",
      "ana.kpi.zombies.info": "ఇప్పటికీ ట్రాఫిక్‌ను స్వీకరిస్తున్న కానీ సరైన నిర్వహణ లేని ఎండ్‌పాయింట్‌లు.",
      "ana.kpi.zombies.desc": "వదిలివేయబడినవి / పత్రాలు లేనివి",
      "ana.kpi.shadow": "షాడో APIలు",
      "ana.kpi.shadow.info": "అధికారిక అభివృద్ధి మార్గాల వెలుపల మోహరించబడిన APIలు.",
      "ana.kpi.shadow.desc": "పత్రాలు లేనివి కానీ క్రియాశీలమైనవి",
      "ana.kpi.critical": "క్లిష్టమైన ప్రమాద ఆస్తులు",
      "ana.kpi.critical.info": "70% కంటే ఎక్కువ ప్రమాద స్కోరు కలిగిన APIలు, తక్షణ పరిష్కారం అవసరం.",
      "ana.kpi.critical.desc": ">70% ప్రమాద స్కోరు",
      "ana.chart.desc": "క్రియాశీల ఎండ్‌పాయింట్‌ల వర్సెస్ API పరిత్యాగం యొక్క చారిత్రక ట్రాకింగ్",
      "ana.chart.trend": "ట్రెండ్:",
      "ana.chart.info": "API జీవిత చక్రం రాష్ట్రాల చారిత్రక ట్రెండ్‌ను దృశ్యమానం చేస్తుంది.",
      "ana.top.title": "అగ్ర {{count}} అత్యధిక ప్రమాదం గల APIలు",
      "ana.top.info": "అత్యధిక ప్రమాద స్కోర్‌లతో ఎండ్‌పాయింట్‌ల ప్రాధాన్యత జాబితా.",
      "ana.top.risk_label": "జీవిత చక్రం ప్రమాదం",
      "ana.top.sec_label": "భద్రతా అన్వేషణలు",
      "ana.zombies": "జాంబీస్",
      
      "ebpf.title": "eBPF కలెక్టర్",
      "ebpf.events": "సంఘటనలు",
      
      "chat.header": "Styx AI అసిస్టెంట్",
      "chat.sub": "llama3 ద్వారా ఆధారితం",
      "chat.placeholder": "మీ APIల గురించి అడగండి...",
      "chat.offline": "⚠️ *నేను ప్రస్తుతం ఆఫ్‌లైన్‌లో ఉన్నాను.*",
      "chat.greeting": "నమస్తే! నేను Styx-AI. ఈ రోజు మీ API పర్యావరణ వ్యవస్థతో నేను మీకు ఎలా సహాయం చేయగలను?",
      
      "alerts.info": "సిస్టమ్ భద్రతా సంఘటనలు, దుర్బలత్వాలు మరియు కార్యాచరణ హెచ్చరికల ప్రత్యక్ష ఫీడ్.",
      "inv.info": "కనుగొనబడిన అన్ని API ఎండ్‌పాయింట్‌ల సమగ్ర రిజిస్ట్రీ.",
      "sec.info": "అన్ని నమోదిత APIల కోసం భద్రతా మదింపు మరియు ఆటోమేటెడ్ రిస్క్ స్కోరింగ్ మ్యాట్రిక్స్.",
      "sim.info": "API డీకమిషనింగ్ ప్రభావాన్ని అంచనా వేయడానికి ఇంటరాక్టివ్ శాండ్‌బాక్స్.",
      "graph.info": "సేవల మధ్య కమ్యూనికేషన్ మరియు ఎండ్‌పాయింట్ డిపెండెన్సీలను చూపే ఇంటరాక్టివ్ గ్రాఫ్."
  },
  "ml": {
      "dash.info.total": "അടിസ്ഥാന സൗകര്യങ്ങളിൽ നിയന്ത്രിക്കുന്ന സജീവ API-കളുടെ ആകെ എണ്ണം",
      "dash.info.zombies": "ട്രാഫിക് ലഭിക്കുന്ന എന്നാൽ രേഖപ്പെടുത്തിയിട്ടില്ലാത്ത API-കൾ",
      "dash.info.risk": "എല്ലാ API-കളിലും ശരാശരി സംയുക്ത സുരക്ഷാ, ലൈഫ് സൈക്കിൾ റിസ്ക് സ്കോർ",
      "dash.info.alerts": "ശ്രദ്ധ നൽകേണ്ട പരിഹരിക്കപ്പെടാത്ത സുരക്ഷാ, പ്രവർത്തന അലേർട്ടുകൾ",
      "dash.info.trend": "ലൈഫ് സൈക്കിൾ സ്റ്റാറ്റസ് അടിസ്ഥാനമാക്കിയുള്ള API ട്രാഫിക്കിൻ്റെ ചരിത്രപരമായ കാഴ്ച.",
      "dash.info.status": "നിങ്ങളുടെ API-കളുടെ നിലവിലെ സ്നാപ്പ്ഷോട്ട്.",
      "dash.chart.title.live": "തത്സമയ API ലൈഫ് സൈക്കിൾ ട്രെൻഡ്",
      "dash.chart.title.24h": "24 മണിക്കൂർ API ലൈഫ് സൈക്കിൾ ട്രെൻഡ്",
      "dash.chart.title.7d": "7-ദിവസത്തെ API ലൈഫ് സൈക്കിൾ ട്രെൻഡ്",
      
      "ana.title": "എക്സിക്യൂട്ടീവ് അനലിറ്റിക്സ് ഡാഷ്‌ബോർഡ്",
      "ana.subtitle": "API റിസ്ക് പോസ്ചറും ത്രെറ്റ് സ്കോറിംഗും",
      "ana.kpi.managed": "ആകെ നിയന്ത്രിക്കുന്ന API-കൾ",
      "ana.kpi.managed.info": "നിയന്ത്രിക്കുന്ന സജീവ API-കളുടെ ആകെ എണ്ണം.",
      "ana.kpi.zombies": "സോംബി API-കൾ",
      "ana.kpi.zombies.info": "ട്രാഫിക് ലഭിക്കുന്ന എന്നാൽ പരിപാലനമില്ലാത്ത എൻഡ്‌പോയിൻ്റുകൾ.",
      "ana.kpi.zombies.desc": "ഉപേക്ഷിക്കപ്പെട്ടത് / രേഖകളില്ലാത്തത്",
      "ana.kpi.shadow": "ഷാഡോ API-കൾ",
      "ana.kpi.shadow.info": "ഔദ്യോഗിക ചാനലുകൾക്ക് പുറത്ത് വിന്യസിച്ച API-കൾ.",
      "ana.kpi.shadow.desc": "രേഖകളില്ലാത്ത എന്നാൽ സജീവമായത്",
      "ana.kpi.critical": "നിർണായക റിസ്ക് അസറ്റുകൾ",
      "ana.kpi.critical.info": "70% ത്തിലധികം റിസ്ക് സ്കോർ ഉള്ള API-കൾ, അടിയന്തര പരിഹാരം ആവശ്യമാണ്.",
      "ana.kpi.critical.desc": ">70% റിസ്ക് സ്കോർ",
      "ana.chart.desc": "സജീവ എൻഡ്‌പോയിൻ്റുകളും API ഉപേക്ഷിക്കലും സംബന്ധിച്ച ട്രാക്കിംഗ്",
      "ana.chart.trend": "ട്രെൻഡ്:",
      "ana.chart.info": "API ലൈഫ് സൈക്കിൾ സ്റ്റാറ്റസുകളുടെ ട്രെൻഡ് കാണിക്കുന്നു.",
      "ana.top.title": "ഏറ്റവും ഉയർന്ന റിസ്ക് ഉള്ള ആദ്യ {{count}} API-കൾ",
      "ana.top.info": "ഏറ്റവും ഉയർന്ന റിസ്ക് സ്കോറുകൾ ഉള്ള എൻഡ്‌പോയിൻ്റുകളുടെ മുൻഗണനാ പട്ടിക.",
      "ana.top.risk_label": "ലൈഫ് സൈക്കിൾ റിസ്ക്",
      "ana.top.sec_label": "സുരക്ഷാ കണ്ടെത്തലുകൾ",
      "ana.zombies": "സോമ്പികൾ",
      
      "ebpf.title": "eBPF കളക്ടർ",
      "ebpf.events": "ഇവൻ്റുകൾ",
      
      "chat.header": "Styx AI അസിസ്റ്റൻ്റ്",
      "chat.sub": "llama3 നൽകുന്നത്",
      "chat.placeholder": "നിങ്ങളുടെ API-കളെക്കുറിച്ച് ചോദിക്കുക...",
      "chat.offline": "⚠️ *ഞാൻ നിലവിൽ ഓഫ്‌ലൈനിലാണ്.*",
      "chat.greeting": "നമസ്കാരം! ഞാൻ Styx-AI ആണ്. നിങ്ങളുടെ API സംബന്ധിച്ച കാര്യങ്ങളിൽ ഞാൻ എങ്ങനെ സഹായിക്കണം?",
      
      "alerts.info": "സുരക്ഷാ സംഭവങ്ങളുടെയും അലേർട്ടുകളുടെയും തത്സമയ ഫീഡ്.",
      "inv.info": "കണ്ടെത്തിയ എല്ലാ API എൻഡ്‌പോയിൻ്റുകളുടെയും സമഗ്രമായ രജിസ്ട്രി.",
      "sec.info": "രജിസ്റ്റർ ചെയ്ത എല്ലാ API-കൾക്കുമുള്ള റിസ്ക് സ്കോറിംഗ് മാട്രിക്സ്.",
      "sim.info": "API ഡീകമ്മീഷനിംഗ് ആഘാതം വിലയിരുത്താനുള്ള സംവേദനാത്മക സാൻഡ്‌ബോക്സ്.",
      "graph.info": "സേവനങ്ങൾ തമ്മിലുള്ള ആശയവിനിമയവും ഡിപൻഡൻസികളും കാണിക്കുന്ന ഗ്രാഫ്."
  },
  "mr": {
      "dash.info.total": "पायाभूत सुविधांमध्ये व्यवस्थापित सक्रिय API ची एकूण संख्या",
      "dash.info.zombies": "API जे ट्रॅफिक प्राप्त करतात परंतु औपचारिकरित्या दस्तऐवजीकरण केलेले नाहीत",
      "dash.info.risk": "सर्व API मध्ये सरासरी एकत्रित सुरक्षा आणि जीवनचक्र जोखीम स्कोअर",
      "dash.info.alerts": "न सुटलेले सुरक्षा आणि ऑपरेशन्स अलर्ट ज्यावर लक्ष देणे आवश्यक आहे",
      "dash.info.trend": "जीवनचक्र स्थितीवर आधारित API ट्रॅफिकचे ऐतिहासिक दृश्य.",
      "dash.info.status": "तुमच्या API चा सद्य स्नॅपशॉट.",
      "dash.chart.title.live": "थेट API जीवनचक्र ट्रेंड",
      "dash.chart.title.24h": "24-तास API जीवनचक्र ट्रेंड",
      "dash.chart.title.7d": "7-दिवसीय API जीवनचक्र ट्रेंड",
      
      "ana.title": "एक्झिक्युटिव्ह ॲनालिटिक्स डॅशबोर्ड",
      "ana.subtitle": "संस्था-व्यापी API जोखीम स्थिती आणि थ्रेट स्कोअरिंग",
      "ana.kpi.managed": "एकूण व्यवस्थापित API",
      "ana.kpi.managed.info": "तुमच्या पायाभूत सुविधांमध्ये व्यवस्थापित सक्रिय API ची एकूण संख्या.",
      "ana.kpi.zombies": "झोम्बी API",
      "ana.kpi.zombies.info": "असे एंडपॉइंट्स जे अजूनही ट्रॅफिक प्राप्त करत आहेत परंतु योग्य मालकी नाही.",
      "ana.kpi.zombies.desc": "सोडून दिलेले / अदस्तऐवजीकृत",
      "ana.kpi.shadow": "शॅडो API",
      "ana.kpi.shadow.info": "अधिकृत विकास चॅनेलच्या बाहेर तैनात केलेले API.",
      "ana.kpi.shadow.desc": "अदस्तऐवजीकृत परंतु सक्रिय",
      "ana.kpi.critical": "गंभीर जोखीम मालमत्ता",
      "ana.kpi.critical.info": "70% पेक्षा जास्त जोखीम स्कोअर असलेले API, त्वरित उपाय आवश्यक.",
      "ana.kpi.critical.desc": ">70% जोखीम स्कोअर",
      "ana.chart.desc": "सक्रिय एंडपॉइंट्स वि API परित्याग याचे ट्रॅकिंग",
      "ana.chart.trend": "ट्रेंड:",
      "ana.chart.info": "API जीवनचक्र राज्यांच्या ऐतिहासिक ट्रेंडची कल्पना करते.",
      "ana.top.title": "शीर्ष {{count}} सर्वाधिक जोखीम असलेले API",
      "ana.top.info": "सर्वाधिक जोखीम स्कोअर असलेल्या एंडपॉइंट्सची प्राधान्य यादी.",
      "ana.top.risk_label": "जीवनचक्र जोखीम",
      "ana.top.sec_label": "सुरक्षा निष्कर्ष",
      "ana.zombies": "झोम्बी",
      
      "ebpf.title": "eBPF कलेक्टर",
      "ebpf.events": "इव्हेंट्स",
      
      "chat.header": "Styx AI असिस्टंट",
      "chat.sub": "llama3 द्वारा समर्थित",
      "chat.placeholder": "तुमच्या API बद्दल विचारा...",
      "chat.offline": "⚠️ *मी सध्या ऑफलाइन आहे.*",
      "chat.greeting": "नमस्कार! मी Styx-AI आहे. मी आज तुमच्या API इकोसिस्टममध्ये कशी मदत करू शकतो?",
      
      "alerts.info": "सुरक्षा घटना, भेद्यता आणि अलर्टचा थेट फीड.",
      "inv.info": "शोधलेल्या सर्व API एंडपॉइंट्सची सर्वसमावेशक नोंदणी.",
      "sec.info": "सर्व नोंदणीकृत API साठी सुरक्षा मूल्यांकन आणि स्वयंचलित जोखीम स्कोअरिंग मॅट्रिक्स.",
      "sim.info": "API डिकमिशनिंगच्या प्रभावाचा अंदाज लावण्यासाठी इंटरएक्टिव्ह सँडबॉक्स.",
      "graph.info": "सेवा संप्रेषण आणि एंडपॉइंट अवलंबित्व दर्शविणारा इंटरएक्टिव्ह आलेख."
  }
}

for lang, keys in new_keys.items():
    formatted_keys = "\n".join([f'      "{k}": "{v}",' for k, v in keys.items()])
    
    # We find the exact line for the language dict close
    pattern = rf'({lang}:\s*{{\s*translation:\s*{{)([\s\S]*?)(\n\s*}}\s*}})'
    match = re.search(pattern, content)
    if match:
        prefix = match.group(1)
        existing = match.group(2)
        suffix = match.group(3)
        
        # ensure existing ends with a comma if it doesn't
        if existing and not existing.rstrip().endswith(','):
            existing = existing.rstrip() + ",\n"
            
        content = content[:match.start()] + prefix + existing + formatted_keys + suffix + content[match.end():]


with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
