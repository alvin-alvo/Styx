import json
import re

new_en = {
    "nav.home": "Home",
    "nav.product": "Product",
    "nav.pricing": "Pricing",
    "nav.contact": "Contact Us",
    "nav.product_soon": "Product features coming soon...",
    "nav.pricing_soon": "Pricing details coming soon...",
    "footer.terms": "Terms",
    "footer.privacy": "Privacy"
}

new_hi = {
    "nav.home": "होम",
    "nav.product": "उत्पाद",
    "nav.pricing": "मूल्य निर्धारण",
    "nav.contact": "संपर्क करें",
    "nav.product_soon": "उत्पाद सुविधाएँ जल्द ही आ रही हैं...",
    "nav.pricing_soon": "मूल्य निर्धारण विवरण जल्द ही आ रहा है...",
    "footer.terms": "शर्तें",
    "footer.privacy": "गोपनीयता"
}

new_ta = {
    "nav.home": "முகப்பு",
    "nav.product": "தயாரிப்பு",
    "nav.pricing": "விலை",
    "nav.contact": "தொடர்பு கொள்ள",
    "nav.product_soon": "தயாரிப்பு அம்சங்கள் விரைவில்...",
    "nav.pricing_soon": "விலை விவரங்கள் விரைவில்...",
    "footer.terms": "விதிமுறைகள்",
    "footer.privacy": "தனியுரிமை"
}

new_te = {
    "nav.home": "హోమ్",
    "nav.product": "ఉత్పత్తి",
    "nav.pricing": "ధరలు",
    "nav.contact": "సంప్రదించండి",
    "nav.product_soon": "ఉత్పత్తి లక్షణాలు త్వరలో వస్తున్నాయి...",
    "nav.pricing_soon": "ధరల వివరాలు త్వరలో వస్తున్నాయి...",
    "footer.terms": "నిబంధనలు",
    "footer.privacy": "గోప్యత"
}

new_ml = {
    "nav.home": "ഹോം",
    "nav.product": "ഉൽപ്പന്നം",
    "nav.pricing": "വില",
    "nav.contact": "ബന്ധപ്പെടുക",
    "nav.product_soon": "ഉൽപ്പന്ന സവിശേഷതകൾ ഉടൻ വരുന്നു...",
    "nav.pricing_soon": "വില വിവരങ്ങൾ ഉടൻ വരുന്നു...",
    "footer.terms": "നിബന്ധനകൾ",
    "footer.privacy": "സ്വകാര്യത"
}

new_mr = {
    "nav.home": "मुख्यपृष्ठ",
    "nav.product": "उत्पादन",
    "nav.pricing": "किंमत",
    "nav.contact": "संपर्क साधा",
    "nav.product_soon": "उत्पादन वैशिष्ट्ये लवकरच येत आहेत...",
    "nav.pricing_soon": "किंमतीचे तपशील लवकरच येत आहेत...",
    "footer.terms": "अटी",
    "footer.privacy": "गोपनीयता"
}

all_new = {
    "en": new_en,
    "hi": new_hi,
    "ta": new_ta,
    "te": new_te,
    "ml": new_ml,
    "mr": new_mr
}

i18n_path = r'd:\Projects\Styx\frontend\src\i18n.js'
with open(i18n_path, 'r', encoding='utf-8') as f:
    content = f.read()

for lang, keys in all_new.items():
    new_keys_str = ",\n".join([f'      "{k}": "{v}"' for k, v in keys.items()])
    pattern = rf'({lang}: {{\s*translation: {{)'
    content = re.sub(pattern, rf'\g<1>\n{new_keys_str},', content)

with open(i18n_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated i18n.js successfully with Nav and Footer translations.")
