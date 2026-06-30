import os
import re

base_dir = "frontend/src"
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.jsx'):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            # This is a mess, let's clean up line by line.
            lines = content.split('\n')
            
            clean_lines = []
            skip = False
            for line in lines:
                if line == "import React,":
                    continue
                if line == "import React":
                    continue
                if line == "import { useTranslation } from 'react-i18next';":
                    continue
                if line.startswith("import { {"):
                    line = line.replace("import { {", "import React, {")
                if line.startswith("import React, { {"):
                    line = line.replace("import React, { {", "import React, {")
                clean_lines.append(line)
            
            # Now we just inject our standard react and i18n imports at the top
            content = "\n".join(clean_lines)
            
            # ensure "import { useTranslation } from 'react-i18next';" is below standard react
            if "useTranslation" not in content and "export default function" in content:
                content = "import { useTranslation } from 'react-i18next';\n" + content
            elif "export default function" in content:
                content = "import { useTranslation } from 'react-i18next';\n" + content
            
            with open(filepath, "w", encoding="utf-8") as file:
                file.write(content)

print("Imports fixed properly.")
