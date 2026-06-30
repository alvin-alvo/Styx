import os
import re

base_dir = "frontend/src"
for root, dirs, files in os.walk(base_dir):
    for f in files:
        if f.endswith('.jsx'):
            filepath = os.path.join(root, f)
            with open(filepath, "r", encoding="utf-8") as file:
                content = file.read()
            
            # The broken pattern looks like:
            # import React
            # import { useTranslation } from 'react-i18next';
            # import React, { useState
            
            # Let's just fix it manually using string replace for this exact pattern
            bad_string = "import React\nimport { useTranslation } from 'react-i18next';\nimport React,"
            if bad_string in content:
                content = content.replace(bad_string, "import React,\nimport { useTranslation } from 'react-i18next';\nimport {")
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(content)
            
            # Or if it replaced it like this:
            bad_string2 = "import React\nimport { useTranslation } from 'react-i18next';\nimport React from"
            if bad_string2 in content:
                content = content.replace(bad_string2, "import React from\nimport { useTranslation } from 'react-i18next';\n//")
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(content)

            # Another possibility is:
            # import React\nimport { useTranslation } from 'react-i18next';\nimport React\n
            
            # Let's use a regex to capture anything after the double React import
            pattern = r"import React\nimport \{ useTranslation \} from 'react-i18next';\nimport React"
            if re.search(pattern, content):
                content = re.sub(pattern, "import React\nimport { useTranslation } from 'react-i18next';", content)
                with open(filepath, "w", encoding="utf-8") as file:
                    file.write(content)
                    
            # Let's also check for Dashboard.jsx which might have a different pattern
            # Let's just catch all and fix.
print("Imports fixed again.")
