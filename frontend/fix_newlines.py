import re

i18n_path = r'd:\Projects\Styx\frontend\src\i18n.js'
with open(i18n_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Fix the broken string for English
content = content.replace('"A very specific question!\nAccording to my real-time system state', '"A very specific question!\\nAccording to my real-time system state')
content = content.replace('moderate. Here\\\'s a breakdown of the potential impact:\nDirectly affected APIs:"', 'moderate. Here\\\'s a breakdown of the potential impact:\\nDirectly affected APIs:"')

# Fix for Hindi
content = content.replace('"एक बहुत ही विशिष्ट प्रश्न!\nमेरी वास्तविक समय प्रणाली स्थिति के अनुसार', '"एक बहुत ही विशिष्ट प्रश्न!\\nमेरी वास्तविक समय प्रणाली स्थिति के अनुसार')
content = content.replace('संभावित प्रभाव का विवरण दिया गया है:\nसीधे प्रभावित एपीआई:"', 'संभावित प्रभाव का विवरण दिया गया है:\\nसीधे प्रभावित एपीआई:"')

# Fix for Tamil
content = content.replace('"மிகவும் குறிப்பிட்ட கேள்வி!\nஎனது நிகழ்நேர சிஸ்டம் நிலையின்படி', '"மிகவும் குறிப்பிட்ட கேள்வி!\\nஎனது நிகழ்நேர சிஸ்டம் நிலையின்படி')
content = content.replace('சாத்தியமான தாக்கத்தின் விவரம் இதோ:\nநேரடியாக பாதிக்கப்பட்ட APIகள்:"', 'சாத்தியமான தாக்கத்தின் விவரம் இதோ:\\nநேரடியாக பாதிக்கப்பட்ட APIகள்:"')

# Fix for Telugu
content = content.replace('"చాలా నిర్దిష్టమైన ప్రశ్న!\nనా రియల్-టైమ్ సిస్టమ్ స్టేట్ ప్రకారం', '"చాలా నిర్దిష్టమైన ప్రశ్న!\\nనా రియల్-టైమ్ సిస్టమ్ స్టేట్ ప్రకారం')
content = content.replace('సంభావ్య ప్రభావం యొక్క విచ్ఛిన్నం ఇక్కడ ఉంది:\nప్రత్యక్షంగా ప్రభావితమైన APIలు:"', 'సంభావ్య ప్రభావం యొక్క విచ్ఛిన్నం ఇక్కడ ఉంది:\\nప్రత్యక్షంగా ప్రభావితమైన APIలు:"')

# Fix for Malayalam
content = content.replace('"വളരെ വ്യക്തമായ ചോദ്യം!\nഎൻ്റെ തത്സമയ സിസ്റ്റം അവസ്ഥ അനുസരിച്ച്', '"വളരെ വ്യക്തമായ ചോദ്യം!\\nഎൻ്റെ തത്സമയ സിസ്റ്റം അവസ്ഥ അനുസരിച്ച്')
content = content.replace('സാധ്യമായ ആഘാതത്തിൻ്റെ ഒരു തകർച്ച ഇതാ:\nനേരിട്ട് ബാധിച്ച API-കൾ:"', 'സാധ്യമായ ആഘാതത്തിൻ്റെ ഒരു തകർച്ച ഇതാ:\\nനേരിട്ട് ബാധിച്ച API-കൾ:"')

# Fix for Marathi
content = content.replace('"एक अतिशय विशिष्ट प्रश्न!\nमाझ्या रिअल-टाइम सिस्टम स्थितीनुसार', '"एक अतिशय विशिष्ट प्रश्न!\\nमाझ्या रिअल-टाइम सिस्टम स्थितीनुसार')
content = content.replace('संभाव्य प्रभावाचे ब्रेकडाउन येथे आहे:\nथेट प्रभावित API:"', 'संभाव्य प्रभावाचे ब्रेकडाउन येथे आहे:\\nथेट प्रभावित API:"')

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Fixed newlines in i18n.js")
