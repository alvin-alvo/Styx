import os

i18n_path = "frontend/src/i18n.js"
with open(i18n_path, "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace('"nav.dependencies"', '"nav.graph"')

with open(i18n_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Updated i18n.js successfully.")
