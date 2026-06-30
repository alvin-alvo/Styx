import os
import re

base_dir = "frontend/src"
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.jsx'):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            if "import { useTranslation } from 'react-i18next'," in content:
                content = content.replace("import { useTranslation } from 'react-i18next',", "import { useTranslation } from 'react-i18next';\nimport React,")
                
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(content)

print("Imports fixed.")
