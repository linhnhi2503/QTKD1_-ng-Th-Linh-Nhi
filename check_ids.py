import re

with open('index.html', 'r', encoding='utf-8') as f:
    text = f.read()

# find all document.getElementById('...') in scripts
script_text = ''
for s in re.findall(r'<script>(.*?)</script>', text, re.DOTALL):
    script_text += s + '\n'

element_ids = re.findall(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)', script_text)
unique_ids = sorted(list(set(element_ids)))

print(f'Checking {len(unique_ids)} unique element IDs accessed by scripts...')

missing = []
found = []
for eid in unique_ids:
    if f'id="{eid}"' in text or f"id='{eid}'" in text:
        found.append(eid)
    else:
        missing.append(eid)

print(f'Found: {len(found)}')
print(f'Missing: {len(missing)}')
if missing:
    print('MISSING IDS:')
    for m in missing:
        print(' -', m)
